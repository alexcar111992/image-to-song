# 10 - Monetization & Authentication

> Stripe payments, Google auth, usage limits, and paywall logic

## Overview

This document defines the business logic for the Image-to-Song Generator:
- **Free tier:** 1-2 song generations before paywall
- **Authentication:** Google Sign-In
- **Payments:** Stripe integration
- **Usage tracking:** Per-user generation limits

---

## User Journey with Monetization

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIRST VISIT (Anonymous)                       │
│                                                                  │
│     User uploads image → Generates song → SUCCESS               │
│                                                                  │
│     "You have 1 free song remaining"                            │
│                                                                  │
│     [Copy Song]  [Generate Another]                             │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SECOND GENERATION                              │
│                                                                  │
│     User uploads another image → Generates song → SUCCESS       │
│                                                                  │
│     "This was your last free song!"                             │
│     "Sign up to unlock unlimited songs"                         │
│                                                                  │
│     [Copy Song]  [Sign Up to Continue →]                        │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   THIRD ATTEMPT (Blocked)                        │
│                                                                  │
│     User tries to generate → PAYWALL                            │
│                                                                  │
│     ┌─────────────────────────────────────┐                     │
│     │  🎵 You've Used Your Free Songs!   │                     │
│     │                                     │                     │
│     │  Unlock unlimited song generation   │                     │
│     │  for just $X/month                  │                     │
│     │                                     │                     │
│     │  [Continue with Google] ← Sign in   │                     │
│     │                                     │                     │
│     │  ────────────────────────           │                     │
│     │                                     │                     │
│     │  [Subscribe - $X/month]             │                     │
│     │                                     │                     │
│     └─────────────────────────────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Usage Tracking

### Anonymous Users (No Account)

Track usage via browser storage (localStorage + fingerprint):

```javascript
// Store in localStorage
const usageData = {
  generationsUsed: 0,        // Increment on each generation
  maxFreeGenerations: 2,     // Configurable: 1 or 2
  firstGenerationAt: null,   // Timestamp
  lastGenerationAt: null,    // Timestamp
  deviceFingerprint: "hash"  // For cross-session tracking
}

// Check before allowing generation
function canGenerate() {
  const usage = getUsageData()
  return usage.generationsUsed < usage.maxFreeGenerations
}

// After successful generation
function recordGeneration() {
  const usage = getUsageData()
  usage.generationsUsed += 1
  usage.lastGenerationAt = Date.now()
  if (!usage.firstGenerationAt) {
    usage.firstGenerationAt = Date.now()
  }
  saveUsageData(usage)
}
```

### Logged-In Users (Google Account)

Track usage in database:

```javascript
// User record in database
const userRecord = {
  id: "google_user_id",
  email: "user@gmail.com",
  name: "User Name",
  profilePicture: "url",
  createdAt: "timestamp",
  
  subscription: {
    status: "free" | "active" | "cancelled" | "past_due",
    plan: null | "monthly" | "yearly",
    stripeCustomerId: "cus_xxx",
    stripeSubscriptionId: "sub_xxx",
    currentPeriodEnd: "timestamp",
    cancelAtPeriodEnd: false
  },
  
  usage: {
    totalGenerations: 0,
    freeGenerationsUsed: 0,
    freeGenerationsLimit: 2,
    lastGenerationAt: "timestamp"
  }
}
```

---

## Free Tier Configuration

### Option A: 1 Free Song
```javascript
const FREE_TIER_CONFIG = {
  maxGenerations: 1,
  showSignupPrompt: "after_first",  // Show immediately after first song
  blockAt: 2                         // Block on second attempt
}
```

### Option B: 2 Free Songs
```javascript
const FREE_TIER_CONFIG = {
  maxGenerations: 2,
  showSignupPrompt: "after_second", // Show after second song
  blockAt: 3                         // Block on third attempt
}
```

### Recommended: 2 Free Songs
- Gives users enough value to understand the product
- Second song shows consistency/quality
- Creates stronger conversion motivation

---

## Google Authentication

### Implementation with Firebase Auth (Recommended)

```javascript
// Firebase config
import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged 
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Sign in function
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Create/update user in your database
    await createOrUpdateUser({
      id: user.uid,
      email: user.email,
      name: user.displayName,
      profilePicture: user.photoURL
    })
    
    return user
  } catch (error) {
    console.error('Sign in failed:', error)
    throw error
  }
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    loadUserData(user.uid)
  } else {
    // User is signed out
    showAnonymousState()
  }
})
```

### Alternative: NextAuth.js

```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create user in database if new
      return true
    },
    async session({ session, token }) {
      // Add user ID to session
      session.userId = token.sub
      return session
    }
  }
})
```

---

## Stripe Integration

### Setup

1. Create Stripe account at stripe.com
2. Get API keys (test + live)
3. Create product and price in Stripe dashboard
4. Set up webhook endpoint

### Pricing Configuration

```javascript
// Stripe product/price IDs
const STRIPE_CONFIG = {
  products: {
    unlimited: {
      monthly: {
        priceId: 'price_monthly_xxx',
        amount: 999,  // $9.99
        interval: 'month'
      },
      yearly: {
        priceId: 'price_yearly_xxx',
        amount: 7999,  // $79.99 (save ~33%)
        interval: 'year'
      }
    }
  }
}
```

### Checkout Flow

```javascript
// Create Stripe checkout session
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function createCheckoutSession(userId, priceId) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,  // Pre-fill email
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/pricing`,
    metadata: {
      userId: userId
    }
  })
  
  return session.url
}
```

### Webhook Handler

```javascript
// Handle Stripe webhooks
async function handleStripeWebhook(event) {
  switch (event.type) {
    case 'checkout.session.completed':
      // Payment successful, activate subscription
      const session = event.data.object
      await activateSubscription(
        session.metadata.userId,
        session.subscription
      )
      break
      
    case 'customer.subscription.updated':
      // Subscription changed (upgrade/downgrade/cancel)
      const subscription = event.data.object
      await updateSubscriptionStatus(subscription)
      break
      
    case 'customer.subscription.deleted':
      // Subscription cancelled
      const cancelledSub = event.data.object
      await deactivateSubscription(cancelledSub)
      break
      
    case 'invoice.payment_failed':
      // Payment failed
      const invoice = event.data.object
      await handleFailedPayment(invoice)
      break
  }
}
```

### Subscription Status Check

```javascript
// Check if user has active subscription
async function hasActiveSubscription(userId) {
  const user = await getUser(userId)
  
  if (!user.subscription) return false
  if (user.subscription.status !== 'active') return false
  
  // Check if still within period
  const now = Date.now()
  const periodEnd = new Date(user.subscription.currentPeriodEnd).getTime()
  
  return now < periodEnd
}

// Full access check
async function canGenerate(userId) {
  // If logged in, check subscription
  if (userId) {
    const hasSubscription = await hasActiveSubscription(userId)
    if (hasSubscription) return { allowed: true, reason: 'subscribed' }
    
    // Check free tier for logged-in users
    const user = await getUser(userId)
    if (user.usage.freeGenerationsUsed < user.usage.freeGenerationsLimit) {
      return { 
        allowed: true, 
        reason: 'free_tier',
        remaining: user.usage.freeGenerationsLimit - user.usage.freeGenerationsUsed
      }
    }
    
    return { allowed: false, reason: 'limit_reached' }
  }
  
  // Anonymous user - check localStorage limit
  const localUsage = getLocalUsage()
  if (localUsage.generationsUsed < FREE_TIER_CONFIG.maxGenerations) {
    return {
      allowed: true,
      reason: 'anonymous_free',
      remaining: FREE_TIER_CONFIG.maxGenerations - localUsage.generationsUsed
    }
  }
  
  return { allowed: false, reason: 'anonymous_limit_reached' }
}
```

---

## UI Components for Monetization

### Usage Counter Display

```
After first song:
┌──────────────────────────────────┐
│ 🎵 1 of 2 free songs remaining  │
└──────────────────────────────────┘

After second song:
┌──────────────────────────────────┐
│ ⚠️ This was your last free song! │
│    Sign up to continue →         │
└──────────────────────────────────┘
```

### Paywall Modal

```
┌─────────────────────────────────────────────┐
│                                             │
│        🎵 Unlock Unlimited Songs            │
│                                             │
│   You've used your 2 free songs.            │
│   Subscribe to create unlimited songs       │
│   from any image!                           │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │  $9.99/month                        │   │
│   │  • Unlimited song generations       │   │
│   │  • Priority processing              │   │
│   │  • Cancel anytime                   │   │
│   │                                     │   │
│   │  [Subscribe Now]                    │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   ───────────── or ─────────────            │
│                                             │
│   [🔵 Continue with Google]                 │
│   Already subscribed? Sign in               │
│                                             │
└─────────────────────────────────────────────┘
```

### Subscription Success Page

```
┌─────────────────────────────────────────────┐
│                                             │
│        🎉 Welcome to Unlimited!             │
│                                             │
│   Your subscription is now active.          │
│   Start creating songs from any image!      │
│                                             │
│        [Start Creating →]                   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,          -- Google UID
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50),                   -- active, cancelled, past_due
  plan VARCHAR(50),                     -- monthly, yearly
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Usage Table

```sql
CREATE TABLE usage (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  generation_count INTEGER DEFAULT 0,
  free_generations_used INTEGER DEFAULT 0,
  last_generation_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Generations Table (Optional - for history)

```sql
CREATE TABLE generations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  song_title VARCHAR(255),
  lyrics TEXT,
  genre VARCHAR(100),
  tempo INTEGER,
  image_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Google Auth (Firebase or direct)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Prices
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Orchid AI
ORCHID_API_KEY=your-orchid-api-key
```

---

## Security Considerations

### Prevent Abuse

```javascript
// Rate limiting
const RATE_LIMITS = {
  anonymous: {
    maxPerHour: 5,
    maxPerDay: 10
  },
  free: {
    maxPerHour: 10,
    maxPerDay: 20
  },
  subscribed: {
    maxPerHour: 30,
    maxPerDay: 100
  }
}

// Device fingerprinting for anonymous users
// Use libraries like FingerprintJS to identify repeat visitors
// trying to bypass limits with cleared cookies
```

### Webhook Security

```javascript
// Verify Stripe webhook signatures
const sig = request.headers['stripe-signature']
const event = stripe.webhooks.constructEvent(
  request.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
)
```

---

## Summary: Implementation Checklist

### Phase 1: Free Tier
- [ ] Implement localStorage usage tracking
- [ ] Show usage counter after generation
- [ ] Block generation after limit reached
- [ ] Show paywall/signup prompt

### Phase 2: Authentication
- [ ] Set up Firebase/NextAuth with Google provider
- [ ] Create user records on first sign-in
- [ ] Sync anonymous usage to user account on sign-in
- [ ] Show logged-in state in UI

### Phase 3: Payments
- [ ] Create Stripe account and products
- [ ] Implement checkout session creation
- [ ] Set up webhook handler
- [ ] Handle subscription lifecycle events
- [ ] Show subscription status in UI

### Phase 4: Polish
- [ ] Add account settings page
- [ ] Implement subscription cancellation
- [ ] Add payment history
- [ ] Email notifications (welcome, payment, cancellation)

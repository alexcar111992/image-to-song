# 06 - UI/UX Guidelines

> Interface hints, user flow, and design recommendations

## Overview

This document provides guidance for the user interface without dictating exact designs. Focus on user experience, flow, and key interaction patterns.

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PAGE 1: UPLOAD                               │
│                                                                  │
│     "Turn Your Image Into a Song"                               │
│                                                                  │
│     ┌─────────────────────────────────────┐                     │
│     │                                     │                     │
│     │     Drop image here or browse       │                     │
│     │                                     │                     │
│     └─────────────────────────────────────┘                     │
│                                                                  │
│              [After upload: show preview]                        │
│                                                                  │
│                    [ Generate Song ]                             │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE 2: GENERATING                            │
│                                                                  │
│            [Blurred image as background]                         │
│                                                                  │
│     ● Reading your image...                                     │
│     ○ Finding the feeling...                                    │
│     ○ Writing your song...                                      │
│     ○ Adding the magic...                                       │
│                                                                  │
│     ═══════════════════════░░░░░░░░░░ 60%                       │
│                                                                  │
│            "Usually takes 15-30 seconds"                         │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PAGE 3: YOUR SONG                              │
│                                                                  │
│     🎉 Your Song Is Ready!                                      │
│                                                                  │
│     [Image thumb]  Genre: indie folk | 75 BPM | melancholic     │
│                                                                  │
│     ┌─────────────────────────────────────┐                     │
│     │                                     │                     │
│     │  [Verse 1]                          │                     │
│     │  The coffee's cold and you're...    │                     │
│     │                                     │                     │
│     │  [Chorus]                           │                     │
│     │  I'm counting hours in the dust...  │                     │
│     │                                     │                     │
│     └─────────────────────────────────────┘                     │
│                                                                  │
│     [ Copy Song ]  [ Generate Another ]  [ New Image ]          │
│                                                                  │
│     ─────────────────────────────────────────                   │
│                                                                  │
│     🎵 Bring It to Life with Suno AI                            │
│     1. Copy your song (done!)                                    │
│     2. Open Suno AI → [Button]                                   │
│     3. Paste and generate!                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page-by-Page Guidance

### Page 1: Upload

**Hero Section:**
- Clear value proposition: "Turn Your Image Into a Song"
- Subtitle explaining the magic: "Upload a photo. Get a unique, emotional song written just for it."

**Upload Area:**
- Large, obvious drop zone
- Support drag-and-drop AND click-to-browse
- Instant image preview after upload
- Fun micro-interaction on hover/drop

**Personality Elements:**
- Could include floating musical notes in background
- Subtle animations that feel playful
- Clear call-to-action button

**Key Interactions:**
- Hover on drop zone → Visual feedback
- File dropped → Immediate preview
- Invalid file → Friendly error message
- Generate button → Only active after valid upload

---

### Page 2: Generating

**Progress Communication:**
- Show multi-stage progress, not just a spinner
- Each stage feels purposeful:
  1. "Reading your image..." (analyzing)
  2. "Finding the feeling..." (interpreting)
  3. "Writing your song..." (generating)
  4. "Adding the magic..." (polishing)

**Visual Treatment:**
- Blurred version of uploaded image as background
- Creates connection between image and process
- Animated overlay (particles, waves, etc.)

**Time Expectation:**
- Show estimated time: "Usually takes 15-30 seconds"
- Progress bar with actual progress (not fake)

**Key Interactions:**
- No back button during processing (prevent double-generation)
- If error occurs → Clear message with retry option

---

### Page 3: Your Song

**Celebration Moment:**
- Brief celebration when song appears
- Make the user feel like they got something special

**Song Display:**
- Clean, formatted lyrics
- Clear section labels ([Verse 1], [Chorus], etc.)
- Easy-to-read font with good spacing
- Genre, tempo, mood visible but not dominant

**Action Buttons (Priority Order):**
1. **Copy Song** - Primary action, most prominent
2. **Generate Another** - Same image, new song
3. **Try Different Image** - Return to upload

**Suno Integration Section:**
- Clear 3-step guide:
  1. ✅ "You just copied your song"
  2. 🎵 "Click here to open Suno AI"
  3. 📋 "Paste your lyrics and hit generate"
- Big, obvious button to open Suno
- Maybe include a screenshot or illustration

**Footer Elements:**
- Share buttons (optional)
- "Upload another" prompt

---

## Design Hints

### Visual Direction

**Color Palette Suggestion:**
- Primary: Vibrant, energetic (electric blue, coral)
- Background: Dark, sophisticated (deep navy, dark purple)
- Text: High contrast for readability
- Accents: Playful highlights (neon yellow, bright pink)

**Typography:**
- Headings: Bold, rounded, friendly
- Body: Clean, readable
- Lyrics: Consider monospace or slightly stylized

**Animation Principles:**
- Micro-interactions on all buttons
- Smooth page transitions
- Progress indicators with personality
- Don't overdo it—serve the experience

### Mobile Considerations

- Single column layout
- Larger touch targets (min 44px)
- Simplified animations (performance)
- Sticky action buttons at bottom
- Upload area works with camera roll

### Accessibility

- High contrast text
- Alt text for images
- Keyboard navigation
- Screen reader friendly labels
- Focus indicators on interactive elements

---

## Interaction States

### Upload Area States

| State | Visual Treatment |
|-------|------------------|
| Default | Dashed border, subtle prompt |
| Hover | Border brightens, prompt changes |
| Drag over | Background shifts, "drop it!" |
| Invalid file | Red border, error message |
| Processing | Loading indicator |
| Success | Image preview, checkmark |

### Button States

| State | Visual Treatment |
|-------|------------------|
| Default | Filled, prominent |
| Hover | Slight scale or glow |
| Active/pressed | Slight depression |
| Disabled | Faded, no interaction |
| Loading | Spinner inside button |

### Copy Button Flow

```
[ Copy Song ] 
    ↓ click
[ Copied! ✓ ] (2 seconds)
    ↓ reset
[ Copy Song ]
```

---

## Error Handling

### Graceful Failures

| Error | User Message |
|-------|--------------|
| Invalid file type | "Oops! We need an image file (JPG, PNG, etc.)" |
| File too large | "That image is a bit too big. Try one under 10MB?" |
| Processing failed | "Something went wrong. Let's try that again." |
| Network error | "Lost connection. Check your internet and retry?" |

**Design Principle:** Never blame the user. Always offer a clear next step.

### Recovery Options

- Retry button for transient failures
- "Try different image" for persistent issues
- Contact/support option for stuck users

---

## Loading & Progress

### Progress Bar Design

- Don't use fake progress that doesn't reflect reality
- If actual progress known → Show real percentage
- If unknown duration → Use indeterminate but staged

### Stage Transitions

```
Stage 1: "Reading your image..."
  - Icon: Eye or scan symbol
  - Duration: ~20% of total

Stage 2: "Finding the feeling..."
  - Icon: Heart or emotion symbol
  - Duration: ~20% of total

Stage 3: "Writing your song..."
  - Icon: Pencil or musical note
  - Duration: ~45% of total (main AI work)

Stage 4: "Adding the magic..."
  - Icon: Sparkle or wand
  - Duration: ~15% of total
```

---

## Copy to Clipboard

### Essential Behavior

```javascript
// What gets copied
const copyContent = `
[Song Title]

[Verse 1]
lyrics here...

[Chorus]
lyrics here...

...

---
🎵 Style tags for Suno: indie folk, acoustic, melancholic
`
```

### Copy Confirmation

- Visual feedback (button text changes)
- Optional: toast notification
- Clipboard API with fallback for older browsers

---

## Share Functionality (Optional)

If implementing share:

- Generate shareable image with lyrics overlay
- Or link to shareable page
- Platform options: Twitter/X, Instagram, TikTok, Copy Link

**Privacy Note:** Don't share uploaded images without explicit consent.

---

## Performance Guidelines

### Loading Targets

| Action | Target Time |
|--------|-------------|
| Initial page load | < 2 seconds |
| Image preview | < 1 second |
| Song generation | 15-30 seconds |
| Copy to clipboard | Instant |
| Page transitions | < 300ms |

### Perceived Performance

- Lazy load non-critical elements
- Skeleton screens for content loading
- Optimistic UI updates where possible
- Compress images before upload

---

## Summary: Key UX Principles

1. **Clarity** - User always knows what's happening
2. **Delight** - Small moments of joy throughout
3. **Speed** - Respect user's time, show progress
4. **Forgiveness** - Easy to recover from mistakes
5. **Accessibility** - Works for everyone
6. **Trust** - Clear about data use and external integrations

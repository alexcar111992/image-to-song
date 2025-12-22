# 01 - System Overview

> Core architecture and concepts for the Image-to-Song Generator

## What This App Does

This web application transforms uploaded images into unique song lyrics. Users then take those lyrics to Suno AI to generate actual music.

**The flow:**
1. User uploads a photo
2. Orchid AI analyzes the image and generates lyrics
3. User copies the lyrics
4. User follows our Suno tutorial to create music
5. User creates actual music on Suno AI (external platform)

**We generate lyrics. Suno generates music.**

## Core Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER UPLOADS IMAGE                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHID AI PROCESSING                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Image     │  │   Lyric     │  │  Quality    │              │
│  │  Analysis   │  │ Generation  │  │   Check     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FORMATTED OUTPUT                            │
│           Song Title + Lyrics + Genre + Suno Tags                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      USER ACTIONS                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Copy     │  │   Follow    │  │  Open Suno  │              │
│  │   Lyrics    │  │  Tutorial   │  │    AI →     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Core Design Principles

### 1. Image Specificity
Every song must feel specific to THIS image, not generic. The system extracts concrete details and weaves them into the lyrics.

### 2. Cliché Elimination
Zero tolerance for overused phrases. The system maintains a blacklist and forces fresh metaphors derived from image content.

### 3. Forced Variation
Anti-repetition algorithms ensure no two songs feel similar, even for similar images. Opening lines, metaphors, structures, and themes are rotated.

### 4. Emotional Authenticity
Songs capture complex, nuanced emotions—not just "happy" or "sad" but "melancholic nostalgia" or "anxious hope."

### 5. Musical Viability
Lyrics are crafted to be singable—appropriate syllable counts for tempo, natural flow, and genre-appropriate language.

## Processing Pipeline Targets

| Stage | Target Time | Notes |
|-------|-------------|-------|
| Image Upload | 1-2s | Compress before processing |
| Visual Analysis | 3-5s | Parallel thread processing |
| Semantic Interpretation | 2-3s | Use cached scene templates |
| Musical DNA Encoding | 1-2s | Pre-computed mappings |
| Lyric Generation | 8-12s | Main AI processing time |
| Quality Checks | 2-4s | Auto-regenerate if fails |
| **Total** | **15-30s** | User-facing estimate |

## Key Components

### Image Analysis Engine
- 5-layer visual interpretation system
- Color psychology mapping
- Scene type classification
- Object relationship mapping

**See:** `02-IMAGE-ANALYSIS-ENGINE.md`

### Songwriting Engine
- Genre selection algorithm
- Tempo calculation formula
- Metaphor construction system
- Lyric writing protocols
- Structure variation library

**See:** `03-SONGWRITING-ENGINE.md`

### Anti-Repetition System
- Opening line rotation
- Chorus theme tracking
- Metaphor bank rotation
- Structure variation enforcement
- Similarity detection algorithms

**See:** `04-ANTI-REPETITION-SYSTEM.md`

### Quality Assurance
- 7-filter verification system
- Weighted scoring matrix
- Automatic regeneration triggers
- Quality drift prevention

**See:** `05-QUALITY-ASSURANCE.md`

## External Dependencies

### Required
- **Orchid AI:** Image analysis + lyric generation (via API)

### External Platform (User-Initiated)
- **Suno AI:** Music generation - users take their lyrics here
- We provide a tutorial, NOT an integration

### For Monetization
- **Google Auth:** User sign-in (Firebase Auth or NextAuth.js)
- **Stripe:** Subscription payments

See `10-MONETIZATION-AUTH.md` for payment/auth details.

## Data Flow Summary

```
Image → Analysis → Interpretation → Musical DNA → Lyrics → Quality Check → Output
                                                              ↓
                                                    [If fails: regenerate]
```

## Next Steps

1. **For the Orchid AI prompt:** Read `08-MASTER-PROMPT.md`
2. **For image analysis logic:** Read `02-IMAGE-ANALYSIS-ENGINE.md`
3. **For lyric generation rules:** Read `03-SONGWRITING-ENGINE.md`
4. **For Suno output/tutorial:** Read `07-SUNO-INTEGRATION.md`
5. **For payments/auth:** Read `10-MONETIZATION-AUTH.md`

# 04 - Anti-Repetition System

> Algorithms and rules for ensuring every generated song is unique

## Overview

The Anti-Repetition System prevents the AI from falling into repetitive patterns, ensuring each generated song feels fresh and specific to its image. It tracks recent outputs, maintains blacklists, and forces variation at key decision points.

## Cliché Blacklist

### BANNED Phrases (Zero Tolerance)

These phrases and their variations must NEVER appear in generated lyrics:

**Relationship Clichés:**
```
❌ heart on my sleeve
❌ butterflies in my stomach
❌ love at first sight
❌ meant to be
❌ soul mate / soulmate
❌ head over heels
❌ the one
❌ better half
❌ two become one
❌ you complete me
```

**Time/Memory Clichés:**
```
❌ time stands still
❌ turn back time
❌ blast from the past
❌ good old days
❌ if I could go back
❌ rewind
❌ déjà vu
❌ where did the time go
```

**Emotion Clichés:**
```
❌ drowning in tears
❌ heart skips a beat
❌ took my breath away
❌ on cloud nine
❌ walking on air
❌ over the moon
❌ down in the dumps
❌ heart of gold
```

**Nature Clichés:**
```
❌ eye of the storm
❌ weather the storm
❌ ray of sunshine
❌ silver lining
❌ tip of the iceberg
❌ calm before the storm
```

**Fire/Light Clichés:**
```
❌ burning love
❌ light up my life
❌ spark between us
❌ flame died out
❌ see the light
❌ fire in my heart
```

**Body Clichés:**
```
❌ my rock
❌ my anchor
❌ my safe haven
❌ piece of my heart
❌ broke my heart
❌ stole my heart
❌ lost in your eyes
```

### Banned Metaphor Categories

These metaphor types are overused in AI-generated music:

```
❌ Heart as physical object (breaking, burning, bleeding)
❌ Stars/constellations for guidance or distance
❌ Ocean/drowning for overwhelming emotion
❌ Fire/flames for passion
❌ Shadows for sadness
❌ Wings for freedom
❌ Chains for constraint
❌ Ghosts for memory (unless derived from specific image)
❌ Walls for emotional barriers
❌ Storms for turmoil
```

**Instead:** Derive metaphors directly from image elements.

---

## Cliché Replacement Process

When tempted to use a cliché, follow this process:

### Step 1: Identify Core Meaning
What am I actually trying to say?

### Step 2: Find Image-Specific Equivalent
What element from THIS image conveys the same idea?

### Step 3: Build Fresh Metaphor

**Examples:**

| Cliché | Core Meaning | Image Element | Fresh Metaphor |
|--------|--------------|---------------|----------------|
| "You broke my heart" | Caused deep pain | Cracked window | "You're the stone through my window / The cold air that rushes in after" |
| "Time stands still" | Frozen moment | Person mid-stride | "Your foot is forever suspended / An inch above the pavement" |
| "Lost in the crowd" | Feel anonymous | Busy street | "I'm just another shadow / Moving between the streetlights" |
| "Drowning in sadness" | Overwhelmed | Empty bathtub | "Even the dry tub holds / The shape of how you left" |
| "Light up my life" | Brings happiness | Lamp in photo | "You're the forty-watt glow / In my four-wall silence" |

---

## Forced Originality Techniques

### Technique 1: Opposite Day

1. Take your instinctive phrase
2. Write the exact opposite
3. Find the truth between them

**Example:**
- Instinct: "I miss you so much"
- Opposite: "I don't miss you at all"
- Truth: "I miss the version of you that never existed"

### Technique 2: Sensory Shift

Express emotional statement through unexpected sense:

- **Emotional:** "I'm so sad"
- **→ Taste:** "Everything tastes like dust now"
- **→ Sound:** "The silence has a frequency only I can hear"
- **→ Touch:** "Sadness has texture—rough, like unfinished wood"

### Technique 3: Scale Jump

Express personal feeling at cosmic or microscopic scale:

- **Personal:** "I feel small and insignificant"
- **→ Cosmic:** "I'm the space between stars"
- **→ Microscopic:** "I'm the crack in the sidewalk / Too small to name"

### Technique 4: Verb Replacement

Replace every verb with one from different context:

- **Original:** "I'm trying to forget you"
- **→ Cooking:** "I'm trying to dissolve you / Like sugar in hot water"
- **→ Construction:** "I'm trying to demolish you / Brick by brick from memory"

### Technique 5: Object Personification

Give human emotion to inanimate object from image:

- **Object:** Empty coffee cup
- **Personified:** "The coffee cup is lonely / Still warm with the ghost of your hands"

---

## Variation Enforcement System

### Tracking Recent Outputs

Maintain rolling memory of last 20-50 generations:

```javascript
recentSongs = {
  openingStructures: [...],      // Last 20
  chorusThemes: [...],           // Last 15
  primaryMetaphors: [...],       // Last 10
  songStructures: [...],         // Last 10
  perspectives: [...],           // Last 5
  emotionalArcs: [...]           // Last 10
}
```

### Mandatory Randomization Points

**1. Song Structure (12 options, weighted):**

| Structure | Weight |
|-----------|--------|
| V-C-V-C-B-C | 25% |
| V-C-V-C-B-C-C | 15% |
| V-V-C-V-C | 15% |
| Intro-V-C-V-B-C | 10% |
| V-C-V-Outro | 10% |
| V-C-V-C-Breakdown-C | 8% |
| Spoken-V-C-V-Spoken-C | 7% |
| V-C-V-C | 5% |
| Experimental | 3% |
| V-C-B-C | 2% |

**2. Perspective (weighted):**

| POV | Weight |
|-----|--------|
| 1st person (I/me) | 40% |
| 3rd person (they/she/he) | 30% |
| 2nd person (you) | 20% |
| Collective (we/us) | 7% |
| Object/abstract | 3% |

**3. Opening Line Type (strict rotation):**

Cycle through these 10 types—NEVER use same type twice in a row:
1. Concrete observation
2. Metaphor establishing
3. Direct address
4. Temporal anchor
5. Sensory detail
6. Action in progress
7. Question
8. Statement
9. Fragment
10. Juxtaposition

**4. Emotional Theme (15 options):**

Rotate through ALL before repeating:
1. Longing for absent person
2. Acceptance of loss
3. Resistance to change
4. Celebration of moment
5. Questioning reality
6. Embracing solitude
7. Seeking connection
8. Releasing the past
9. Fearing the future
10. Finding beauty in decay
11. Anger at injustice
12. Wonder at existence
13. Exhaustion with pretense
14. Hope despite evidence
15. Confusion as clarity

---

## Repetition Risk Algorithm

```javascript
function calculateRepetitionRisk(newSong, recentSongs) {
  let risk = 0
  
  // Check opening structure
  const openingMatches = recentSongs.openingStructures
    .filter(s => s === newSong.openingStructure)
  risk += openingMatches.length * 2
  
  // Check chorus theme
  const themeMatches = recentSongs.chorusThemes
    .filter(t => t === newSong.chorusTheme)
  risk += themeMatches.length * 3
  
  // Check metaphor category
  const metaphorMatches = recentSongs.primaryMetaphors
    .filter(m => m === newSong.primaryMetaphor)
  risk += metaphorMatches.length * 1.5
  
  // Check structure overuse
  const structureMatches = recentSongs.songStructures
    .filter(s => s === newSong.structure)
  if (structureMatches.length > recentSongs.songStructures.length * 0.5) {
    risk += structureMatches.length
  }
  
  return risk
}

// Decision logic
if (repetitionRisk > 10) {
  // FORCE completely different choices
  forceRandomSelection({
    openingType: leastUsedInLast20(),
    emotionalTheme: bottomFiveThemes(),
    metaphorCategory: unusedCategories(),
    structure: differentFromLastThree()
  })
  regenerate()
}

if (repetitionRisk >= 5 && repetitionRisk <= 10) {
  // Increase randomness
  increaseRandomnessBy(30)
  biasTowardLessRecentOptions()
}

if (repetitionRisk < 5) {
  // Proceed normally
  useStandardWeightedRandomness()
}
```

---

## Quality Drift Prevention

### Periodic Audit (Every 100 Generations)

**1. Metaphor Diversity Check:**
```
Count unique metaphor categories in last 100 songs
IF < 30 unique categories:
  → ALERT: Metaphor repetition
  → Force expansion of metaphor bank
  → Increase random selection weight
```

**2. Opening Line Variety Check:**
```
Analyze opening structures
IF any single structure > 30% usage:
  → ALERT: Opening formula detected
  → Ban that structure for next 20 songs
  → Force rotation through all 10 types
```

**3. Emotional Range Check:**
```
Map emotional theme distribution
IF 2-3 themes dominate > 60% of songs:
  → ALERT: Emotional narrowing
  → Mandate underused emotions for next 10 songs
  → Expand emotional vocabulary
```

**4. Cliché Creep Check:**
```
Scan for near-cliché phrases (variants of banned phrases)
IF increasing trend detected:
  → ALERT: Cliché evolution
  → Add new variants to blacklist
  → Strengthen originality filters
```

**5. Genre Distribution Check:**
```
Track genre assignments
IF 1-2 genres represent > 50% of output:
  → ALERT: Genre bias
  → Recalibrate selection algorithm
  → Force diverse exploration next 20 songs
```

**6. Structural Monotony Check:**
```
Review song structures
IF standard V-C-V-C-B-C > 60% usage:
  → ALERT: Structure laziness
  → Mandate experimental structures for 15 songs
  → Re-weight probability distribution
```

---

## Similarity Detection

### Within-Song Checks

```
❌ No word repeated within 2 lines (unless intentional device)
❌ No phrase repeated in different sections (except chorus hook)
❌ No rhyme forced that doesn't serve the meaning
❌ No filler words or vague language
```

### Across-Song Checks

```
❌ No identical opening line structure to last 20 songs
❌ No same chorus emotional theme as last 15 songs
❌ No same primary metaphor category as last 10 songs
❌ No identical song structure as last 3 songs
```

### Hash-Based Tracking

Generate hashes for quick comparison:

```javascript
songFingerprint = {
  openingHash: hash(openingLineStructure),
  chorusHash: hash(chorusTheme + chorusStructure),
  metaphorHash: hash(primaryMetaphorCategory),
  structureHash: hash(songStructure),
  emotionHash: hash(primaryEmotion + emotionalArc)
}

// Compare against recent fingerprints
if (anyHashMatch(songFingerprint, recentFingerprints)) {
  regenerateMatchingSection()
}
```

---

## Summary: Non-Negotiable Rules

1. **Zero clichés** from blacklist—ever
2. **Metaphors derived from image**, not templates
3. **Opening line type** must differ from last song
4. **Chorus theme** must differ from last 15 songs
5. **Structure** must differ from last 3 songs
6. **At least one surprising element** per song
7. **Periodic audits** to prevent drift
8. **Automatic regeneration** if similarity detected

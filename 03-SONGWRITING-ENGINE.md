# 03 - Songwriting Engine

> Complete lyric generation system with structure, metaphor, and craft frameworks

## Overview

The Songwriting Engine transforms image analysis data into unique, emotionally resonant song lyrics. It handles genre selection, tempo calculation, metaphor construction, lyric writing, and structural decisions.

## Musical DNA Encoding

### Genre Selection Algorithm

```
START
│
└─ Is brightness > 7/10?
   ├─ YES → Is energy high (movement/crowds)?
   │  ├─ YES → Upbeat indie pop, dance pop (120-135 BPM)
   │  └─ NO → Sunshine folk, acoustic indie (95-115 BPM)
   │
   └─ NO → Is saturation > 6/10?
      ├─ YES → Is scene chaotic/urban?
      │  ├─ YES → Alternative rock, post-punk (115-140 BPM)
      │  └─ NO → Dream pop, art pop (85-110 BPM)
      │
      └─ NO → Is isolation present?
         ├─ YES → Ambient, slowcore, lo-fi (60-80 BPM)
         └─ NO → Indie folk, bedroom pop (75-95 BPM)
```

**Genre Refinement Modifiers:**

| Image Characteristic | Add Sub-Genre Tag |
|---------------------|-------------------|
| Vintage colors/grain | "retro," "70s-inspired," "nostalgic" |
| Sharp focus + minimal | "minimal," "sparse arrangement" |
| Nature dominance | "organic," "acoustic," "unplugged" |
| Technology/urban | "synth," "electronic textures," "processed" |
| Decay/aging | "lo-fi," "tape hiss," "worn" |

**Available Genre Pool:**
- Indie folk, dream pop, lo-fi, alternative rock
- Electronic ambient, neo-soul, acoustic ballad, synthwave
- Post-rock, bedroom pop, art pop, slowcore

### Tempo Calculation Formula

```javascript
// Base tempo starts neutral
let baseBPM = 90

// Apply adjustments based on image analysis
baseBPM += (energyLevel * 5)         // 0-10 scale → +0 to +50
baseBPM += (brightness * 3)          // Brighter = faster
baseBPM -= (darkness * 4)            // Darker = slower
baseBPM -= (isolationScore * 3)      // More alone = slower
baseBPM += (crowdDensity * 4)        // More people = faster
baseBPM += (motionDetected * 10)     // Movement = faster

// Clamp to valid range
finalBPM = Math.max(55, Math.min(145, baseBPM))
```

**Example Calculation:**
- Dark empty room, isolated figure, no motion
- Energy: 2, Brightness: 3, Darkness: 8, Isolation: 9, Crowd: 0, Motion: 0
- 90 + (10) + (9) - (32) - (27) + 0 + 0 = **50** → clamped to **55 BPM**

### Instrumentation Selection

| Scene Attribute | Suggested Instruments |
|-----------------|----------------------|
| Nature dominant | Acoustic guitar, strings, light percussion, flute |
| Urban/industrial | Electric guitar, synths, programmed drums, bass |
| Intimate/quiet | Piano, fingerpicked guitar, soft vocals, ambient pads |
| Energetic/crowd | Full drums, bass, layered guitars, group vocals |
| Nostalgic/vintage | Rhodes piano, mellotron, tape-saturated drums |
| Surreal/abstract | Synth textures, reversed sounds, experimental percussion |

**Arrangement Density:**
- **Sparse** (isolation high): Single instrument, add 1-2 more max
- **Medium** (balanced): 3-5 instrument layers
- **Dense** (crowd/energy high): Full band, layered vocals, 6+ elements

---

## Metaphor Construction System

### Building the Central Metaphor

**Process:**
1. Identify most visually dominant or emotionally charged element
2. Map to conceptual domain
3. Build extended metaphor that sustains throughout song

**Example Mappings:**

| Image Element | Conceptual Domain | Extended Metaphor |
|---------------|-------------------|-------------------|
| Empty chair | Absence, waiting | Chair as ghost of person |
| Cracked mirror | Fractured self | Mirror as broken truth |
| Streetlight in fog | Guidance, obscurity | Light as failing memory |
| Lone tree on hill | Resilience, isolation | Tree as stubborn survivor |
| Crowded subway | Lost identity | Train as life's indifference |

**Metaphor Expansion Rules:**
- **Verse 1:** Introduce the metaphor
- **Verse 2:** Develop or twist it
- **Bridge:** Resolve or shatter it
- **Final Chorus:** Call back to it (transformed)

### Imagery Bank Construction

For each image, extract 10-15 concrete sensory details:

**Visual Details:**
- Specific colors: not "blue" but "bruised blue," "rust-stained orange"
- Textures: peeling, smooth, fractured, soft-edged
- Light quality: harsh, filtered, golden, fluorescent

**Implied Sound:**
- Empty room: echoes, floorboards, breath
- City street: traffic hum, footsteps, sirens
- Nature: wind, water, animal calls, silence

**Implied Touch:**
- Temperature: cold concrete, warm wood, humid air
- Texture: rough brick, smooth glass, soft fabric

**Implied Smell:**
- Urban: exhaust, coffee, rain on concrete
- Nature: pine, earth, ozone before rain

**Use 5-8 of these per song, distributed throughout verses.**

---

## Narrative Framework

### Perspective Selection

| POV | Probability | When to Use | Effect |
|-----|-------------|-------------|--------|
| 1st Person (I/me) | 40% | Single subject, intimate scenes | Immediate, vulnerable |
| 3rd Person (they/she/he) | 30% | Observational scenes, storytelling | Cinematic, objective |
| 2nd Person (you) | 20% | Addressing absent person | Direct, urgent |
| Collective (we/us) | 5% | Group scenes, shared experience | Inclusive, anthemic |
| Object/Abstract | 5% | Surreal images, no clear subject | Dreamlike, philosophical |

**Perspective Shift Rule:** Can shift ONCE in bridge for dramatic effect.

### Temporal Framework

| Emotional Arc | Primary Tense | Example Pattern |
|---------------|---------------|-----------------|
| Descent | Past → Present | "It used to be... now it's..." |
| Ascent | Present → Future | "Right now... but soon..." |
| Plateau | Consistent present | Frozen moment, suspended |
| Circular | Present → Past → Present | Full circle narrative |
| Revelation | Confused present → Clear past | Understanding through memory |

**Rules:**
- Verses can mix tenses for complexity
- Chorus should be consistent (anchoring moment)
- Bridge can break tense rules for emotional shift

### Narrative Mode Selection

**Mode 1: Snapshot Story (40%)**
- Describe the exact moment + what led here + what comes next
- Structure: Past → Present → Implied future

**Mode 2: Observer Meditation (25%)**
- Philosophical reflection on what the image represents
- Structure: Wide → Narrow → Universal

**Mode 3: Character Study (20%)**
- Tell their story, real or imagined
- Structure: External → Internal → Revelation

**Mode 4: Relationship Archaeology (10%)**
- Explore the connection between presences/absences
- Structure: Together → Apart → Changed

**Mode 5: Surreal Descent (5%)**
- Embrace confusion, explore the strange
- Structure: Normal → Strange → Stranger → Acceptance

---

## Song Structure Library

### Available Structures

| Structure | Format | Use Case |
|-----------|--------|----------|
| Classic | V-C-V-C-B-C | Standard, balanced |
| Extended | V-C-V-C-B-C-C | Big finish energy |
| Delayed Chorus | V-V-C-V-C | Story-heavy, narrative |
| With Intro | Intro-V-C-V-B-C | Atmospheric setup |
| Minimalist | V-C-V-Outro | Short, contemplative |
| Breakdown | V-C-V-C-Breakdown-C | Dynamic contrast |
| Spoken Hybrid | Spoken-V-C-V-Spoken-C | Poetic, experimental |
| Compressed | V-C-B-C | Quick, punchy |

### Section Length Guidelines

**Verse:**
- **Short (4 lines):** Fast tempo >120 BPM, punchy
- **Medium (6-8 lines):** Standard narrative, most common
- **Long (10-12 lines):** Slow tempo <80 BPM, contemplative

**Chorus:**
- Length: 4-6 lines typically
- **Exact repeat:** Simple, anthemic, high energy
- **Evolving repeat:** Last line changes each time
- **Varied repeat:** Small word changes for narrative shift

**Bridge:**
- Length: 4-8 lines
- **Functions:** Perspective shift, revelation, contrast, breakdown, philosophical question

### Syllable & Rhythm Guidelines

| Tempo Range | Syllables/Line | Example |
|-------------|----------------|---------|
| 55-75 BPM | 8-12 | "The empty room still holds your shape" (9) |
| 76-95 BPM | 10-14 | "I'm counting streetlights like they're hours gone" (12) |
| 96-120 BPM | 12-16 | "We used to talk until the morning light broke through" (15) |
| 121-145 BPM | 6-10 | "Run fast, the night won't wait" (7) |

---

## Lyric Writing Protocols

### Opening Line Requirements

First line must be:
1. **Image-specific:** References something visual from the photo
2. **Intriguing:** Raises a question or creates tension
3. **Tone-establishing:** Sets the emotional direction immediately

**Formula Patterns (rotate through):**

**A. Concrete observation + implied emotion:**
```
"The coffee's cold and you're still not home"
"Three missed calls, all from the same streetlight"
```

**B. Metaphor establishing shot:**
```
"You're a door I keep forgetting how to open"
"This city's just a list of places I avoid"
```

**C. Direct address with specificity:**
```
"You left your jacket on my radiator"
"Tell me why the kitchen smells like your perfume"
```

**D. Temporal anchor:**
```
"It's been six days since the last good morning"
"Tuesday feels like months when you're not here"
```

**E. Sensory detail first:**
```
"The floorboards creak in alphabetical order"
"Rain sounds different on your side of town"
```

**F. Action in progress:**
```
"I'm counting cracks in sidewalks, spelling out your name"
"Standing in the checkout line, forgetting what I came for"
```

**NEVER open with:**
- "I remember when..."
- "Sometimes I think about..."
- "It feels like..."
- Any pronoun without context

### Chorus Construction

**Requirements:**
1. Distill core emotion into one repeatable hook
2. Use simpler language than verses (more direct)
3. Be singable (natural melody points, vowel sounds)
4. Create resolution or tension depending on arc

**Formula Patterns:**

**A. Statement + Justification:**
```
"I'm not ready to let go
You're the last thing I still know"
```

**B. Question + Answer:**
```
"Where do we go when the light fades out?
Into the spaces we don't talk about"
```

**C. Repeated declaration:**
```
"I'm still here, I'm still here
Standing in the ruins of the year"
```

**D. Metaphor callback:**
```
"You're the streetlight I can't reach
The blurred direction, fading speech"
```

### Rhyme Implementation

**Rhyme Sophistication Levels:**

| Level | Type | Usage | Example |
|-------|------|-------|---------|
| 1 | Perfect rhyme | Sparingly, 20% | light/night |
| 2 | Slant rhyme | Primary tool, 50% | home/alone, fade/safe |
| 3 | Internal rhyme | Texture, 20% | "counting hours in the shower steam" |
| 4 | Assonance | Vowel echo, 30% | cold/over/don't |
| 5 | Consonance | Consonant echo, 20% | flicker/fracture |

**No-rhyme zones (10%):** Some lines shouldn't rhyme for emphasis.

**Scheme Variety:**
- ABAB (alternate) - 30%
- ABCB (simple) - 25%
- AABB (couplet) - 20%
- Internal rhyme focus - 15%
- Free verse - 10%

---

## Linguistic Craft Rules

### Verb Strength Hierarchy

**Weak Verbs (avoid):**
- is, are, was, were, be, been, being
- feel, felt, feeling
- see, saw, seeing
- get, got, getting

**Strong Verb Replacements:**

| Context | Weak → Strong |
|---------|---------------|
| Emotional states | "feel sad" → "unraveling / collapsing / dimming" |
| Physical description | "light is bright" → "light fractures / bleeds / floods" |
| Memory/time | "I remember" → "I carry / I hold / I'm haunted by" |

**Intensity Matching:**
- Calm scenes → Gentle verbs (drift, settle, rest, dissolve)
- Intense scenes → Violent verbs (shatter, tear, burn, split)
- Melancholy scenes → Erosion verbs (fade, wear, thin, hollow)
- Joyful scenes → Expansion verbs (bloom, burst, lift, shine)

### Noun Specificity Rules

**Generic → Specific:**

| Generic | Specific Options |
|---------|------------------|
| street | intersection, alley, avenue, dead-end, crosswalk |
| building | apartment block, warehouse, corner store, office tower |
| room | kitchen, hallway, bedroom, waiting room, basement |
| chair | wooden chair, office chair, folding chair, armchair |
| window | bay window, car window, storefront, skylight |
| tree | oak, willow, pine, birch, maple |
| water | river, puddle, fountain, lake, rain |

**Specificity Test:**
> Can the listener picture the EXACT thing, or just the category?

### Sensory Synesthesia

Cross sensory boundaries for unique imagery:

| Cross | Example |
|-------|---------|
| Color → Sound | "Your voice is rust-colored" |
| Sound → Touch | "Rough laughter" |
| Touch → Sight | "Smooth darkness" |
| Taste → Emotion | "Bitter nostalgia" |
| Temperature → Time | "Cold hours" |

Use 1-2 synesthetic phrases per song (chorus or bridge).

### Phonetic Beauty

**Alliteration:** "Soft silver silence"
**Assonance:** "Stay away, fade away"
**Consonance:** "Flicker in the fixture"
**Sibilance:** "She stands in the shadows, speaking softly"
**Hard stops:** "Cracked concrete, can't connect"

Match sound to emotion: Soft sounds for gentle emotions, hard sounds for intensity.

---

## Bridge Architecture

### Bridge Functions

| Function | Probability | Description |
|----------|-------------|-------------|
| Perspective Shift | 40% | Change who's speaking/addressed |
| Revelation | 30% | New information recontextualizes everything |
| Contrast | 20% | Musical/emotional opposite of verses |
| Breakdown/Building | 7% | Strip to minimal, then crescendo |
| Philosophy | 3% | Universal truth, bigger questions |

### Bridge-to-Chorus Transitions

**Direct Launch:** Bridge ends incomplete, chorus answers immediately
**Pause/Breath:** Beat of silence before soft chorus entry
**Instrumental Build:** 4-8 bar crescendo into explosive chorus
**Musical Breakdown:** Everything drops to one instrument, then full return
**Line Repetition:** Bridge's last line becomes chorus's first line

---

## Title Generation

### Title Source Hierarchy

| Priority | Source | Probability | Example |
|----------|--------|-------------|---------|
| 1 | Key image element | 40% | "The Empty Chair" |
| 2 | Memorable lyric fragment | 30% | "Counting Hours in Ceiling Cracks" |
| 3 | Core metaphor | 20% | "Lighthouse for Ghosts" |
| 4 | Emotional state | 7% | "The Quiet After" |
| 5 | Question/statement | 3% | "Where Do We Go When the Light Fades?" |

**Formatting:**
- Use title case
- Ideal: 1-5 words, Maximum: 8 words
- Avoid: generic emotions, overused words

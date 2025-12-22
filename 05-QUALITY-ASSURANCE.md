# 05 - Quality Assurance

> Quality gates, scoring systems, and verification protocols

## Overview

The Quality Assurance system ensures every generated song meets high standards before delivery. It includes a seven-filter verification system, weighted scoring matrix, and automatic regeneration triggers.

## The Seven Filters

Every generated song must pass ALL seven filters before output.

### Filter 1: Image Specificity Test

**Question:** Could this song be about ANY similar scene, or ONLY this image?

**Pass Criteria:**
- [ ] At least 3 concrete details from the image appear in lyrics
- [ ] Central metaphor is derived from image content
- [ ] Emotional tone matches image analysis
- [ ] Genre choice is defensible from image characteristics

**If FAIL:** Regenerate with more specific image references

**Example Check:**
```
Image: Empty wooden chair by window, afternoon light

Lyrics mention:
✅ "wooden chair" (concrete detail)
✅ "afternoon light through glass" (concrete detail)
✅ "dust particles floating" (derived observation)
✅ Chair as absence metaphor (image-derived)

Result: PASS
```

---

### Filter 2: Cliché Detection

**Question:** Does this song contain ANY overused phrases or tired metaphors?

**Scan For:**
- All phrases from blacklist (see 04-ANTI-REPETITION-SYSTEM.md)
- Generic emotions without specificity
- Predictable rhymes (love/above, heart/apart, fire/desire)
- Recycled imagery (stars for guidance, fire for passion)

**If FAIL:** Replace clichéd sections with fresh alternatives

**Example Check:**
```
Line: "You took my breath away"
❌ CLICHÉ DETECTED

Replacement: "You're the pause between heartbeats"
✅ PASS
```

---

### Filter 3: Originality Verification

**Question:** Does this song's opening, chorus theme, or core metaphor match any recent generation?

**Check Against:**
- Last 50 songs' opening line structures
- Last 30 songs' chorus emotional themes
- Last 20 songs' primary metaphors

**If FAIL:** Inject forced variation (rotate to different structure/theme)

**Example Check:**
```
Last 3 openings: 
1. "The coffee's cold..." (concrete observation)
2. "Standing at the window..." (action in progress)
3. "Your jacket still..." (concrete observation)

New opening: "Rain sounds different..." (sensory detail)
✅ Different structure - PASS
```

---

### Filter 4: Emotional Coherence

**Question:** Does the emotional arc make sense? Do all parts serve the journey?

**Verify:**
- [ ] Verses build toward chorus logically
- [ ] Bridge serves clear purpose (shift/reveal/contrast)
- [ ] Final chorus feels earned
- [ ] No emotional whiplash without reason
- [ ] Tense/perspective consistent unless intentional shift

**If FAIL:** Restructure emotional progression

**Example Check:**
```
Arc: Melancholy (verse 1) → Melancholy (chorus) → 
     Anger (verse 2) → Joy (chorus)

❌ INCOHERENT - Joy chorus doesn't follow anger verse

Fix: Adjust verse 2 to hint at acceptance, 
     or change chorus to resolution rather than joy
```

---

### Filter 5: Musical Viability

**Question:** Can this actually be sung? Does it flow?

**Test:**
- [ ] Read aloud at suggested tempo
- [ ] Syllable count per line appropriate for BPM
- [ ] No tongue-twisters or awkward phrasing
- [ ] Rhyme scheme enhances rather than forces meaning
- [ ] Line breaks fall at natural pause points

**If FAIL:** Adjust phrasing and syllable distribution

**Example Check:**
```
Tempo: 75 BPM (should be 8-12 syllables/line)

Line: "I'm reminiscing about the particularities of your departure"
❌ 19 syllables - too long for tempo

Fix: "I'm counting the ways you left" (8 syllables)
✅ PASS
```

---

### Filter 6: Lyrical Craft

**Question:** Is this well-written on a technical level?

**Evaluate:**
- [ ] Verb strength (avoid is/was/feel without good reason)
- [ ] Noun specificity (concrete over abstract, 2:1 ratio)
- [ ] No repeated words within 2 lines (unless intentional)
- [ ] Varied sentence structure
- [ ] Sensory details present
- [ ] Active voice preferred over passive

**If FAIL:** Rewrite weak sections

**Example Check:**
```
Line: "I was feeling really sad about the thing that happened"

Issues:
❌ "was feeling" - weak verb construction
❌ "really sad" - generic emotion
❌ "the thing" - vague noun

Fix: "The news hollowed me out"
✅ Strong verb, specific, active
```

---

### Filter 7: Surprise Factor

**Question:** Is there at least ONE moment that subverts expectation?

**Look For:**
- Unexpected word choice
- Surprising metaphor
- Twist in bridge
- Unconventional structure choice
- Fresh perspective on common feeling

**If FAIL:** Inject one surprising element

**Example Check:**
```
Song about loneliness...

Expected: "I'm alone in this empty room"
Surprise: "The furniture is starting to recognize me"

✅ Personification of objects - unexpected angle
```

---

## Scoring Matrix

Assign scores 1-10 for each category:

| Category | Weight | Minimum Score | Description |
|----------|--------|---------------|-------------|
| Image Specificity | 3x | 8/10 | How specific to THIS image |
| Originality | 3x | 9/10 | No templates, formulas, clichés |
| Emotional Coherence | 2x | 8/10 | Arc makes sense, parts serve whole |
| Musical Viability | 2x | 8/10 | Singable, flows, matches tempo |
| Lyrical Craft | 2x | 8/10 | Strong verbs, specific nouns, varied |
| Cliché Avoidance | 3x | 10/10 | Zero tolerance |
| Surprise Factor | 1x | 7/10 | At least one unexpected moment |

### Score Calculation

```javascript
function calculateWeightedScore(scores) {
  const weighted = 
    (scores.imageSpecificity * 3) +
    (scores.originality * 3) +
    (scores.emotionalCoherence * 2) +
    (scores.musicalViability * 2) +
    (scores.lyricalCraft * 2) +
    (scores.clicheAvoidance * 3) +
    (scores.surpriseFactor * 1)
  
  const totalWeight = 3 + 3 + 2 + 2 + 2 + 3 + 1 // = 16
  
  return weighted / totalWeight
}

// Decision
const finalScore = calculateWeightedScore(scores)

if (finalScore < 8.5) {
  // Identify lowest scoring categories
  const lowestCategories = findLowest(scores, 2)
  // Regenerate those sections
  regenerate(lowestCategories)
}
```

### Pass Threshold

**Weighted Total Must Be ≥ 8.5/10 to pass**

If below 8.5:
1. Identify lowest scoring categories
2. Regenerate those specific sections
3. Re-run quality check
4. Repeat until pass or max 3 attempts

---

## Automatic Regeneration Triggers

### Immediate Regeneration (No Scoring Needed)

These issues trigger immediate regeneration:

```
❌ Any blacklisted cliché detected → Regenerate entire section
❌ Opening line matches recent song → Regenerate opening
❌ Chorus theme matches last 15 songs → Regenerate chorus
❌ Primary metaphor from banned category → Regenerate metaphor
❌ Syllable count > 150% of target for tempo → Adjust lines
```

### Scored Regeneration

After scoring, regenerate if:

```
Image Specificity < 8 → Add more concrete image details
Originality < 9 → Force different opening/metaphor/theme
Emotional Coherence < 8 → Restructure arc
Musical Viability < 8 → Adjust syllables and phrasing
Lyrical Craft < 8 → Strengthen verbs and nouns
Surprise Factor < 7 → Inject unexpected element
```

---

## Quality Report Template

Generate internal quality report for each song:

```json
{
  "song_id": "unique_hash",
  "quality_scores": {
    "image_specificity": 9,
    "originality": 9,
    "emotional_coherence": 8,
    "musical_viability": 8,
    "lyrical_craft": 9,
    "cliche_avoidance": 10,
    "surprise_factor": 8
  },
  "weighted_total": 8.81,
  "pass": true,
  "regeneration_count": 0,
  "filters_passed": [1, 2, 3, 4, 5, 6, 7],
  "warnings": [],
  "image_elements_used": [
    "empty wooden chair",
    "afternoon light",
    "dust particles",
    "window frame"
  ],
  "metaphor_source": "chair_as_absence",
  "originality_checks": {
    "opening_unique": true,
    "chorus_theme_unique": true,
    "metaphor_unique": true
  }
}
```

---

## Edge Case Handling

### Nearly Black/White Images

```
IF brightness < 1.5 OR brightness > 9.5:
  - Focus on implied narrative over visual detail
  - Emphasize emotional atmosphere
  - Use absence/excess of light as central metaphor
  - Genre bias: ambient, minimalist, experimental
  - Lower image_specificity threshold to 7/10
```

### Abstract/Non-Representational Images

```
IF scene_clarity_score < 3/10:
  - Embrace surrealism
  - Focus on emotional response to colors/shapes
  - Allow philosophical/abstract lyrics
  - Genre bias: experimental, art pop, ambient
  - Adjust originality weighting to favor exploration
```

### Disturbing/Uncomfortable Images

```
IF disturbing_content_detected:
  - Don't glorify or sensationalize
  - Find human emotion beneath the surface
  - Acknowledge darkness without dwelling
  - If too extreme: suggest different image
  - Add content sensitivity note to output
```

### Extremely Generic Images

```
IF authenticity_score < 3/10 (stock photo quality):
  - Acknowledge and subvert artificiality
  - Theme: performance, facades, constructed reality
  - Find humanity beneath the polish
  - Can go ironic or melancholic about fakeness
```

---

## Performance Targets

| Metric | Target | Action if Missed |
|--------|--------|------------------|
| Pass rate on first try | >80% | Review common failure patterns |
| Average regeneration count | <0.5 | Strengthen upfront filtering |
| Processing time | <30s total | Optimize parallel processing |
| User regeneration requests | <15% | Improve quality thresholds |

---

## Summary Checklist

Before outputting any song, verify:

- [ ] All 7 filters passed
- [ ] Weighted score ≥ 8.5/10
- [ ] Zero blacklisted phrases
- [ ] At least 3 image-specific details
- [ ] Opening line differs from recent songs
- [ ] Chorus theme differs from last 15
- [ ] At least one surprising element
- [ ] Syllable counts match tempo
- [ ] Strong verbs, specific nouns
- [ ] Emotional arc is coherent

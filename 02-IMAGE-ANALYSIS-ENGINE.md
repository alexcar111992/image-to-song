# 02 - Image Analysis Engine

> Complete visual interpretation system for extracting emotional and narrative data from images

## Overview

The Image Analysis Engine extracts meaningful data from uploaded images across five interpretation layers, transforming visual information into creative direction for songwriting.

## Five-Layer Interpretation System

### Layer 1: Concrete Elements (Raw Data Extraction)

Extract all identifiable visual elements:

```
PRIMARY SUBJECTS
├── People (count, approximate ages, genders, poses)
├── Animals (species, behavior, relationship to scene)
├── Objects (furniture, vehicles, items, tools)
└── Architecture (buildings, structures, interiors)

ENVIRONMENTAL CONTEXT
├── Setting: indoor / outdoor / transitional
├── Location type: urban / rural / suburban / natural / industrial
├── Space type: public / private / ambiguous
└── Scale: intimate / medium / vast

TIME INDICATORS
├── Time of day: sunrise / morning / midday / afternoon / sunset / night
├── Season: spring / summer / autumn / winter / indeterminate
├── Era: vintage / contemporary / futuristic / timeless
└── Duration cues: momentary / sustained / eternal

ATMOSPHERIC CONDITIONS
├── Weather: clear / cloudy / rainy / snowy / foggy / stormy
├── Temperature cues: hot / warm / neutral / cool / cold
├── Air quality: crisp / hazy / dusty / humid
└── Lighting conditions: natural / artificial / mixed
```

### Layer 2: Compositional Analysis

Extract artistic and structural elements:

```
FRAMING & POSITIONING
├── Rule of thirds: subject position relative to grid
├── Center vs. off-center placement
├── Subject-to-frame ratio (how much space the subject fills)
└── Breathing room: cramped / balanced / spacious

VISUAL FLOW
├── Leading lines: roads, rivers, railings, architectural elements
├── Eye path: where does the viewer's gaze travel?
├── Entry and exit points in the composition
└── Visual weight distribution: balanced / top-heavy / bottom-heavy

DEPTH & FOCUS
├── Depth of field: shallow (blurred background) / deep (all in focus)
├── Focus points: what's sharp, what's soft
├── Foreground / midground / background clarity
└── Layering: how many visual planes exist

SYMMETRY & PATTERN
├── Symmetry score: 0 (chaotic) → 10 (perfectly symmetrical)
├── Pattern presence: repeating elements, textures
├── Order vs. chaos balance
└── Geometric shapes: circular, angular, organic

NEGATIVE SPACE
├── Empty space percentage of frame
├── Intentional vs. incidental emptiness
├── What the emptiness communicates
└── Frame within frame elements
```

### Layer 3: Color & Light Psychology

Map colors to emotional and musical qualities:

```
COLOR EXTRACTION
├── Dominant colors (with RGB values and % of frame)
├── Secondary colors
├── Accent colors
├── Color temperature: warm / cool / neutral / mixed

SATURATION ANALYSIS
├── Vibrant (high saturation): energy, intensity, vividness
├── Muted (medium saturation): calm, everyday, accessible
├── Desaturated (low saturation): melancholy, nostalgia, distance
└── Monochrome: timelessness, focus, artistic intent

CONTRAST ASSESSMENT
├── High contrast: drama, tension, stark differences
├── Medium contrast: balanced, natural, comfortable
├── Low contrast: soft, dreamy, unified
└── Contrast direction: light-to-dark vs. color-based

LIGHT ANALYSIS
├── Light source: natural / artificial / mixed / ambiguous
├── Light direction: front / side / back / overhead / below
├── Light quality: harsh / soft / diffused / dramatic
├── Shadow patterns: what do they reveal or conceal?
```

**Color Psychology Mapping:**

| Color Dominance | Primary Emotion | Musical Direction |
|-----------------|-----------------|-------------------|
| Red (>30%) | Passion, intensity, danger | Rock, dramatic ballad, intense pop |
| Blue (>30%) | Calm, melancholy, distance | Indie, ambient, lo-fi |
| Yellow/Orange (>25%) | Warmth, joy, nostalgia | Folk, upbeat indie, sunshine pop |
| Green (>35%) | Growth, nature, renewal | Acoustic, folk, environmental |
| Gray/Monochrome | Neutrality, sophistication | Minimalist, post-rock, art pop |
| Purple (>25%) | Mystery, spirituality, dreams | Dream pop, psychedelic, experimental |
| Black (>40%) | Darkness, void, elegance | Dark ambient, slowcore, gothic |
| White (>40%) | Purity, emptiness, isolation | Minimal, ambient, ethereal |

### Layer 4: Emotional & Narrative Inference

Interpret the story and feeling:

```
HUMAN ELEMENTS (if present)
├── Facial expressions: happy / sad / neutral / angry / surprised / contemplative
├── Body language: open / closed / tense / relaxed / in motion / static
├── Gaze direction: at camera / away / at another subject / distant
├── Relationship indicators: touching / distant / facing / turned away
└── Activity: what are they doing or about to do?

NARRATIVE CONSTRUCTION
├── What happened BEFORE this moment?
├── What IS happening in this moment?
├── What might happen AFTER this moment?
├── What's the conflict or tension?
└── What's the resolution or question?

SYMBOLIC ELEMENTS
├── Cultural symbols: objects with meaning beyond their function
├── Visual metaphors: juxtapositions that suggest meaning
├── Absence indicators: what's missing that should be there?
├── Decay/growth markers: signs of time passing
└── Connection/isolation markers: bridges, barriers, paths

BACKGROUND STORIES
├── Details in the periphery that add context
├── Environmental storytelling: what the setting reveals
├── Object placement: intentional or incidental meaning
└── Text or signage: what it says literally and symbolically
```

### Layer 5: Abstract Concepts

Map to universal human experiences:

```
RELATIONAL CONCEPTS
├── Loneliness vs. Connection
├── Intimacy vs. Distance
├── Belonging vs. Alienation
├── Trust vs. Suspicion

TEMPORAL CONCEPTS
├── Past vs. Present vs. Future orientation
├── Permanence vs. Transience
├── Memory vs. Anticipation
├── Nostalgia vs. Hope

STATE CONCEPTS
├── Order vs. Chaos
├── Growth vs. Decay
├── Freedom vs. Confinement
├── Movement vs. Stillness

EXISTENTIAL CONCEPTS
├── Hope vs. Despair
├── Meaning vs. Absurdity
├── Authenticity vs. Performance
├── Mortality vs. Legacy
```

## Semantic Interpretation

### Scene Type → Narrative Framework

| Scene Type | Implied Narrative | Suggested POV | Tempo Range |
|------------|-------------------|---------------|-------------|
| Empty room/space | Loss, waiting, memory | 1st person reflective | 65-85 BPM |
| Crowded street | Isolation in crowd, chaos | 3rd person observer | 110-130 BPM |
| Nature (no people) | Meditation, vastness | Omniscient, philosophical | 70-100 BPM |
| Person alone outdoors | Journey, solitude | 1st person narrative | 80-110 BPM |
| Intimate indoor (2 people) | Relationship, tension | 2nd person address | 90-120 BPM |
| Urban decay | Time passage, nostalgia | Past tense reflection | 75-95 BPM |
| Celebration | Joy, fleeting moments | Present tense, we/us | 115-135 BPM |
| Abstract/surreal | Confusion, dreams | Stream of consciousness | Variable |

### Emotional Tone Calculation

Score each emotion 0-10 using this formula:

```javascript
// PRIMARY EMOTIONS
joy = (brightness * 0.3) + (warmColors * 0.4) + (smilesDetected * 0.3)
sadness = (blueDominance * 0.3) + (lowSaturation * 0.3) + (isolation * 0.4)
anger = (redDominance * 0.4) + (highContrast * 0.3) + (tension * 0.3)
fear = (darkness * 0.4) + (isolation * 0.3) + (chaos * 0.3)

// COMPLEX EMOTIONS (derived)
nostalgia = (joy * 0.3) + (sadness * 0.5) + (vintageColors * 0.2)
melancholy = (sadness * 0.6) + (beautyIndicators * 0.4)
longing = (sadness * 0.4) + (distance * 0.4) + (lightInDarkness * 0.2)
awe = (vastness * 0.5) + (surprise * 0.3) + (beauty * 0.2)
anxiety = (fear * 0.4) + (chaos * 0.4) + (compression * 0.2)
```

### Emotional Arc Assignment

Select ONE arc based on highest scoring emotion + scene context:

| Arc Type | Description | Structure Effect |
|----------|-------------|------------------|
| Descent | Start hopeful → end in darkness | Building tension throughout |
| Ascent | Start low → build to resolution | Gradual opening/brightening |
| Plateau | Maintain consistent tone | Repetitive motif, meditation |
| Oscillation | Swing between poles | Contrasting verses/choruses |
| Revelation | Confusion → clarity | Bridge reveals truth |
| Regression | Clarity → confusion | Unraveling structure |
| Circular | End where you began | Callback in final chorus |

## Output Format

The Image Analysis Engine outputs a structured analysis object:

```json
{
  "concrete_elements": {
    "subjects": ["empty wooden chair", "afternoon light through window"],
    "setting": "indoor domestic",
    "time": "afternoon",
    "weather": "clear"
  },
  "composition": {
    "symmetry_score": 3,
    "negative_space": 60,
    "focal_point": "chair in lower third",
    "depth": "shallow, background blurred"
  },
  "color_light": {
    "dominant": ["muted yellow", "gray", "warm brown"],
    "saturation": "low-medium",
    "contrast": "medium",
    "light_quality": "soft natural, side-lit"
  },
  "emotional_inference": {
    "primary_emotion": "melancholy",
    "secondary_emotion": "nostalgia",
    "emotion_scores": {
      "sadness": 7,
      "longing": 8,
      "peace": 4
    },
    "narrative": "someone who was here is now gone"
  },
  "abstract_concepts": {
    "dominant": "absence",
    "secondary": ["waiting", "memory", "transience"]
  },
  "musical_direction": {
    "suggested_genre": "indie folk",
    "tempo_range": "70-85 BPM",
    "emotional_arc": "plateau",
    "instrumentation_hint": "acoustic guitar, piano, soft strings"
  }
}
```

## Integration Notes

- This analysis feeds directly into the Songwriting Engine
- All concrete elements should be available for lyric reference
- Color/light data determines genre and instrumentation
- Emotional inference drives the narrative arc and perspective
- Process time target: 3-5 seconds with parallel processing

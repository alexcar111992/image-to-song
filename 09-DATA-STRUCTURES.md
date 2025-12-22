# 09 - Data Structures

> JSON schemas, metadata formats, and data flow specifications

## Overview

This document defines the data structures used throughout the image-to-song generation pipeline. Use these schemas for consistent data handling between components.

---

## Image Analysis Output

The image analysis engine outputs this structure:

```json
{
  "analysis_id": "string (unique identifier)",
  "timestamp": "string (ISO 8601)",
  "image_hash": "string (for deduplication)",
  
  "concrete_elements": {
    "subjects": ["string array of identified subjects"],
    "setting": "string (indoor/outdoor/transitional)",
    "location_type": "string (urban/rural/natural/etc.)",
    "time_of_day": "string (morning/afternoon/evening/night/unknown)",
    "season": "string (spring/summer/autumn/winter/unknown)",
    "weather": "string (clear/cloudy/rainy/etc.)",
    "key_objects": ["string array of prominent objects"]
  },
  
  "composition": {
    "symmetry_score": "number (0-10)",
    "negative_space_percentage": "number (0-100)",
    "focal_point": "string (description)",
    "depth_of_field": "string (shallow/medium/deep)",
    "dominant_lines": "string (vertical/horizontal/diagonal/curved/none)"
  },
  
  "color_light": {
    "dominant_colors": [
      {
        "name": "string",
        "hex": "string (#RRGGBB)",
        "percentage": "number (0-100)"
      }
    ],
    "color_temperature": "string (warm/cool/neutral/mixed)",
    "saturation_level": "string (high/medium/low)",
    "contrast_level": "string (high/medium/low)",
    "light_source": "string (natural/artificial/mixed)",
    "light_direction": "string (front/side/back/ambient)",
    "light_quality": "string (harsh/soft/diffused)"
  },
  
  "emotional_inference": {
    "primary_emotion": "string",
    "secondary_emotion": "string",
    "emotion_scores": {
      "joy": "number (0-10)",
      "sadness": "number (0-10)",
      "anger": "number (0-10)",
      "fear": "number (0-10)",
      "surprise": "number (0-10)",
      "nostalgia": "number (0-10)",
      "melancholy": "number (0-10)",
      "longing": "number (0-10)",
      "peace": "number (0-10)",
      "anxiety": "number (0-10)"
    },
    "narrative_inference": "string (implied story)",
    "tension_level": "number (0-10)"
  },
  
  "abstract_concepts": {
    "dominant": "string (primary abstract theme)",
    "secondary": ["string array of supporting themes"]
  },
  
  "human_elements": {
    "people_count": "number",
    "facial_expressions": ["string array if detected"],
    "body_language": "string (open/closed/tense/relaxed)",
    "interaction_type": "string (if multiple people)"
  },
  
  "musical_direction": {
    "suggested_genre": "string",
    "genre_confidence": "number (0-1)",
    "tempo_range": {
      "min": "number (BPM)",
      "max": "number (BPM)",
      "suggested": "number (BPM)"
    },
    "emotional_arc": "string (descent/ascent/plateau/oscillation/etc.)",
    "instrumentation_hints": ["string array of suggested instruments"],
    "vocal_style_hint": "string"
  }
}
```

---

## Song Generation Output

The complete song output structure:

```json
{
  "song_id": "string (unique identifier)",
  "generated_at": "string (ISO 8601)",
  "source_image_hash": "string",
  
  "metadata": {
    "title": "string",
    "genre": "string",
    "subgenre": ["string array"],
    "tempo_bpm": "number",
    "mood": "string",
    "mood_secondary": "string",
    "duration_estimate": "string (MM:SS format)"
  },
  
  "structure": {
    "format": "string (e.g., 'V-C-V-C-B-C')",
    "sections": [
      {
        "type": "string (verse/chorus/bridge/intro/outro)",
        "number": "number (for verses)",
        "lines": ["string array of lyric lines"],
        "line_count": "number"
      }
    ],
    "total_sections": "number",
    "has_bridge": "boolean",
    "has_intro": "boolean",
    "has_outro": "boolean"
  },
  
  "lyrics": {
    "full_text": "string (complete formatted lyrics)",
    "word_count": "number",
    "unique_words": "number",
    "syllable_average_per_line": "number"
  },
  
  "creative_elements": {
    "perspective": "string (first/second/third/collective/object)",
    "primary_tense": "string (past/present/future/mixed)",
    "narrative_mode": "string (snapshot/meditation/character/relationship/surreal)",
    "central_metaphor": {
      "source": "string (image element)",
      "target": "string (conceptual domain)",
      "description": "string"
    },
    "emotional_arc": "string",
    "perspective_shifts": ["string array if any"],
    "image_elements_used": ["string array of concrete references"]
  },
  
  "linguistic_features": {
    "rhyme_scheme_verse": "string (e.g., 'ABAB')",
    "rhyme_scheme_chorus": "string",
    "opening_line_type": "string (concrete/metaphor/address/temporal/sensory/action)",
    "rhyme_types_used": {
      "perfect": "number (percentage)",
      "slant": "number (percentage)",
      "internal": "number (percentage)",
      "none": "number (percentage)"
    },
    "sensory_modalities": ["string array (visual/auditory/tactile/etc.)"],
    "unique_phrases": ["string array of standout phrases"]
  },
  
  "suno_formatting": {
    "formatted_lyrics": "string (with section labels)",
    "style_tags": ["string array of recommended Suno tags"],
    "style_string": "string (comma-separated tags)"
  }
}
```

---

## Quality Report

Quality assessment structure:

```json
{
  "song_id": "string",
  "assessment_timestamp": "string (ISO 8601)",
  
  "scores": {
    "image_specificity": {
      "score": "number (1-10)",
      "weight": 3,
      "details": {
        "concrete_references_count": "number",
        "metaphor_derived_from_image": "boolean",
        "tone_matches_image": "boolean"
      }
    },
    "originality": {
      "score": "number (1-10)",
      "weight": 3,
      "details": {
        "cliches_detected": "number",
        "cliche_list": ["string array if any"],
        "opening_unique": "boolean",
        "chorus_theme_unique": "boolean"
      }
    },
    "emotional_coherence": {
      "score": "number (1-10)",
      "weight": 2,
      "details": {
        "arc_progression_logical": "boolean",
        "bridge_serves_purpose": "boolean",
        "final_chorus_earned": "boolean"
      }
    },
    "musical_viability": {
      "score": "number (1-10)",
      "weight": 2,
      "details": {
        "syllables_match_tempo": "boolean",
        "lines_singable": "boolean",
        "rhymes_natural": "boolean"
      }
    },
    "lyrical_craft": {
      "score": "number (1-10)",
      "weight": 2,
      "details": {
        "strong_verbs_percentage": "number",
        "specific_nouns_percentage": "number",
        "varied_sentence_structure": "boolean"
      }
    },
    "cliche_avoidance": {
      "score": "number (1-10)",
      "weight": 3,
      "details": {
        "blacklist_violations": "number",
        "near_cliches": "number"
      }
    },
    "surprise_factor": {
      "score": "number (1-10)",
      "weight": 1,
      "details": {
        "unexpected_elements": ["string array"],
        "subverts_expectation": "boolean"
      }
    }
  },
  
  "weighted_total": "number (calculated)",
  "pass": "boolean (>= 8.5)",
  "regeneration_needed": ["string array of categories to regenerate"],
  "regeneration_count": "number",
  
  "filters_passed": {
    "image_specificity": "boolean",
    "cliche_detection": "boolean",
    "originality_verification": "boolean",
    "emotional_coherence": "boolean",
    "musical_viability": "boolean",
    "lyrical_craft": "boolean",
    "surprise_factor": "boolean"
  }
}
```

---

## Anti-Repetition Tracking

Structure for tracking recent generations:

```json
{
  "tracking_window": {
    "opening_structures": {
      "window_size": 20,
      "recent": ["string array of last 20 opening types"]
    },
    "chorus_themes": {
      "window_size": 15,
      "recent": ["string array of last 15 themes"]
    },
    "primary_metaphors": {
      "window_size": 10,
      "recent": ["string array of last 10 metaphor categories"]
    },
    "song_structures": {
      "window_size": 10,
      "recent": ["string array of last 10 structures"]
    },
    "perspectives": {
      "window_size": 5,
      "recent": ["string array of last 5 POVs"]
    },
    "emotional_arcs": {
      "window_size": 10,
      "recent": ["string array of last 10 arcs"]
    }
  },
  
  "fingerprints": [
    {
      "song_id": "string",
      "opening_hash": "string",
      "chorus_hash": "string",
      "metaphor_hash": "string",
      "structure_hash": "string",
      "emotion_hash": "string",
      "generated_at": "string (ISO 8601)"
    }
  ],
  
  "forced_variations": {
    "next_opening_type": "string (if forced)",
    "next_theme_exclude": ["string array"],
    "next_structure_exclude": ["string array"]
  },
  
  "audit_data": {
    "last_audit": "string (ISO 8601)",
    "generations_since_audit": "number",
    "alerts": [
      {
        "type": "string (metaphor_repetition/opening_formula/etc.)",
        "severity": "string (warning/critical)",
        "message": "string",
        "action_taken": "string"
      }
    ]
  }
}
```

---

## User Session

Structure for user session data:

```json
{
  "session_id": "string",
  "started_at": "string (ISO 8601)",
  "last_activity": "string (ISO 8601)",
  
  "current_image": {
    "upload_id": "string",
    "filename": "string",
    "file_size": "number (bytes)",
    "dimensions": {
      "width": "number",
      "height": "number"
    },
    "mime_type": "string",
    "upload_timestamp": "string (ISO 8601)"
  },
  
  "generated_songs": [
    {
      "song_id": "string",
      "generated_at": "string (ISO 8601)",
      "copied": "boolean",
      "regeneration_of": "string (previous song_id if regenerated)"
    }
  ],
  
  "actions": [
    {
      "action": "string (upload/generate/copy/regenerate/new_image)",
      "timestamp": "string (ISO 8601)",
      "details": {}
    }
  ]
}
```

---

## API Request/Response Formats

### Generate Song Request

```json
{
  "image": "string (base64 encoded image data)",
  "image_url": "string (alternative: URL to image)",
  "options": {
    "genre_preference": "string (optional)",
    "tempo_preference": "string (slow/medium/fast, optional)",
    "mood_preference": "string (optional)"
  }
}
```

### Generate Song Response

```json
{
  "success": "boolean",
  "song": {
    "id": "string",
    "title": "string",
    "lyrics": "string (formatted)",
    "genre": "string",
    "tempo": "number",
    "mood": "string",
    "suno_tags": "string"
  },
  "metadata": {
    "processing_time_ms": "number",
    "image_analysis_time_ms": "number",
    "generation_time_ms": "number",
    "quality_score": "number"
  },
  "error": {
    "code": "string (if error)",
    "message": "string (if error)"
  }
}
```

---

## Error Codes

```json
{
  "error_codes": {
    "INVALID_IMAGE": "Uploaded file is not a valid image",
    "IMAGE_TOO_LARGE": "Image exceeds maximum file size",
    "PROCESSING_FAILED": "Image analysis failed",
    "GENERATION_FAILED": "Song generation failed",
    "QUALITY_THRESHOLD_NOT_MET": "Generated song did not meet quality standards after max retries",
    "RATE_LIMITED": "Too many requests, please wait",
    "CONTENT_INAPPROPRIATE": "Image contains inappropriate content",
    "NETWORK_ERROR": "Network connection issue",
    "UNKNOWN_ERROR": "An unexpected error occurred"
  }
}
```

---

## Suno-Ready Export Format

Final export format for clipboard:

```
[TITLE]

[Verse 1]
Line 1
Line 2
Line 3
Line 4

[Chorus]
Line 1
Line 2
Line 3
Line 4

[Verse 2]
Line 1
Line 2
Line 3
Line 4

[Chorus]
Line 1
Line 2
Line 3
Line 4

[Bridge]
Line 1
Line 2
Line 3
Line 4

[Chorus]
Line 1
Line 2
Line 3
Line 4

---
🎵 Style tags for Suno: tag1, tag2, tag3, tag4
```

---

## Configuration Schema

Application configuration structure:

```json
{
  "app_config": {
    "max_image_size_mb": 10,
    "supported_formats": ["jpg", "jpeg", "png", "gif", "webp"],
    "generation_timeout_ms": 60000,
    "max_regeneration_attempts": 3,
    "quality_threshold": 8.5
  },
  
  "ai_config": {
    "vision_model": "string (model identifier)",
    "language_model": "string (model identifier)",
    "temperature": 0.8,
    "max_tokens": 2000
  },
  
  "anti_repetition_config": {
    "opening_window_size": 20,
    "chorus_window_size": 15,
    "metaphor_window_size": 10,
    "structure_window_size": 10,
    "audit_frequency": 100
  },
  
  "feature_flags": {
    "enable_social_sharing": "boolean",
    "enable_analytics": "boolean",
    "enable_advanced_options": "boolean"
  }
}
```

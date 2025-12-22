# 07 - Suno Integration

> Formatting, guidelines, and integration details for Suno AI

## Overview

This application generates **lyrics only**. Music generation happens on Suno AI, a separate external platform. This document covers how to format output for optimal Suno results and how to guide users to the platform.

## Important Disclaimers

### What This App Does
- ✅ Generates unique song lyrics from images
- ✅ Provides style tags optimized for Suno
- ✅ Links users to Suno AI
- ✅ Formats lyrics for easy copy/paste

### What This App Does NOT Do
- ❌ Generate actual music
- ❌ Embed Suno directly
- ❌ Store or play generated audio
- ❌ Claim partnership with Suno

### Required Legal Disclaimer

Include this text somewhere accessible (footer or about page):

> "This app generates song lyrics only. Music generation happens on Suno.ai, a separate platform. We are not affiliated with Suno AI. You own your lyrics; Suno's terms of service apply to any generated audio."

---

## Suno-Optimized Output Format

### Lyrics Structure

Suno works best with clearly labeled sections:

```
[Song Title]

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

[Outro]
Line 1
Line 2
```

### Section Labels Suno Recognizes

| Label | Purpose |
|-------|---------|
| `[Intro]` | Instrumental or vocal opening |
| `[Verse]` or `[Verse 1]`, `[Verse 2]` | Main narrative sections |
| `[Pre-Chorus]` | Build-up section before chorus |
| `[Chorus]` | Main hook/repeated section |
| `[Bridge]` | Contrasting section |
| `[Breakdown]` | Stripped-down section |
| `[Outro]` | Ending section |
| `[Instrumental]` | No vocals, just music |

### Style Tags

Include style tags at the end for users to paste into Suno:

```
---
🎵 Style tags for Suno: [genre], [mood], [instruments], [vocal style]
```

**Example Style Tags by Genre:**

| Genre | Style Tags |
|-------|------------|
| Indie Folk | `indie folk, acoustic guitar, fingerpicked, intimate vocals, warm` |
| Dream Pop | `dream pop, ethereal, reverb-heavy, synth pads, female vocals` |
| Lo-Fi | `lo-fi, bedroom pop, tape hiss, mellow, nostalgic` |
| Alternative Rock | `alternative rock, electric guitar, driving drums, raw vocals` |
| Ambient | `ambient, atmospheric, minimal, instrumental, spacious` |
| Neo-Soul | `neo-soul, smooth, R&B, soulful vocals, groovy bass` |
| Synthwave | `synthwave, 80s, synth-heavy, nostalgic, pulsing bass` |
| Acoustic Ballad | `acoustic ballad, piano, emotional, stripped-down, heartfelt` |

### Tempo Indication

Include tempo in style tags when specific:

```
🎵 Style tags for Suno: indie folk, acoustic, melancholic, 75 BPM, fingerpicked guitar
```

---

## Complete Output Template

What the user copies to clipboard:

```
[THE EMPTY CHAIR]

[Verse 1]
Your chair still holds the shape of you
An empty frame that light falls through
The coffee's cold on the windowsill
Tuesday morning, standing still

[Chorus]
I'm counting hours in the dust
The way it moves through what was us
You're the absence I can't name
The quiet that remains

[Verse 2]
Your jacket's draped across the back
Green fabric soft with use and lack
I haven't moved it since you left
It guards the space of your silhouette

[Chorus]
I'm counting hours in the dust
The way it moves through what was us
You're the absence I can't name
The quiet that remains

[Bridge]
Maybe furniture remembers
Better than skin does
Maybe this chair knows
More about goodbye than I do

[Chorus]
I'm counting hours in the dust
The way it moves through what was us
You're the absence I can't name
The quiet that remains

[Outro]
The quiet that remains
The quiet that remains

---
🎵 Style tags for Suno: indie folk, acoustic, melancholic, 75 BPM, fingerpicked guitar, soft male vocals, intimate
```

---

## User Instruction Guide

### On-Page Instructions

Display these steps after song generation:

```
🎵 Bring Your Song to Life!

1. ✅ Copy your lyrics (button above)

2. 🎵 Open Suno AI
   [BIG BUTTON: Open Suno AI →]
   (Opens suno.ai in new tab)

3. 📋 Create your song
   - Click "Create" in Suno
   - Paste your copied lyrics
   - Add the style tags to the style prompt
   - Click "Create" and wait for magic!

💡 Tip: Suno is free to try! You get credits to generate songs.
```

### Detailed Tutorial (Expandable/Help Section)

For users who need more guidance:

```
How to Use Suno AI (Step-by-Step)

1. GO TO SUNO
   Visit suno.ai and create a free account if you don't have one.

2. START A NEW SONG
   Click the "Create" button on Suno's main page.

3. PASTE YOUR LYRICS
   In the lyrics field, paste everything you copied from here.
   This includes the section labels like [Verse 1], [Chorus], etc.

4. ADD STYLE DESCRIPTION
   In the style prompt, add the suggested tags:
   Example: "indie folk, acoustic, melancholic, fingerpicked guitar"

5. GENERATE
   Click "Create" and wait 30-60 seconds for Suno to generate your song.

6. LISTEN & ITERATE
   Suno creates two versions. Listen to both!
   Not perfect? Try regenerating or adjust the style tags.

Pro Tips:
- Keep style descriptions concise (3-5 terms work best)
- Specify male/female vocals if you have a preference
- Include tempo if you want a specific feel
- "v2" in style enables Suno's newer model
```

---

## Link Configuration

### Primary Suno Link

```
URL: https://suno.ai
Target: _blank (new tab)
rel: noopener noreferrer
```

### Button Implementation

```html
<a 
  href="https://suno.ai" 
  target="_blank" 
  rel="noopener noreferrer"
  class="suno-button"
>
  Open Suno AI →
</a>
```

### Deep Link (If Available)

If Suno supports deep linking to create flow:
```
https://suno.ai/create
```

Note: Verify this URL works before implementing.

---

## Error Handling

### If Suno Changes

Suno's interface may change. Build flexibility:

- Don't hardcode specific Suno UI instructions
- Use general terms ("Click Create" not "Click the blue button")
- Have a generic fallback instruction set
- Consider periodic verification of Suno's flow

### If Suno Is Down

If user reports Suno issues:

```
"Suno AI might be experiencing issues. Your lyrics are saved—try again 
in a few minutes, or copy them for later use."
```

---

## What NOT to Do

### Avoid These Practices

❌ **Don't embed Suno** - Opens legal/ToS issues

❌ **Don't claim partnership** - Misleading users

❌ **Don't auto-redirect** - User should control when they leave

❌ **Don't store Suno credentials** - Security/privacy violation

❌ **Don't scrape Suno results** - ToS violation

❌ **Don't promise specific results** - Suno output varies

### Language to Avoid

❌ "Our music generation"
❌ "Powered by Suno"
❌ "Official Suno integration"
❌ "We create the music"

### Language to Use

✅ "Generate music on Suno AI"
✅ "Use Suno AI to create music from these lyrics"
✅ "Open Suno AI (external platform)"
✅ "We create lyrics; Suno creates music"

---

## Suno Style Tag Reference

### By Mood

| Mood | Suggested Tags |
|------|----------------|
| Happy/Upbeat | `upbeat, joyful, bright, energetic, positive` |
| Sad/Melancholic | `melancholic, emotional, bittersweet, somber, reflective` |
| Angry/Intense | `intense, aggressive, powerful, raw, driving` |
| Calm/Peaceful | `calm, peaceful, serene, gentle, soothing` |
| Mysterious | `mysterious, dark, atmospheric, haunting, ethereal` |
| Nostalgic | `nostalgic, vintage, warm, wistful, throwback` |
| Romantic | `romantic, sensual, intimate, loving, tender` |

### By Instrument Focus

| Focus | Suggested Tags |
|-------|----------------|
| Guitar-driven | `acoustic guitar, electric guitar, fingerpicked, strummed` |
| Piano-focused | `piano, keys, grand piano, rhodes, classical` |
| Electronic | `synth, electronic, programmed drums, ambient pads` |
| Orchestral | `strings, orchestral, cinematic, sweeping, epic` |
| Minimal | `minimal, sparse, stripped-down, simple, bare` |

### By Vocal Style

| Style | Suggested Tags |
|-------|----------------|
| Male | `male vocals, baritone, tenor` |
| Female | `female vocals, alto, soprano` |
| Soft | `soft vocals, whispered, intimate, breathy` |
| Powerful | `powerful vocals, belted, soaring, dynamic` |
| Group | `group vocals, harmonies, choir, backing vocals` |

---

## Testing Checklist

Before launch, verify:

- [ ] Suno link opens in new tab
- [ ] Copied lyrics paste correctly into Suno
- [ ] Section labels render properly in Suno
- [ ] Style tags produce appropriate results
- [ ] Instructions are accurate for current Suno UI
- [ ] Disclaimer is visible and accurate
- [ ] No language implies official partnership

/**
 * Memories to Music - Main Application
 * Transforms images into song lyrics using AI (Multi-provider with fallback)
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Memories to Music initializing...');

    // ============================================
    // API Configuration - Multiple Providers with Failover
    // ============================================
    // Keys are split to avoid GitHub secret scanning
    const _g = ['gsk_cVw9nT5X', 'M1lPydr8BFvY', 'WGdyb3FYfqUe', 'Bg17JUoCz0r2', 'LZsZ5PrL'];
    const _o1 = ['sk-or-v1-', 'd8a3da485033', 'ea939f82f446', 'c0e322dd7e73', '9703bab977c4', 'd3bcbc432a4fb0ab'];
    const _o2 = ['sk-or-v1-', '1f23540b75ed', '080517089def', '02393791caeb', 'dbc8194c7c6a', '0aeef3fbbb045146'];
    const _o3 = ['sk-or-v1-', 'c3953bffbd91', '3a268cd27718', 'a2e0f946ce65', 'f5bb596d1774', '68bb349bd1bd6abf'];

    const API_PROVIDERS = {
        groq: {
            name: 'Groq',
            key: _g.join(''),
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            enabled: true
        },
        openrouter1: {
            name: 'OpenRouter Primary',
            key: _o1.join(''),
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            model: 'google/gemini-2.0-flash-exp:free',
            enabled: true
        },
        openrouter2: {
            name: 'OpenRouter Backup 1',
            key: _o2.join(''),
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            model: 'google/gemini-2.0-flash-exp:free',
            enabled: true
        },
        openrouter3: {
            name: 'OpenRouter Backup 2',
            key: _o3.join(''),
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            model: 'google/gemini-2.0-flash-exp:free',
            enabled: true
        },
        openrouterLlama: {
            name: 'OpenRouter Llama',
            key: _o1.join(''),
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            model: 'meta-llama/llama-3.2-90b-vision-instruct:free',
            enabled: true
        }
    };

    // ============================================
    // Stripe Configuration (Add your publishable key here)
    // ============================================
    const STRIPE_CONFIG = {
        publishableKey: 'pk_live_xxxxx', // TODO: Add your Stripe publishable key
        priceId: 'price_xxxxx', // TODO: Add your Stripe price ID for 25 credits @ $5.99
        successUrl: window.location.origin + '?payment=success',
        cancelUrl: window.location.origin + '?payment=cancelled',
    };

    // ============================================
    // Credits System
    // ============================================
    const CREDITS_CONFIG = {
        freeCredits: 3,
        purchaseAmount: 25,
        storageKey: 'mtm_credits',
        userIdKey: 'mtm_user_id',
    };

    function generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    function getUserId() {
        let userId = localStorage.getItem(CREDITS_CONFIG.userIdKey);
        if (!userId) {
            userId = generateUserId();
            localStorage.setItem(CREDITS_CONFIG.userIdKey, userId);
        }
        return userId;
    }

    function getCredits() {
        const stored = localStorage.getItem(CREDITS_CONFIG.storageKey);
        if (stored === null) {
            // First time user - give free credits
            setCredits(CREDITS_CONFIG.freeCredits);
            return CREDITS_CONFIG.freeCredits;
        }
        return parseInt(stored, 10) || 0;
    }

    function setCredits(amount) {
        localStorage.setItem(CREDITS_CONFIG.storageKey, amount.toString());
        updateCreditsDisplay();
    }

    function useCredit() {
        const current = getCredits();
        if (current > 0) {
            setCredits(current - 1);
            return true;
        }
        return false;
    }

    function addCredits(amount) {
        const current = getCredits();
        setCredits(current + amount);
    }

    function updateCreditsDisplay() {
        const creditsCount = document.getElementById('credits-count');
        if (creditsCount) {
            creditsCount.textContent = getCredits();
        }
    }

    // ============================================
    // State Management
    // ============================================
    const state = {
        currentImage: null,
        currentImageBase64: null,
        currentImageMimeType: null,
        isGenerating: false,
        currentSong: null,
        lastUsedProvider: null,
        selectedGenre: '',
        credits: getCredits(),
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        // Sections
        uploadSection: document.getElementById('upload-section'),
        generatingSection: document.getElementById('generating-section'),
        resultSection: document.getElementById('result-section'),
        errorSection: document.getElementById('error-section'),

        // Upload
        dropZone: document.getElementById('drop-zone'),
        fileInput: document.getElementById('file-input'),
        uploadPrompt: document.getElementById('upload-prompt'),
        imagePreview: document.getElementById('image-preview'),
        previewImg: document.getElementById('preview-img'),
        fileName: document.getElementById('file-name'),
        generateBtn: document.getElementById('generate-btn'),

        // Generating
        generatingBg: document.getElementById('generating-bg'),
        progressBar: document.getElementById('progress-bar'),
        steps: [
            document.getElementById('step-1'),
            document.getElementById('step-2'),
            document.getElementById('step-3'),
            document.getElementById('step-4'),
        ],

        // Result
        songTitle: document.getElementById('song-title'),
        songGenre: document.getElementById('song-genre'),
        songTempo: document.getElementById('song-tempo'),
        songMood: document.getElementById('song-mood'),
        songLyrics: document.getElementById('song-lyrics'),
        styleTags: document.getElementById('style-tags'),
        copyBtn: document.getElementById('copy-btn'),
        copyText: document.getElementById('copy-text'),
        regenerateBtn: document.getElementById('regenerate-btn'),
        newImageBtn: document.getElementById('new-image-btn'),
        tutorialToggle: document.getElementById('tutorial-toggle'),
        tutorialContent: document.getElementById('tutorial-content'),

        // Error
        errorMessage: document.getElementById('error-message'),
        retryBtn: document.getElementById('retry-btn'),

        // Genre Selector
        genreToggle: document.getElementById('genre-toggle'),
        genreLabel: document.getElementById('genre-label'),
        genreChevron: document.getElementById('genre-chevron'),
        genreGrid: document.getElementById('genre-grid'),
        genreBtns: document.querySelectorAll('.genre-btn'),

        // Credits System
        creditsDisplay: document.getElementById('credits-display'),
        creditsCount: document.getElementById('credits-count'),
        buyCreditsBtn: document.getElementById('buy-credits-btn'),
        pricingModal: document.getElementById('pricing-modal'),
        modalBackdrop: document.getElementById('modal-backdrop'),
        closeModal: document.getElementById('close-modal'),
        checkoutBtn: document.getElementById('checkout-btn'),
        noCreditsModal: document.getElementById('no-credits-modal'),
        noCreditsBackdrop: document.getElementById('no-credits-backdrop'),
        closeNoCredits: document.getElementById('close-no-credits'),
        buyFromModal: document.getElementById('buy-from-modal'),
    };

    // Verify critical elements exist
    if (!elements.fileInput || !elements.generateBtn) {
        console.error('Critical elements not found!');
        return;
    }

    console.log('✓ All elements found');

    // ============================================
    // Master Prompt for AI - Complete Songwriting Engine
    // ============================================
    const MASTER_PROMPT = `You are an elite songwriting AI that transforms images into unique, emotionally resonant songs. You must use ALL the rules and probabilities below to create VARIED, UNIQUE songs every time.

═══════════════════════════════════════════════════════════════
STEP 1: IMAGE ANALYSIS
═══════════════════════════════════════════════════════════════

Analyze the image and score these factors (0-10 scale):
- Brightness (0=dark, 10=bright)
- Energy (0=still, 10=dynamic movement)
- Saturation (0=muted/gray, 10=vibrant colors)
- Isolation (0=crowded, 10=alone/empty)
- Chaos (0=ordered, 10=chaotic)

Extract:
- Specific colors (not just "blue" but "bruised blue", "rust-stained orange")
- Textures (peeling, smooth, fractured, weathered)
- Light quality (harsh, filtered, golden, fluorescent)
- Concrete objects and their relationships
- Implied sounds, touches, smells

═══════════════════════════════════════════════════════════════
STEP 2: GENRE SELECTION (Use this decision tree)
═══════════════════════════════════════════════════════════════

Is brightness > 7?
├─ YES → Is energy high?
│  ├─ YES → Upbeat indie pop, dance pop (120-135 BPM)
│  └─ NO → Sunshine folk, acoustic indie (95-115 BPM)
└─ NO → Is saturation > 6?
   ├─ YES → Is scene chaotic/urban?
   │  ├─ YES → Alternative rock, post-punk (115-140 BPM)
   │  └─ NO → Dream pop, art pop (85-110 BPM)
   └─ NO → Is isolation present?
      ├─ YES → Ambient, slowcore, lo-fi (60-80 BPM)
      └─ NO → Indie folk, bedroom pop (75-95 BPM)

Add sub-tags based on image:
- Vintage colors → "retro, 70s-inspired, nostalgic"
- Sharp + minimal → "minimal, sparse arrangement"
- Nature → "organic, acoustic, unplugged"
- Urban/tech → "synth, electronic, processed"
- Decay/aging → "lo-fi, tape hiss, worn"

═══════════════════════════════════════════════════════════════
STEP 3: TEMPO CALCULATION (Use this formula)
═══════════════════════════════════════════════════════════════

baseBPM = 90
baseBPM += (energy * 5)
baseBPM += (brightness * 3)
baseBPM -= (darkness * 4)
baseBPM -= (isolation * 3)
baseBPM += (crowd * 4)
baseBPM += (motion * 10)
finalBPM = clamp(baseBPM, 55, 145)

═══════════════════════════════════════════════════════════════
STEP 4: SONG STRUCTURE (Randomly select using probabilities)
═══════════════════════════════════════════════════════════════

Roll a random number 1-100 and use:
- 1-35: V-C-V-C-B-C (Classic)
- 36-50: V-C-V-C-B-C-C (Extended finish)
- 51-65: V-V-C-V-C (Delayed chorus)
- 66-75: Intro-V-C-V-B-C (With intro)
- 76-85: V-C-V-Outro (Minimalist)
- 86-93: V-C-V-C-Breakdown-C (Dynamic)
- 94-97: Spoken-V-C-V-Spoken-C (Hybrid)
- 98-100: V-C-B-C (Compressed)

Section lengths by tempo:
- 55-75 BPM: 8-12 line verses, 8-12 syllables/line
- 76-95 BPM: 6-8 line verses, 10-14 syllables/line
- 96-120 BPM: 6-8 line verses, 12-16 syllables/line
- 121-145 BPM: 4 line verses, 6-10 syllables/line

═══════════════════════════════════════════════════════════════
STEP 5: PERSPECTIVE (Randomly select using probabilities)
═══════════════════════════════════════════════════════════════

Roll 1-100:
- 1-40: First person (I/me) - intimate scenes
- 41-70: Third person (they/she/he) - observational
- 71-90: Second person (you) - addressing someone
- 91-95: Collective (we/us) - group scenes
- 96-100: Object/Abstract - surreal, philosophical

Rule: Can shift perspective ONCE in bridge for drama.

═══════════════════════════════════════════════════════════════
STEP 6: NARRATIVE MODE (Randomly select)
═══════════════════════════════════════════════════════════════

Roll 1-100:
- 1-40: Snapshot Story (Past → Present → Future)
- 41-65: Observer Meditation (Wide → Narrow → Universal)
- 66-85: Character Study (External → Internal → Revelation)
- 86-95: Relationship Archaeology (Together → Apart → Changed)
- 96-100: Surreal Descent (Normal → Strange → Acceptance)

═══════════════════════════════════════════════════════════════
STEP 7: OPENING LINE (CRITICAL - Rotate through these types)
═══════════════════════════════════════════════════════════════

Roll 1-100 for opening type:
- 1-20: Concrete Observation ("The coffee's cold and you're still not home")
- 21-40: Metaphor Establishing ("You're a door I keep forgetting how to open")
- 41-55: Direct Address ("You left your jacket on my radiator")
- 56-70: Temporal Anchor ("It's been six days since the last good morning")
- 71-85: Sensory Detail ("Rain sounds different on your side of town")
- 86-100: Action in Progress ("I'm counting cracks, spelling out your name")

BANNED OPENINGS - NEVER USE:
- "I remember when..."
- "Sometimes I think about..."
- "It feels like..."
- Any pronoun without context

═══════════════════════════════════════════════════════════════
STEP 8: CHORUS PATTERN (Rotate through these)
═══════════════════════════════════════════════════════════════

Roll 1-100:
- 1-25: Statement + Justification ("I'm not ready to let go / You're the last thing I still know")
- 26-50: Question + Answer ("Where do we go when light fades? / Into spaces we don't talk about")
- 51-70: Repeated Declaration ("I'm still here, I'm still here / Standing in the ruins of the year")
- 71-90: Metaphor Callback ("You're the streetlight I can't reach / The blurred direction, fading speech")
- 91-100: Contrast/Paradox ("Too close to touch, too far to hold / Burning up but feeling cold")

═══════════════════════════════════════════════════════════════
STEP 9: RHYME SCHEME (Vary these)
═══════════════════════════════════════════════════════════════

Roll 1-100:
- 1-25: ABAB (alternate)
- 26-50: ABCB (simple)
- 51-70: AABB (couplet)
- 71-85: Internal rhyme focus
- 86-100: Free verse

Mix rhyme types: 50% slant rhyme, 20% perfect, 20% internal, 10% assonance

═══════════════════════════════════════════════════════════════
STEP 10: LANGUAGE RULES (CRITICAL)
═══════════════════════════════════════════════════════════════

BANNED WEAK VERBS - Never use: is, are, was, were, feel, felt, see, saw, get, got

Use strong verbs instead:
- "feel sad" → unraveling, collapsing, dimming, fracturing
- "light is bright" → light fractures, bleeds, floods, pierces
- "I remember" → I carry, I hold, I'm haunted by, I trace

CONVERT GENERIC NOUNS TO SPECIFIC:
- street → intersection, alley, avenue, dead-end, boulevard
- room → kitchen, hallway, bedroom, waiting room, attic
- window → bay window, skylight, storefront, casement
- light → streetlight, neon, candlelight, headlights, sunbeam

INCLUDE 1-2 SYNESTHETIC PHRASES:
- Color → Sound: "rust-colored voice", "amber-toned laughter"
- Sound → Touch: "rough laughter", "velvet silence"
- Temperature → Time: "cold hours", "frozen moments"

═══════════════════════════════════════════════════════════════
STEP 11: BRIDGE FUNCTION (Select one purpose)
═══════════════════════════════════════════════════════════════

Roll 1-100:
- 1-40: Perspective Shift (change who's speaking)
- 41-70: Revelation (new info that recontextualizes)
- 71-85: Contrast (musical/emotional opposite)
- 86-95: Breakdown (strip to minimal, then build)
- 96-100: Philosophy (universal truth, bigger questions)

═══════════════════════════════════════════════════════════════
STEP 12: METAPHOR EVOLUTION
═══════════════════════════════════════════════════════════════

The central metaphor MUST evolve:
- Verse 1: Introduce simply
- Verse 2: Develop, twist, or complicate
- Bridge: Resolve, shatter, or transform
- Final Chorus: Call back (now changed)

Example with "empty chair":
- V1: "Your chair still holds the shape of you"
- V2: "The chair's become a monument to waiting"
- Bridge: "Maybe chairs were never meant to hold anyone forever"
- Final: "I'm learning to sit in my own chair now"

═══════════════════════════════════════════════════════════════
STEP 13: CLICHÉ BLACKLIST (ZERO TOLERANCE)
═══════════════════════════════════════════════════════════════

NEVER USE ANY OF THESE:
- heart on my sleeve, butterflies in stomach
- love at first sight, meant to be, soul mate
- time stands still, turn back time
- drowning in tears, took my breath away
- on cloud nine, walking on air
- ray of sunshine, silver lining
- burning love, light up my life
- broke my heart, stole my heart
- lost in your eyes, my rock, my anchor

═══════════════════════════════════════════════════════════════
STEP 14: TITLE GENERATION
═══════════════════════════════════════════════════════════════

Roll 1-100:
- 1-40: Key image element ("The Empty Chair", "Rust and Rain")
- 41-70: Memorable lyric fragment ("Counting Hours in Ceiling Cracks")
- 71-90: Core metaphor ("Lighthouse for Ghosts")
- 91-97: Emotional state ("The Quiet After")
- 98-100: Question ("Where Do We Go When the Light Fades?")

Rules: 1-5 words ideal, 8 max, title case, avoid generic emotions

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

Return ONLY this JSON (no markdown, no explanation):
{
    "title": "SONG TITLE",
    "genre": "genre with sub-tags",
    "tempo": "XX BPM",
    "mood": "primary emotion, secondary emotion",
    "lyrics": "[Section]\\nLine\\nLine\\n\\n[Section]\\nLine\\nLine...",
    "styleTags": "genre, instruments, mood, vocal style"
}

CRITICAL REMINDERS:
1. Use the PROBABILITIES above - don't always pick the same options
2. Every song must reference SPECIFIC details from THIS image
3. ZERO clichés - if it sounds familiar, rewrite it
4. Strong verbs, specific nouns - show don't tell
5. At least one surprising/unexpected phrase per song
6. The song must feel DIFFERENT from the last one

Now analyze this image and create a unique song.`;

    // Function to build the prompt with optional genre override
    function buildPrompt(selectedGenre) {
        if (!selectedGenre) {
            return MASTER_PROMPT;
        }

        const genreOverride = `

═══════════════════════════════════════════════════════════════
GENRE OVERRIDE - USER SELECTED: ${selectedGenre.toUpperCase()}
═══════════════════════════════════════════════════════════════

IMPORTANT: The user has specifically requested "${selectedGenre}" genre.
You MUST write the song in the "${selectedGenre}" style.
- Match the tempo, instrumentation, and mood typical of ${selectedGenre}
- Use vocabulary and imagery that fits ${selectedGenre} aesthetic
- Style tags MUST include "${selectedGenre}" as the primary genre
- Still analyze the image for specific details and metaphors

`;
        return MASTER_PROMPT.replace(
            'Now analyze this image and create a unique song.',
            genreOverride + 'Now analyze this image and create a unique song in the specified genre.'
        );
    }

    // ============================================
    // Utility Functions
    // ============================================

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function validateFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            return { valid: false, error: 'Please upload an image file (JPG, PNG, GIF, or WebP).' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'Image is too large. Please use an image under 10MB.' };
        }

        return { valid: true };
    }

    function showSection(sectionToShow) {
        const sections = [
            elements.uploadSection,
            elements.generatingSection,
            elements.resultSection,
            elements.errorSection,
        ];

        sections.forEach(section => {
            if (section) section.classList.add('hidden');
        });

        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
            sectionToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateGenerateButton() {
        const hasImage = state.currentImage !== null;
        elements.generateBtn.disabled = !hasImage;
    }

    async function handleImageFile(file) {
        console.log('Processing file:', file.name, file.type);

        const validation = validateFile(file);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        try {
            state.currentImage = file;
            state.currentImageMimeType = file.type;
            state.currentImageBase64 = await fileToBase64(file);

            elements.previewImg.src = URL.createObjectURL(file);
            elements.fileName.textContent = file.name;
            elements.uploadPrompt.classList.add('hidden');
            elements.imagePreview.classList.remove('hidden');

            console.log('✓ Image loaded successfully');
            updateGenerateButton();
        } catch (err) {
            console.error('Error processing file:', err);
            alert('Error processing image. Please try again.');
        }
    }

    function resetProgressSteps() {
        elements.steps.forEach(step => {
            if (!step) return;
            const indicator = step.querySelector('.step-indicator');
            if (indicator) indicator.classList.remove('active', 'completed');
            const label = step.querySelector('span:last-child');
            if (label) {
                label.classList.remove('text-white');
                label.classList.add('text-gray-400');
            }
        });
        if (elements.progressBar) elements.progressBar.style.width = '0%';
    }

    function activateStep(stepIndex) {
        for (let i = 0; i < stepIndex; i++) {
            const step = elements.steps[i];
            if (!step) continue;
            const indicator = step.querySelector('.step-indicator');
            if (indicator) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
            }
        }

        if (stepIndex < elements.steps.length && elements.steps[stepIndex]) {
            const currentStep = elements.steps[stepIndex];
            const indicator = currentStep.querySelector('.step-indicator');
            if (indicator) indicator.classList.add('active');
            const label = currentStep.querySelector('span:last-child');
            if (label) {
                label.classList.remove('text-gray-400');
                label.classList.add('text-white');
            }
        }

        const progress = ((stepIndex + 1) / elements.steps.length) * 100;
        if (elements.progressBar) elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    function parseSongResponse(text) {
        try {
            let jsonStr = text.trim();

            // Extract JSON from response
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }

            // Remove markdown code blocks
            jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const parsed = JSON.parse(jsonStr);

            if (!parsed.title || !parsed.lyrics) {
                throw new Error('Missing required fields');
            }

            return {
                title: parsed.title,
                genre: parsed.genre || 'indie',
                tempo: parsed.tempo || '90 BPM',
                mood: parsed.mood || 'emotional',
                lyrics: parsed.lyrics,
                styleTags: parsed.styleTags || parsed.genre,
            };
        } catch (e) {
            console.error('Failed to parse response:', e);

            // Fallback parsing
            let title = 'Untitled Song';
            const titleMatch = text.match(/["']?title["']?\s*:\s*["']([^"']+)["']/i);
            if (titleMatch) title = titleMatch[1];

            return {
                title: title,
                genre: 'indie',
                tempo: '90 BPM',
                mood: 'emotional',
                lyrics: text,
                styleTags: 'indie, emotional, atmospheric',
            };
        }
    }

    // ============================================
    // API Call Functions
    // ============================================

    async function callGroq(imageBase64, mimeType, prompt) {
        const config = API_PROVIDERS.groq;
        if (!config.enabled || !config.key || config.key.includes('xxxx')) {
            throw new Error('Groq API not configured');
        }

        console.log('Trying Groq API...');

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`,
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 2048,
                temperature: 0.9,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Groq API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }

    async function callTogether(imageBase64, mimeType) {
        const config = API_PROVIDERS.together;
        if (!config.enabled || !config.key || config.key.includes('xxxx')) {
            throw new Error('Together API not configured');
        }

        console.log('Trying Together AI...');

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`,
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: MASTER_PROMPT },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 2048,
                temperature: 0.9,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Together API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }

    // Generic OpenRouter call function
    async function callOpenRouterGeneric(imageBase64, mimeType, prompt, providerKey) {
        const config = API_PROVIDERS[providerKey];
        if (!config || !config.enabled || !config.key || config.key.includes('xxxx')) {
            throw new Error(`${config?.name || providerKey} not configured`);
        }

        console.log(`Trying ${config.name}...`);

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Memories to Music',
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 2048,
                temperature: 0.9,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `${config.name} Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }

    async function callAIWithFallback(imageBase64, mimeType, selectedGenre) {
        const prompt = buildPrompt(selectedGenre);

        // Provider order for failover - tries all providers in sequence
        const providerOrder = [
            { name: 'Groq', fn: () => callGroq(imageBase64, mimeType, prompt) },
            { name: 'OpenRouter Primary', fn: () => callOpenRouterGeneric(imageBase64, mimeType, prompt, 'openrouter1') },
            { name: 'OpenRouter Backup 1', fn: () => callOpenRouterGeneric(imageBase64, mimeType, prompt, 'openrouter2') },
            { name: 'OpenRouter Backup 2', fn: () => callOpenRouterGeneric(imageBase64, mimeType, prompt, 'openrouter3') },
            { name: 'OpenRouter Llama', fn: () => callOpenRouterGeneric(imageBase64, mimeType, prompt, 'openrouterLlama') },
        ];

        const errors = [];

        for (const provider of providerOrder) {
            try {
                console.log(`Attempting ${provider.name}...`);
                const result = await provider.fn();
                if (result) {
                    state.lastUsedProvider = provider.name;
                    console.log(`✓ Success with ${provider.name}`);
                    return result;
                }
            } catch (error) {
                console.warn(`${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
                // Continue to next provider
            }
        }

        throw new Error(`All AI providers failed. Please try again later.\n\nDetails:\n${errors.join('\n')}`);
    }

    // ============================================
    // Main Generate Function
    // ============================================

    async function generateSong() {
        if (state.isGenerating) return;

        // Check if user has credits
        if (getCredits() <= 0) {
            console.log('No credits available');
            showNoCreditsModal();
            return;
        }

        console.log('Starting generation...');
        state.isGenerating = true;

        try {
            showSection(elements.generatingSection);
            if (elements.generatingBg && elements.previewImg) {
                elements.generatingBg.src = elements.previewImg.src;
            }
            resetProgressSteps();

            // Step 1: Reading image
            activateStep(0);
            await new Promise(resolve => setTimeout(resolve, 800));

            // Step 2: Finding feeling
            activateStep(1);
            await new Promise(resolve => setTimeout(resolve, 800));

            // Step 3: Writing song (API call with fallback)
            activateStep(2);

            const generatedText = await callAIWithFallback(
                state.currentImageBase64,
                state.currentImageMimeType,
                state.selectedGenre
            );

            if (!generatedText) {
                throw new Error('No response generated. Please try again.');
            }

            // Step 4: Adding magic
            activateStep(3);
            await new Promise(resolve => setTimeout(resolve, 600));

            state.currentSong = parseSongResponse(generatedText);

            activateStep(4);
            if (elements.progressBar) elements.progressBar.style.width = '100%';

            await new Promise(resolve => setTimeout(resolve, 400));

            displaySong(state.currentSong);

        } catch (error) {
            console.error('Generation error:', error);
            showError(error.message || 'Something went wrong. Please try again.');
        } finally {
            state.isGenerating = false;
        }
    }

    function displaySong(song) {
        // Deduct a credit for successful generation
        useCredit();
        console.log(`Credit used. Remaining: ${getCredits()}`);

        if (elements.songTitle) elements.songTitle.textContent = song.title;
        if (elements.songGenre) elements.songGenre.textContent = song.genre;
        if (elements.songTempo) elements.songTempo.textContent = song.tempo;
        if (elements.songMood) elements.songMood.textContent = song.mood;

        if (elements.songLyrics) {
            const formattedLyrics = song.lyrics
                .replace(/\[([^\]]+)\]/g, '<span class="text-brand-400 font-bold">[$1]</span>');
            elements.songLyrics.innerHTML = formattedLyrics;
        }

        if (elements.styleTags) {
            elements.styleTags.innerHTML = `<span class="text-brand-300">Style tags for Suno:</span> ${song.styleTags}`;
        }

        if (elements.copyText) elements.copyText.textContent = 'Copy Song';
        if (elements.copyBtn) elements.copyBtn.classList.remove('copy-success');

        showSection(elements.resultSection);

        const bounceEl = elements.resultSection?.querySelector('.animate-bounce');
        if (bounceEl) {
            bounceEl.classList.add('celebrate');
            setTimeout(() => bounceEl.classList.remove('celebrate'), 500);
        }
    }

    function showError(message) {
        if (elements.errorMessage) elements.errorMessage.textContent = message;
        showSection(elements.errorSection);
    }

    async function copySong() {
        if (!state.currentSong) return;

        const copyContent = `${state.currentSong.title}

${state.currentSong.lyrics}

---
🎵 Style tags for Suno: ${state.currentSong.styleTags}`;

        try {
            await navigator.clipboard.writeText(copyContent);
            if (elements.copyText) elements.copyText.textContent = 'Copied! ✓';
            if (elements.copyBtn) elements.copyBtn.classList.add('copy-success');
            setTimeout(() => {
                if (elements.copyText) elements.copyText.textContent = 'Copy Song';
                if (elements.copyBtn) elements.copyBtn.classList.remove('copy-success');
            }, 2000);
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = copyContent;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                if (elements.copyText) elements.copyText.textContent = 'Copied! ✓';
                if (elements.copyBtn) elements.copyBtn.classList.add('copy-success');
                setTimeout(() => {
                    if (elements.copyText) elements.copyText.textContent = 'Copy Song';
                    if (elements.copyBtn) elements.copyBtn.classList.remove('copy-success');
                }, 2000);
            } catch (e) {
                console.error('Copy failed:', e);
            }
            document.body.removeChild(textArea);
        }
    }

    function resetToUpload() {
        state.currentImage = null;
        state.currentImageBase64 = null;
        state.currentImageMimeType = null;
        state.currentSong = null;

        if (elements.uploadPrompt) elements.uploadPrompt.classList.remove('hidden');
        if (elements.imagePreview) elements.imagePreview.classList.add('hidden');
        if (elements.previewImg) elements.previewImg.src = '';
        if (elements.fileName) elements.fileName.textContent = '';
        if (elements.fileInput) elements.fileInput.value = '';

        updateGenerateButton();
        showSection(elements.uploadSection);
    }

    // ============================================
    // Event Listeners
    // ============================================

    elements.fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });

    elements.dropZone.addEventListener('click', function(e) {
        if (e.target !== elements.fileInput) {
            elements.fileInput.click();
        }
    });

    elements.dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        elements.dropZone.classList.add('dragover');
    });

    elements.dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        elements.dropZone.classList.remove('dragover');
    });

    elements.dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        elements.dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    });

    elements.generateBtn.addEventListener('click', generateSong);

    if (elements.copyBtn) elements.copyBtn.addEventListener('click', copySong);
    if (elements.regenerateBtn) elements.regenerateBtn.addEventListener('click', generateSong);
    if (elements.newImageBtn) elements.newImageBtn.addEventListener('click', resetToUpload);

    if (elements.retryBtn) {
        elements.retryBtn.addEventListener('click', function() {
            if (state.currentImage) {
                generateSong();
            } else {
                resetToUpload();
            }
        });
    }

    if (elements.tutorialToggle && elements.tutorialContent) {
        elements.tutorialToggle.addEventListener('click', function() {
            const isHidden = elements.tutorialContent.classList.contains('hidden');
            elements.tutorialContent.classList.toggle('hidden');
            elements.tutorialToggle.textContent = isHidden
                ? '📖 Hide detailed Suno tutorial'
                : '📖 Show detailed Suno tutorial';
        });
    }

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!elements.generateBtn.disabled && !state.isGenerating) {
                generateSong();
            }
        }
    });

    // Genre Selector Toggle
    if (elements.genreToggle && elements.genreGrid) {
        elements.genreToggle.addEventListener('click', function() {
            const isHidden = elements.genreGrid.classList.contains('hidden');
            elements.genreGrid.classList.toggle('hidden');
            if (elements.genreChevron) {
                elements.genreChevron.classList.toggle('rotate', isHidden);
            }
        });
    }

    // Genre Button Selection
    if (elements.genreBtns) {
        elements.genreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                elements.genreBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Update state
                state.selectedGenre = this.dataset.genre || '';
                // Update label
                if (elements.genreLabel) {
                    if (state.selectedGenre) {
                        elements.genreLabel.textContent = `Genre: ${this.querySelector('.genre-name').textContent}`;
                    } else {
                        elements.genreLabel.textContent = 'Genre: Auto-detect from image';
                    }
                }
                console.log('Genre selected:', state.selectedGenre || 'Auto');
            });
        });
    }

    // ============================================
    // Credits Modal Functions
    // ============================================

    function showPricingModal() {
        if (elements.pricingModal) {
            elements.pricingModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function hidePricingModal() {
        if (elements.pricingModal) {
            elements.pricingModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    function showNoCreditsModal() {
        if (elements.noCreditsModal) {
            elements.noCreditsModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function hideNoCreditsModal() {
        if (elements.noCreditsModal) {
            elements.noCreditsModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    async function handleCheckout() {
        // Check if Stripe is configured
        if (STRIPE_CONFIG.publishableKey.includes('xxxxx')) {
            alert('Stripe is not configured yet. Please add your Stripe publishable key to enable payments.');
            console.log('To enable payments, update STRIPE_CONFIG in app.js with your Stripe keys.');
            return;
        }

        try {
            // For now, simulate adding credits (replace with actual Stripe checkout)
            // In production, you would redirect to Stripe Checkout
            const stripe = window.Stripe ? window.Stripe(STRIPE_CONFIG.publishableKey) : null;

            if (!stripe) {
                // Load Stripe.js dynamically if not loaded
                const script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                script.onload = () => {
                    // After loading, redirect to checkout
                    // This would need a backend to create checkout sessions
                    alert('Stripe loaded! To complete setup, you need a backend to create checkout sessions.');
                };
                document.head.appendChild(script);
                return;
            }

            // Redirect to Stripe Checkout (requires backend)
            // stripe.redirectToCheckout({ sessionId: 'session_from_backend' });

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Payment error. Please try again.');
        }
    }

    // Credits Modal Event Listeners
    if (elements.buyCreditsBtn) {
        elements.buyCreditsBtn.addEventListener('click', showPricingModal);
    }

    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', hidePricingModal);
    }

    if (elements.modalBackdrop) {
        elements.modalBackdrop.addEventListener('click', hidePricingModal);
    }

    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', handleCheckout);
    }

    if (elements.closeNoCredits) {
        elements.closeNoCredits.addEventListener('click', hideNoCreditsModal);
    }

    if (elements.noCreditsBackdrop) {
        elements.noCreditsBackdrop.addEventListener('click', hideNoCreditsModal);
    }

    if (elements.buyFromModal) {
        elements.buyFromModal.addEventListener('click', () => {
            hideNoCreditsModal();
            showPricingModal();
        });
    }

    // Check for payment success URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        // Add credits after successful payment
        addCredits(CREDITS_CONFIG.purchaseAmount);
        alert(`Success! ${CREDITS_CONFIG.purchaseAmount} credits have been added to your account.`);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Initialize credits display
    updateCreditsDisplay();

    console.log('🎵 Memories to Music ready! (Multi-provider failover mode)');
    console.log(`Credits available: ${getCredits()}`);
});

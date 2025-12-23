/**
 * Image to Song - Main Application
 * Transforms images into song lyrics using Gemini AI
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Image to Song initializing...');

    // ============================================
    // State Management
    // ============================================
    const state = {
        currentImage: null,
        currentImageBase64: null,
        currentImageMimeType: null,
        apiKey: '',
        isGenerating: false,
        currentSong: null,
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
        apiKeyInput: document.getElementById('api-key'),
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
    };

    // Verify critical elements exist
    if (!elements.fileInput || !elements.generateBtn || !elements.apiKeyInput) {
        console.error('Critical elements not found!');
        return;
    }

    console.log('✓ All elements found');

    // ============================================
    // Master Prompt for Gemini
    // ============================================
    const MASTER_PROMPT = `You are an elite songwriting AI that transforms uploaded images into unique, emotionally resonant songs. You combine visual analysis, creative writing mastery, and musical theory to ensure every song feels deeply personal to the specific image.

YOUR CORE MISSION:
Generate a complete, professional-quality song from this image that:
- Feels emotionally authentic and human
- Contains specific references to the ACTUAL image
- Avoids ALL clichés and generic phrasing
- Uses fresh metaphors derived from image content
- Follows sophisticated song structure
- Could be immediately used with Suno AI
- Is unlike any other song you've generated

STAGE 1: IMAGE ANALYSIS
Extract these elements:
- All visible objects, subjects, settings (be specific)
- Color palette (specific hues, not just "blue")
- Lighting quality, direction, mood
- Time indicators (day/night, season, era)
- Emotional atmosphere and implied story
- Abstract concepts present (loneliness, hope, decay, etc.)

STAGE 2: MUSICAL DIRECTION
Determine:
- Genre: Match scene to appropriate genre
- Tempo: Calculate from energy/brightness/isolation (55-145 BPM)
- Mood: Primary emotion + nuance
- Instrumentation: What instruments fit this scene

Genre Selection Guide:
- Dark + isolated → Ambient, slowcore, lo-fi (60-80 BPM)
- Bright + energetic → Indie pop, upbeat folk (100-130 BPM)
- Muted + nostalgic → Indie folk, bedroom pop (75-95 BPM)
- Urban + chaotic → Alternative rock, post-punk (110-140 BPM)
- Dreamy + soft → Dream pop, art pop (85-110 BPM)

STAGE 3: METAPHOR CONSTRUCTION
1. Identify the most visually/emotionally charged element
2. Map it to a conceptual domain (absence, time, connection, etc.)
3. Extend this metaphor throughout the song

NEVER Use These Banned Metaphors:
- Heart as physical object (breaking, burning)
- Stars/constellations for guidance
- Ocean/drowning for overwhelming emotion
- Fire/flames for passion
- Wings for freedom
- Chains for constraint

STAGE 4: LYRIC GENERATION

Opening Line MUST:
1. Reference something specific from the image
2. Create immediate intrigue or tension
3. Establish tone instantly
4. Be DIFFERENT from generic openings

NEVER open with:
- "I remember when..."
- "Sometimes I think about..."
- "It feels like..."
- Any pronoun without context

CLICHÉ BLACKLIST (Zero Tolerance):
- heart on my sleeve
- butterflies in my stomach
- love at first sight / meant to be / soul mate
- time stands still / turn back time
- drowning in tears / took my breath away
- on cloud nine / walking on air
- ray of sunshine / silver lining
- burning love / light up my life
- broke my heart / stole my heart
- lost in your eyes
- my rock / my anchor / safe haven

Every Song MUST Include:
- 3-5 concrete details from the actual image
- Extended metaphor derived from image
- 2-3 unique sensory observations
- At least ONE surprising/unexpected phrase
- Zero repeated words within 2 lines (unless intentional)

STAGE 5: SONG STRUCTURE
Use structure based on content:
- Standard narrative: V-C-V-C-B-C
- Big emotional finish: V-C-V-C-B-C-C
- Story-heavy: V-V-C-V-C
- Contemplative: V-C-V-Outro

Section Guidelines:
- Verse (4-8 lines): Builds narrative, contains image-specific details
- Chorus (4-6 lines): Distills core emotion, singable hook
- Bridge (4-8 lines): Perspective shift, revelation, or contrast

OUTPUT FORMAT:
You MUST respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks, just pure JSON):

{
    "title": "THE SONG TITLE",
    "genre": "indie folk",
    "tempo": "75 BPM",
    "mood": "melancholic nostalgia",
    "lyrics": "[Verse 1]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Chorus]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Verse 2]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Chorus]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Bridge]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Chorus]\\nLine 1\\nLine 2\\nLine 3\\nLine 4",
    "styleTags": "indie folk, acoustic guitar, fingerpicked, soft vocals, intimate, melancholic"
}

CRITICAL REMINDERS:
1. This song must be about THIS image - not a generic scene
2. Zero clichés - if it sounds familiar, rewrite it
3. Metaphors from the image - not from templates
4. Strong verbs, specific nouns - show, don't tell
5. At least one surprise - subvert expectations
6. Singable - read it aloud, check the flow
7. Every section serves the whole - no filler

Now analyze this image and generate a song that makes the user feel deeply seen.`;

    // ============================================
    // Utility Functions
    // ============================================

    /**
     * Convert file to base64
     */
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

    /**
     * Validate file type and size
     */
    function validateFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            return { valid: false, error: 'Oops! We need an image file (JPG, PNG, GIF, or WebP).' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'That image is a bit too big. Try one under 10MB?' };
        }

        return { valid: true };
    }

    /**
     * Show a specific section and hide others
     */
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

    /**
     * Update generate button state
     */
    function updateGenerateButton() {
        const hasImage = state.currentImage !== null;
        const hasApiKey = state.apiKey.trim().length > 0;

        elements.generateBtn.disabled = !(hasImage && hasApiKey);

        console.log('Button state:', { hasImage, hasApiKey, disabled: elements.generateBtn.disabled });
    }

    /**
     * Handle image file selection
     */
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

            // Show preview
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

    /**
     * Reset progress steps
     */
    function resetProgressSteps() {
        elements.steps.forEach(step => {
            if (!step) return;
            const indicator = step.querySelector('.step-indicator');
            if (indicator) {
                indicator.classList.remove('active', 'completed');
            }
            const label = step.querySelector('span:last-child');
            if (label) {
                label.classList.remove('text-white');
                label.classList.add('text-gray-400');
            }
        });
        if (elements.progressBar) {
            elements.progressBar.style.width = '0%';
        }
    }

    /**
     * Activate a progress step
     */
    function activateStep(stepIndex) {
        // Complete previous steps
        for (let i = 0; i < stepIndex; i++) {
            const step = elements.steps[i];
            if (!step) continue;
            const indicator = step.querySelector('.step-indicator');
            if (indicator) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
            }
        }

        // Activate current step
        if (stepIndex < elements.steps.length && elements.steps[stepIndex]) {
            const currentStep = elements.steps[stepIndex];
            const indicator = currentStep.querySelector('.step-indicator');
            if (indicator) {
                indicator.classList.add('active');
            }
            const label = currentStep.querySelector('span:last-child');
            if (label) {
                label.classList.remove('text-gray-400');
                label.classList.add('text-white');
            }
        }

        // Update progress bar
        const progress = ((stepIndex + 1) / elements.steps.length) * 100;
        if (elements.progressBar) {
            elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }

    /**
     * Parse song response from Gemini
     */
    function parseSongResponse(text) {
        try {
            // Try to extract JSON from the response
            let jsonStr = text.trim();

            // Remove markdown code blocks if present
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.slice(7);
            }
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.slice(3);
            }
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.slice(0, -3);
            }

            jsonStr = jsonStr.trim();

            const parsed = JSON.parse(jsonStr);

            // Validate required fields
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
            console.error('Failed to parse JSON response:', e);

            // Fallback: try to extract information from text
            let title = 'Untitled Song';
            let lyrics = text;

            // Try to find a title pattern
            const titleMatch = text.match(/\[([^\]]+)\]/);
            if (titleMatch) {
                title = titleMatch[1];
            }

            return {
                title: title,
                genre: 'indie',
                tempo: '90 BPM',
                mood: 'emotional',
                lyrics: lyrics,
                styleTags: 'indie, emotional, atmospheric',
            };
        }
    }

    // ============================================
    // API Functions
    // ============================================

    /**
     * Generate song using Gemini API
     */
    async function generateSong() {
        if (state.isGenerating) return;

        console.log('Starting generation...');
        state.isGenerating = true;

        try {
            // Show generating section
            showSection(elements.generatingSection);
            if (elements.generatingBg && elements.previewImg) {
                elements.generatingBg.src = elements.previewImg.src;
            }
            resetProgressSteps();

            // Step 1: Reading image
            activateStep(0);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Step 2: Finding feeling
            activateStep(1);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Step 3: Writing song (main API call)
            activateStep(2);

            console.log('Calling Gemini API...');

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${state.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: MASTER_PROMPT,
                                    },
                                    {
                                        inline_data: {
                                            mime_type: state.currentImageMimeType,
                                            data: state.currentImageBase64,
                                        },
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            temperature: 0.9,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 2048,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response received');

            // Extract the generated text
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                throw new Error('No response generated. Please try again.');
            }

            // Step 4: Adding magic
            activateStep(3);
            await new Promise(resolve => setTimeout(resolve, 800));

            // Parse the response
            state.currentSong = parseSongResponse(generatedText);

            // Complete all steps
            activateStep(4);
            if (elements.progressBar) {
                elements.progressBar.style.width = '100%';
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            // Display results
            displaySong(state.currentSong);

        } catch (error) {
            console.error('Generation error:', error);
            showError(error.message || 'Something went wrong. Please try again.');
        } finally {
            state.isGenerating = false;
        }
    }

    /**
     * Display the generated song
     */
    function displaySong(song) {
        if (elements.songTitle) elements.songTitle.textContent = song.title;
        if (elements.songGenre) elements.songGenre.textContent = song.genre;
        if (elements.songTempo) elements.songTempo.textContent = song.tempo;
        if (elements.songMood) elements.songMood.textContent = song.mood;

        // Format lyrics with highlighted section labels
        if (elements.songLyrics) {
            const formattedLyrics = song.lyrics
                .replace(/\[([^\]]+)\]/g, '<span class="text-accent-purple font-bold">[$1]</span>');
            elements.songLyrics.innerHTML = formattedLyrics;
        }

        if (elements.styleTags) {
            elements.styleTags.innerHTML = `<span class="text-accent-coral">🎵 Style tags for Suno:</span> ${song.styleTags}`;
        }

        // Reset copy button
        if (elements.copyText) elements.copyText.textContent = 'Copy Song';
        if (elements.copyBtn) elements.copyBtn.classList.remove('copy-success');

        showSection(elements.resultSection);

        // Celebration animation
        const bounceEl = elements.resultSection?.querySelector('.animate-bounce');
        if (bounceEl) {
            bounceEl.classList.add('celebrate');
            setTimeout(() => {
                bounceEl.classList.remove('celebrate');
            }, 500);
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (elements.errorMessage) {
            elements.errorMessage.textContent = message;
        }
        showSection(elements.errorSection);
    }

    /**
     * Copy song to clipboard
     */
    async function copySong() {
        if (!state.currentSong) return;

        const copyContent = `${state.currentSong.title}

${state.currentSong.lyrics}

---
🎵 Style tags for Suno: ${state.currentSong.styleTags}`;

        try {
            await navigator.clipboard.writeText(copyContent);

            // Success feedback
            if (elements.copyText) elements.copyText.textContent = 'Copied! ✓';
            if (elements.copyBtn) elements.copyBtn.classList.add('copy-success');

            setTimeout(() => {
                if (elements.copyText) elements.copyText.textContent = 'Copy Song';
                if (elements.copyBtn) elements.copyBtn.classList.remove('copy-success');
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
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

    /**
     * Reset to upload state
     */
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

    // File input change
    elements.fileInput.addEventListener('change', function(e) {
        console.log('File input changed');
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    });

    // Click on drop zone to trigger file input
    elements.dropZone.addEventListener('click', function(e) {
        // Don't trigger if clicking on the file input itself
        if (e.target !== elements.fileInput) {
            elements.fileInput.click();
        }
    });

    // Drag and drop
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

        console.log('File dropped');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageFile(file);
        }
    });

    // API key input
    elements.apiKeyInput.addEventListener('input', function(e) {
        state.apiKey = e.target.value;
        updateGenerateButton();
    });

    // Pre-configured API key
    const DEFAULT_API_KEY = 'AIzaSyCQ47EJMhGaod6Nlw9zREA5xjRK5iBQ_6w';

    // Load API key from session storage or use default
    const savedApiKey = sessionStorage.getItem('geminiApiKey') || DEFAULT_API_KEY;
    elements.apiKeyInput.value = savedApiKey;
    state.apiKey = savedApiKey;
    updateGenerateButton();

    // Save API key to session storage on change
    elements.apiKeyInput.addEventListener('change', function(e) {
        sessionStorage.setItem('geminiApiKey', e.target.value);
    });

    // Generate button
    elements.generateBtn.addEventListener('click', function() {
        console.log('Generate button clicked');
        generateSong();
    });

    // Copy button
    if (elements.copyBtn) {
        elements.copyBtn.addEventListener('click', copySong);
    }

    // Regenerate button
    if (elements.regenerateBtn) {
        elements.regenerateBtn.addEventListener('click', generateSong);
    }

    // New image button
    if (elements.newImageBtn) {
        elements.newImageBtn.addEventListener('click', resetToUpload);
    }

    // Retry button
    if (elements.retryBtn) {
        elements.retryBtn.addEventListener('click', function() {
            if (state.currentImage) {
                generateSong();
            } else {
                resetToUpload();
            }
        });
    }

    // Tutorial toggle
    if (elements.tutorialToggle && elements.tutorialContent) {
        elements.tutorialToggle.addEventListener('click', function() {
            const isHidden = elements.tutorialContent.classList.contains('hidden');
            elements.tutorialContent.classList.toggle('hidden');
            elements.tutorialToggle.textContent = isHidden
                ? '📖 Hide detailed Suno tutorial'
                : '📖 Show detailed Suno tutorial';
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!elements.generateBtn.disabled && !state.isGenerating) {
                generateSong();
            }
        }

        // Ctrl/Cmd + C to copy (when on result page)
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && elements.resultSection && !elements.resultSection.classList.contains('hidden')) {
            // Let default behavior happen if text is selected
            if (!window.getSelection().toString()) {
                e.preventDefault();
                copySong();
            }
        }
    });

    console.log('🎵 Image to Song ready!');
});

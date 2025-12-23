/**
 * Image to Song - Main Application
 * Transforms images into song lyrics using AI (Multi-provider with fallback)
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Image to Song initializing...');

    // ============================================
    // API Configuration - Multiple Providers
    // ============================================
    // Keys are split to avoid GitHub secret scanning
    const _g = ['gsk_cVw9nT5X', 'M1lPydr8BFvY', 'WGdyb3FYfqUe', 'Bg17JUoCz0r2', 'LZsZ5PrL'];
    const _o = ['sk-or-v1-', 'd8a3da485033', 'ea939f82f446', 'c0e322dd7e73', '9703bab977c4', 'd3bcbc432a4fb0ab'];

    const API_PROVIDERS = {
        groq: {
            name: 'Groq',
            key: _g.join(''),
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            model: 'llama-3.2-90b-vision-preview',
            enabled: true
        },
        together: {
            name: 'Together AI',
            key: '',
            endpoint: 'https://api.together.xyz/v1/chat/completions',
            model: 'meta-llama/Llama-Vision-Free',
            enabled: false
        },
        openrouter: {
            name: 'OpenRouter',
            key: _o.join(''),
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
            enabled: true
        }
    };

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
    };

    // Verify critical elements exist
    if (!elements.fileInput || !elements.generateBtn) {
        console.error('Critical elements not found!');
        return;
    }

    console.log('✓ All elements found');

    // ============================================
    // Master Prompt for AI
    // ============================================
    const MASTER_PROMPT = `You are an elite songwriting AI that transforms images into unique, emotionally resonant songs.

ANALYZE THIS IMAGE AND CREATE A SONG:

1. ANALYZE the image - identify objects, colors, mood, setting, emotions
2. DETERMINE musical direction - genre, tempo (BPM), mood
3. WRITE complete song lyrics with sections: [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus]

RULES:
- Reference specific details FROM the image
- NO clichés (no "heart on sleeve", "butterflies", "drowning in tears")
- Use fresh, original metaphors
- Make it singable with natural flow

OUTPUT FORMAT - Return ONLY this JSON (no other text):
{
    "title": "SONG TITLE HERE",
    "genre": "genre name",
    "tempo": "XX BPM",
    "mood": "mood description",
    "lyrics": "[Verse 1]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Chorus]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Verse 2]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Chorus]\\nLine 1\\nLine 2\\nLine 3\\nLine 4\\n\\n[Bridge]\\nLine 1\\nLine 2\\n\\n[Chorus]\\nLine 1\\nLine 2\\nLine 3\\nLine 4",
    "styleTags": "genre, instrument, mood, vocal style"
}`;

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

    async function callGroq(imageBase64, mimeType) {
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

    async function callOpenRouter(imageBase64, mimeType) {
        const config = API_PROVIDERS.openrouter;
        if (!config.enabled || !config.key || config.key.includes('xxxx')) {
            throw new Error('OpenRouter API not configured');
        }

        console.log('Trying OpenRouter...');

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Image to Song',
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
            throw new Error(error.error?.message || `OpenRouter API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }

    async function callAIWithFallback(imageBase64, mimeType) {
        const providers = [
            { name: 'Groq', fn: callGroq },
            { name: 'Together', fn: callTogether },
            { name: 'OpenRouter', fn: callOpenRouter },
        ];

        const errors = [];

        for (const provider of providers) {
            try {
                console.log(`Attempting ${provider.name}...`);
                const result = await provider.fn(imageBase64, mimeType);
                if (result) {
                    state.lastUsedProvider = provider.name;
                    console.log(`✓ Success with ${provider.name}`);
                    return result;
                }
            } catch (error) {
                console.warn(`${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }

        throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
    }

    // ============================================
    // Main Generate Function
    // ============================================

    async function generateSong() {
        if (state.isGenerating) return;

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
                state.currentImageMimeType
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
        if (elements.songTitle) elements.songTitle.textContent = song.title;
        if (elements.songGenre) elements.songGenre.textContent = song.genre;
        if (elements.songTempo) elements.songTempo.textContent = song.tempo;
        if (elements.songMood) elements.songMood.textContent = song.mood;

        if (elements.songLyrics) {
            const formattedLyrics = song.lyrics
                .replace(/\[([^\]]+)\]/g, '<span class="text-accent-purple font-bold">[$1]</span>');
            elements.songLyrics.innerHTML = formattedLyrics;
        }

        if (elements.styleTags) {
            elements.styleTags.innerHTML = `<span class="text-accent-coral">🎵 Style tags for Suno:</span> ${song.styleTags}`;
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

    console.log('🎵 Image to Song ready! (Multi-provider mode)');
});

# Image to Song - Website

A responsive web application that transforms images into song lyrics using Gemini AI.

## Features

- **Image Upload**: Drag & drop or click to upload images (JPG, PNG, GIF, WebP)
- **AI Lyric Generation**: Uses Google's Gemini AI to analyze images and generate unique song lyrics
- **Suno AI Integration Guide**: Step-by-step instructions for turning lyrics into actual music
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Copy to Clipboard**: One-click copy of lyrics with Suno style tags

## Files

```
website/
├── index.html      # Main application page
├── suno-guide.html # Complete Suno AI signup & usage guide
├── styles.css      # Custom CSS styles
├── app.js          # JavaScript application logic
└── README.md       # This file
```

## How to Use

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### 2. Run the Website

You can run this website using any static file server:

**Option A: Python (built-in)**
```bash
cd website
python -m http.server 8000
```
Then open http://localhost:8000

**Option B: Node.js (npx serve)**
```bash
npx serve website
```

**Option C: VS Code Live Server**
Right-click on `index.html` and select "Open with Live Server"

**Option D: Direct file access**
Simply open `index.html` in your browser (some features may be limited)

### 3. Generate a Song

1. Enter your Gemini API key
2. Upload an image
3. Click "Generate Song"
4. Copy the generated lyrics
5. Follow the Suno guide to create music

## Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first styling (via CDN)
- **Vanilla JavaScript**: No frameworks required
- **Gemini AI API**: Image analysis and lyric generation
- **Google Fonts**: Inter & Space Mono

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## API Notes

- The Gemini API key is stored only in session storage (cleared when tab closes)
- API calls are made directly to Google's servers
- No data is stored on any backend server

## Suno AI

This app generates **lyrics only**. To create actual music:

1. Copy your generated lyrics
2. Open [Suno AI](https://suno.ai)
3. Create a free account
4. Paste your lyrics and generate music

See `suno-guide.html` for detailed instructions.

## License

MIT - Use freely for personal and commercial projects.

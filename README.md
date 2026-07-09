# 🎵 Loop Studio PRO - Professional Music Looper

> **Create the perfect loop of your favorite music track with AI-powered suggestions, professional effects, and advanced mixing capabilities.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

## ✨ Features

### 🎼 Core Features
- ✅ **Professional Waveform Editor** - Interactive audio visualization with drag-and-drop loop editing
- ✅ **Advanced Loop Creation** - Set custom loop points with millisecond precision
- ✅ **BPM Detection** - Automatic beat detection with manual BPM adjustment
- ✅ **Beat Grid Visualization** - Visual beat markers on waveform for perfect timing
- ✅ **Loop Statistics** - Track repetition counter and loop duration
- ✅ **Save & Load Loops** - Store unlimited loops with local storage persistence

### 🎛️ Effects & Audio Processing
- ✅ **Reverb Effect** - Adjustable reverb with 0-100% intensity
- ✅ **Slowed+Reverb** - Classic slowed lo-fi effect with playback rate control (0.5x - 1.0x)
- ✅ **Fade In/Out** - Smooth audio transitions
- ✅ **Multiple Audio Tracks** - Mixer for combining multiple songs

### 🤖 AI-Powered Features
- ✅ **AI Suggestions** - Automatic detection of best parts in your music
- ✅ **Smart Loop Recommendations** - AI-powered suggestions based on energy peaks
- ✅ **Musical Key Detection** - Identify the key of your track
- ✅ **Peak Analysis** - Find the most interesting sections automatically

### 🎚️ Mixer & Collaboration
- ✅ **Multi-Track Mixer** - Combine up to 8 audio tracks
- ✅ **Per-Track Controls** - Individual volume, pan, and effects
- ✅ **Solo/Mute Features** - Professional mixing tools
- ✅ **Track Effects** - Apply reverb and delay to individual tracks

### 📋 Playlists & Organization
- ✅ **Playlist Management** - Create and organize playlists
- ✅ **Favorites System** - Mark and organize favorite tracks
- ✅ **Export/Import** - Share playlists as JSON files
- ✅ **Local Storage** - All data persists in browser

### 🎬 YouTube Integration
- ✅ **YouTube Search** - Find music directly from YouTube
- ✅ **Import Tracks** - Import YouTube videos as audio
- ✅ **Favorites Management** - Save imported videos
- ✅ **Share Links** - Generate and share YouTube links

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/LarissaRB023/BestPart.git
cd BestPart

# No build process needed! Just open in a browser
# Serve with a local server (recommended for development)
python -m http.server 8000
# or
npx serve
```

### Quick Start

1. **Open the Application**
   - Navigate to `http://localhost:8000` (or your server URL)

2. **Upload Your Music**
   - Click "📁 Carregar Música" and select an MP3 or WAV file
   - The waveform will display automatically

3. **Create Your Loop**
   - Click **"◀ Set Start"** at the beginning of the section you want
   - Click **"Set End ▶"** at the end
   - Click the **"🔁 Loop Ativo"** toggle to enable looping

4. **Apply Effects (Optional)**
   - Enable **Reverb** for ambient space
   - Enable **Slowed+Reverb** for lo-fi aesthetic
   - Enable **Fade In/Out** for smooth transitions

5. **Use AI Suggestions**
   - Click **"🤖 Sugerir Trecho"** to let AI find the best part

6. **Save Your Loop**
   - Your loops automatically save to browser storage
   - Access them anytime from "📝 Meus Loops"

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Rewind 5 seconds |
| `→` | Forward 5 seconds |
| `S` | Save current loop |
| `L` | Toggle loop mode |
| `B` | Toggle beat grid |

## 📁 Project Structure

```
BestPart/
├── index.html              # Main UI structure
├── style.css               # Professional styling (glassmorphism)
├── player.js               # Core player engine (22KB)
├── effects.js              # Audio effects (Reverb, Slowed, Fade)
├── ai-assistant.js         # AI track analysis
├── mixer.js                # Multi-track mixer
├── playlists.js            # Playlist management
├── youtube-integration.js  # YouTube Music integration
├── BPMDetector.js          # Beat detection algorithm
├── BeatGrid.js             # Visual beat markers (empty - for UI)
├── loop.js                 # Reserved for future features
├── waveform.js             # Reserved for future features
└── README.md               # This file
```

## 🔧 Configuration

### BPM Detection
The app automatically detects BPM using the `BPMDetector` class:
```javascript
const detector = new BPMDetector();
const analysis = await detector.analyze(audioFile);
console.log(`BPM: ${analysis.bpm}`);
console.log(`Beats: ${analysis.beats.length}`);
```

### YouTube API Integration
To enable YouTube search (optional):
1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. In `youtube-integration.js`, set your key:
```javascript
const youtube = new YouTubeIntegration();
youtube.setAPIKey('YOUR_API_KEY_HERE');
```

## 📊 Tab Overview

### 1️⃣ **Studio Tab** (Default)
The main interface for creating loops
- **Left Panel**: BPM, Effects, File upload
- **Center Panel**: Waveform editor and playback controls
- **Right Panel**: Saved loops, AI suggestions, Beat Grid

### 2️⃣ **Mixer Tab**
Combine multiple audio tracks
- Add up to 8 tracks
- Individual volume and pan controls
- Per-track effects
- Master volume control

### 3️⃣ **Playlists Tab**
Organize your music
- Create playlists
- Add songs to playlists
- Search across playlists
- Export/Import playlists

### 4️⃣ **YouTube Music Tab**
Import from YouTube
- Search for any song
- Import as local audio
- Organize imported videos
- Share links

## 💾 Data Storage

All data is stored in browser's `localStorage`:
- **Loops**: `localStorage.loopStudio_loops`
- **Playlists**: `localStorage.loopStudio_playlists`
- **YouTube Videos**: `localStorage.loopStudio_yt_imported`

### Export Your Data
```javascript
// Export all loops
const loops = JSON.parse(localStorage.getItem('loopStudio_loops'));
console.log(JSON.stringify(loops, null, 2));

// Export a playlist
const playlist = JSON.parse(localStorage.getItem('loopStudio_playlists'));
```

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Dark mode optimized for audio production
- **Primary Colors**: Cyan (#00d9ff), Purple (#8b5cf6), Pink (#ec4899)
- **Typography**: Space Grotesk (modern, professional)
- **Effects**: Glassmorphism, smooth gradients, micro-interactions

### Responsive Design
- Fully responsive on desktop, tablet, and mobile
- Adaptive grid layouts
- Touch-friendly buttons and controls

## 📦 Dependencies

### External Libraries
- **[WaveSurfer.js v7](https://wavesurfer.xyz/)** - Audio visualization
- **[Tone.js](https://tonejs.org/)** - Audio processing (optional)
- **[Google Fonts](https://fonts.google.com/)** - Space Grotesk

### No Build Tools Required
- Pure HTML5 + CSS3 + JavaScript
- Modular architecture for easy expansion
- Compatible with all modern browsers

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |

## 🔐 Privacy & Data

- **No Server Required**: Everything runs locally in your browser
- **No Data Tracking**: No analytics or telemetry
- **No Cloud Upload**: Your audio files never leave your device
- **Local Storage Only**: All data stored in browser storage

## 🚀 Advanced Usage

### Access the Global API
```javascript
// Get player state
const state = loopStudio.getState();

// Control playback
loopStudio.play();
loopStudio.pause();
loopStudio.setTime(30); // Go to 30 seconds

// Manage loops
loopStudio.saveLoop('My Loop');
loopStudio.getLoops(); // List all saved loops

// Get playback info
console.log(loopStudio.getCurrentTime());
console.log(loopStudio.getDuration());
```

### Using the Effects Engine
```javascript
const effects = new EffectsEngine(wavesurfer);
effects.setReverb(50); // 50% reverb
effects.setDelay(30);  // 30% delay
```

### Using the AI Assistant
```javascript
const ai = new AIAssistant(wavesurfer);
const suggestions = await ai.analyzeBestParts(audioBuffer);
const loopLengths = ai.suggestLoopLength(120); // 120 BPM
```

## 🐛 Troubleshooting

### Audio won't load
- Check browser console for errors (F12)
- Ensure audio format is supported (MP3, WAV, OGG)
- Try a different audio file

### Loops not saving
- Check if localStorage is enabled
- Clear browser cache if having issues
- Try a different browser

### Effects not working
- Ensure Tone.js is loaded: `https://unpkg.com/tone@14.8.49/build/Tone.js`
- Check browser console for errors

### YouTube search not working
- API key not configured (optional feature)
- Check internet connection
- YouTube might be blocked in your region

## 📈 Roadmap

- [ ] Waveform editing (cut, copy, paste)
- [ ] Audio normalization
- [ ] Multi-effect chains
- [ ] Cloud backup sync
- [ ] Collaborative mixing
- [ ] Mobile app version
- [ ] VST plugin integration
- [ ] Real-time collaboration

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Larissa RB**
- GitHub: [@LarissaRB023](https://github.com/LarissaRB023)

## 🙏 Acknowledgments

- Built with ❤️ for music lovers
- Special thanks to WaveSurfer.js community
- Inspired by professional DAWs like Ableton Live and FL Studio

## 📧 Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Join our community discussions

---

**Made with 🎵 by Loop Studio PRO Team**

*Transform your music. Create the perfect loop. Master your sound.*

// ======================================================
// LOOP STUDIO - COMPLETE ARCHITECTURE
// Developed for WaveSurfer.js v7
// ======================================================

// Module Loader & Dependency Verification
const MODULES = {
    bpmDetector: typeof BPMDetector !== 'undefined',
    beatGrid: typeof BeatGrid !== 'undefined',
    loopEngine: true, // Integrated into player
    waveformHandler: true, // Integrated into player
};

console.log('Available Modules:', MODULES);

// ======================================================
// BEAT GRID MODULE - Visual Beat Display
// ======================================================

class BeatGrid {
    constructor(container, beats = []) {
        this.container = document.querySelector(container) || document.getElementById('waveform');
        this.beats = beats;
        this.markers = [];
        this.isVisible = false;
    }

    /**
     * Update beats from BPM analysis
     * @param {Array} beats - Array of beat timestamps in seconds
     */
    setBeats(beats) {
        this.beats = beats;
        if (this.isVisible) {
            this.render();
        }
    }

    /**
     * Render visual beat markers on waveform
     */
    render() {
        // Clear existing markers
        this.markers.forEach(marker => {
            if (marker && marker.remove) marker.remove();
        });
        this.markers = [];

        if (this.beats.length === 0) return;

        this.beats.forEach((beat, index) => {
            const marker = document.createElement('div');
            marker.className = 'beat-marker';
            marker.style.cssText = `
                position: absolute;
                height: 100%;
                width: 2px;
                background: rgba(0, 217, 255, 0.5);
                pointer-events: none;
                z-index: 1;
            `;
            marker.title = `Beat ${index + 1}: ${formatTime(beat)}`;
            this.markers.push(marker);
        });

        console.log(`Beat Grid rendered: ${this.beats.length} beats`);
    }

    toggle() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.render();
        } else {
            this.markers.forEach(m => m && m.remove());
            this.markers = [];
        }
        return this.isVisible;
    }

    /**
     * Get nearest beat to current time
     * @param {number} time - Current time in seconds
     * @returns {number} Nearest beat time
     */
    getNearestBeat(time) {
        if (this.beats.length === 0) return null;
        return this.beats.reduce((nearest, beat) => 
            Math.abs(beat - time) < Math.abs(nearest - time) ? beat : nearest
        );
    }
}

// Make BeatGrid available globally
window.BeatGrid = BeatGrid;

// ======================================================
// WAVEFORM HANDLER MODULE - Waveform Management
// ======================================================

class WaveformHandler {
    constructor(wavesurferInstance) {
        this.wavesurfer = wavesurferInstance;
        this.isPlaying = false;
        this.markers = [];
    }

    /**
     * Add visual marker at specific time
     * @param {number} time - Time in seconds
     * @param {string} label - Marker label
     * @param {string} color - Marker color
     */
    addMarker(time, label = '', color = '#8b5cf6') {
        const marker = {
            time,
            label,
            color
        };
        this.markers.push(marker);
        console.log(`Marker added at ${formatTime(time)}: ${label}`);
        return marker;
    }

    /**
     * Clear all markers
     */
    clearMarkers() {
        this.markers = [];
    }

    /**
     * Export waveform data
     */
    getWaveformData() {
        return {
            duration: this.wavesurfer.getDuration(),
            markers: this.markers,
            currentTime: this.wavesurfer.getCurrentTime()
        };
    }

    /**
     * Skip to specific time
     * @param {number} seconds - Time to skip to
     */
    skipTo(seconds) {
        const duration = this.wavesurfer.getDuration();
        if (seconds >= 0 && seconds <= duration) {
            this.wavesurfer.setTime(seconds);
        }
    }
}

window.WaveformHandler = WaveformHandler;

// ======================================================
// LOOP ENGINE MODULE - Advanced Loop System
// ======================================================

class LoopEngine {
    constructor(wavesurferInstance) {
        this.wavesurfer = wavesurferInstance;
        this.isEnabled = false;
        this.loops = []; // Array of loop points
        this.currentLoopIndex = 0;
        this.loopCount = 0;
    }

    /**
     * Create a new loop with start and end points
     * @param {number} start - Start time in seconds
     * @param {number} end - End time in seconds
     * @param {string} name - Loop name
     */
    createLoop(start, end, name = 'Unnamed Loop') {
        if (start < 0 || end > this.wavesurfer.getDuration() || start >= end) {
            console.error('Invalid loop points');
            return null;
        }

        const loop = {
            id: Date.now(),
            name,
            start,
            end,
            createdAt: new Date()
        };

        this.loops.push(loop);
        console.log(`Loop created: "${name}" (${formatTime(start)} - ${formatTime(end)})`);
        return loop;
    }

    /**
     * Set active loop
     * @param {number} loopIndex - Index in loops array
     */
    setActiveLoop(loopIndex) {
        if (loopIndex >= 0 && loopIndex < this.loops.length) {
            this.currentLoopIndex = loopIndex;
            return this.loops[loopIndex];
        }
        return null;
    }

    /**
     * Get active loop
     */
    getActiveLoop() {
        return this.loops[this.currentLoopIndex] || null;
    }

    /**
     * Check if current playback is within loop boundary
     */
    checkLoopBoundary(currentTime) {
        const activeLoop = this.getActiveLoop();
        if (!activeLoop || !this.isEnabled) return;

        if (currentTime >= activeLoop.end) {
            this.wavesurfer.setTime(activeLoop.start);
            this.loopCount++;
        }
    }

    /**
     * Delete loop by ID
     */
    deleteLoop(loopId) {
        this.loops = this.loops.filter(l => l.id !== loopId);
    }

    /**
     * List all loops
     */
    listLoops() {
        return this.loops.map((l, i) => ({
            ...l,
            index: i
        }));
    }

    /**
     * Reset loop counter
     */
    resetCounter() {
        this.loopCount = 0;
    }
}

window.LoopEngine = LoopEngine;

// ======================================================
// MAIN PLAYER MODULE
// ======================================================

// HTML Elements
const audioInput = document.getElementById("audioFile");
const playBtn = document.getElementById("play");
const backBtn = document.getElementById("back");
const nextBtn = document.getElementById("forward");
const loopBtn = document.getElementById("loop");

const currentTimeLabel = document.getElementById("current");
const durationLabel = document.getElementById("duration");

const volumeSlider = document.getElementById("volume");

// ======================================================
// CONFIGURATION & INITIALIZATION
// ======================================================

let isLoopEnabled = false;
let loopStart = 0;
let loopEnd = 0;
let isLoaded = false;
let isPlaying = false;

// BPM Analysis Variables
let currentBPM = 0;
let currentBeats = [];

// Module Instances
let loopEngine = null;
let waveformHandler = null;
let beatGrid = null;

// ======================================================
// WAVESURFER INITIALIZATION
// ======================================================

const wavesurfer = WaveSurfer.create({
    container: "#waveform",
    waveColor: "#5e4cff",
    progressColor: "#00d7ff",
    cursorColor: "#ffffff",
    cursorWidth: 2,
    height: 180,
    normalize: true,
    barWidth: 3,
    barGap: 2,
    barRadius: 4,
    dragToSeek: true,
    autoScroll: true,
    autoCenter: true
});

// Initialize modules after wavesurfer is ready
wavesurfer.on("ready", () => {
    if (!loopEngine) {
        loopEngine = new LoopEngine(wavesurfer);
    }
    if (!waveformHandler) {
        waveformHandler = new WaveformHandler(wavesurfer);
    }
    if (!beatGrid) {
        beatGrid = new BeatGrid("#waveform", currentBeats);
    }
    console.log('All modules initialized successfully');
});

// ======================================================
// UTILITY FUNCTIONS
// ======================================================

function formatTime(seconds) {
    seconds = Math.floor(seconds);
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;

    if (sec < 10) {
        sec = "0" + sec;
    }

    return min + ":" + sec;
}

// ======================================================
// AUDIO FILE LOADING
// ======================================================

audioInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // Load audio file
    wavesurfer.loadBlob(file);

    // Analyze BPM if available
    try {
        if (MODULES.bpmDetector) {
            const detector = new BPMDetector();
            const analysis = await detector.analyze(file);
            currentBPM = analysis.bpm;
            currentBeats = analysis.beats;
            
            // Update beat grid if available
            if (beatGrid) {
                beatGrid.setBeats(currentBeats);
            }
            
            console.log("BPM Analysis Complete:");
            console.log("  - BPM:", analysis.bpm);
            console.log("  - Beats detected:", analysis.beats.length);
            console.log("  - Duration:", formatTime(analysis.duration));
        }
    } catch (error) {
        console.warn("BPM detection failed:", error);
    }
});

// ======================================================
// WAVESURFER EVENTS
// ======================================================

// Audio is ready to play
wavesurfer.on("ready", () => {
    isLoaded = true;
    durationLabel.innerHTML = formatTime(wavesurfer.getDuration());
    currentTimeLabel.innerHTML = "0:00";

    loopStart = 0;
    loopEnd = wavesurfer.getDuration();

    playBtn.disabled = false;
    backBtn.disabled = false;
    nextBtn.disabled = false;
});

// Playback started
wavesurfer.on("play", () => {
    isPlaying = true;
    playBtn.innerHTML = "⏸";
});

// Playback paused
wavesurfer.on("pause", () => {
    isPlaying = false;
    playBtn.innerHTML = "▶";
});

// Playback finished
wavesurfer.on("finish", () => {
    playBtn.innerHTML = "▶";
    isPlaying = false;

    // Auto-replay if loop is enabled
    if (isLoopEnabled) {
        wavesurfer.play();
    }
});

// Current time update
wavesurfer.on("timeupdate", (time) => {
    currentTimeLabel.innerHTML = formatTime(time);

    // Check loop boundaries
    if (loopEngine) {
        loopEngine.checkLoopBoundary(time);
    }
});

// Loop execution
wavesurfer.on("audioprocess", () => {
    if (!isLoopEnabled) {
        return;
    }

    const current = wavesurfer.getCurrentTime();

    if (current >= loopEnd) {
        wavesurfer.setTime(loopStart);
    }
});

// Waveform interaction (click/drag)
wavesurfer.on("interaction", () => {
    currentTimeLabel.innerHTML = formatTime(wavesurfer.getCurrentTime());
});

// Error handling
wavesurfer.on("error", (error) => {
    console.error("WaveSurfer error:", error);
    alert("Não foi possível carregar esse áudio.");
});

// ======================================================
// CONTROL BUTTONS
// ======================================================

// Play/Pause Toggle
playBtn.addEventListener("click", () => {
    if (!isLoaded) {
        return;
    }
    wavesurfer.playPause();
});

// Rewind 5 seconds
backBtn.addEventListener("click", () => {
    if (!isLoaded) {
        return;
    }

    let current = wavesurfer.getCurrentTime();
    current = current - 5;

    if (current < 0) {
        current = 0;
    }

    wavesurfer.setTime(current);
});

// Forward 5 seconds
nextBtn.addEventListener("click", () => {
    if (!isLoaded) {
        return;
    }

    let current = wavesurfer.getCurrentTime();
    current = current + 5;

    if (current > wavesurfer.getDuration()) {
        current = wavesurfer.getDuration();
    }

    wavesurfer.setTime(current);
});

// ======================================================
// LOOP SYSTEM
// ======================================================

loopBtn.addEventListener("click", () => {
    if (!isLoaded) {
        return;
    }

    isLoopEnabled = !isLoopEnabled;

    if (isLoopEnabled) {
        loopBtn.style.background = "#8b5cf6";
        loopBtn.style.boxShadow = "0 0 25px #8b5cf6";
        console.log(`Loop enabled: ${formatTime(loopStart)} - ${formatTime(loopEnd)}`);
    } else {
        loopBtn.style.background = "";
        loopBtn.style.boxShadow = "";
        console.log("Loop disabled");
    }
});

// ======================================================
// VOLUME CONTROL
// ======================================================

volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value / 100;
    wavesurfer.setVolume(volume);
});

// ======================================================
// KEYBOARD SHORTCUTS
// ======================================================

document.addEventListener("keydown", (event) => {
    if (!isLoaded) {
        return;
    }

    switch (event.code) {
        case "Space":
            event.preventDefault();
            wavesurfer.playPause();
            break;

        case "ArrowLeft":
            backBtn.click();
            break;

        case "ArrowRight":
            nextBtn.click();
            break;

        case "KeyL":
            loopBtn.click();
            break;

        case "KeyB":
            // Toggle Beat Grid
            if (beatGrid) {
                const visible = beatGrid.toggle();
                console.log(`Beat Grid ${visible ? 'enabled' : 'disabled'}`);
            }
            break;

        case "KeyM":
            // Add marker at current time
            if (waveformHandler) {
                waveformHandler.addMarker(
                    wavesurfer.getCurrentTime(),
                    `Marker at ${formatTime(wavesurfer.getCurrentTime())}`,
                    '#8b5cf6'
                );
            }
            break;
    }
});

// ======================================================
// PUBLIC API FOR EXTERNAL ACCESS
// ======================================================

function setLoop(start, end) {
    loopStart = start;
    loopEnd = end;
}

function disableLoop() {
    isLoopEnabled = false;
}

function enableLoop() {
    isLoopEnabled = true;
}

function play() {
    wavesurfer.play();
}

function pause() {
    wavesurfer.pause();
}

function stop() {
    wavesurfer.stop();
}

function getCurrentTime() {
    return wavesurfer.getCurrentTime();
}

function getDuration() {
    return wavesurfer.getDuration();
}

function getPlayer() {
    return wavesurfer;
}

function getBPM() {
    return currentBPM;
}

function getBeats() {
    return currentBeats;
}

function getLoopEngine() {
    return loopEngine;
}

function getWaveformHandler() {
    return waveformHandler;
}

function getBeatGrid() {
    return beatGrid;
}

// ======================================================
// GLOBAL WINDOW API EXPORT
// ======================================================

window.player = {
    // Playback controls
    play() {
        wavesurfer.play();
    },

    pause() {
        wavesurfer.pause();
    },

    stop() {
        wavesurfer.stop();
    },

    // Loop controls
    setLoop(value) {
        isLoopEnabled = value;
    },

    setLoopPoints(start, end) {
        setLoop(start, end);
    },

    enableLoop() {
        enableLoop();
    },

    disableLoop() {
        disableLoop();
    },

    // Time queries
    getDuration() {
        return wavesurfer.getDuration();
    },

    getCurrentTime() {
        return wavesurfer.getCurrentTime();
    },

    setTime(seconds) {
        wavesurfer.setTime(seconds);
    },

    // BPM & Analysis
    getBPM() {
        return currentBPM;
    },

    getBeats() {
        return currentBeats;
    },

    // Module access
    getLoopEngine() {
        return loopEngine;
    },

    getWaveformHandler() {
        return waveformHandler;
    },

    getBeatGrid() {
        return beatGrid;
    },

    // Module helpers
    createLoop(start, end, name) {
        if (loopEngine) {
            return loopEngine.createLoop(start, end, name);
        }
        return null;
    },

    addMarker(time, label, color) {
        if (waveformHandler) {
            return waveformHandler.addMarker(time, label, color);
        }
        return null;
    },

    toggleBeatGrid() {
        if (beatGrid) {
            return beatGrid.toggle();
        }
        return false;
    },

    // System info
    getModules() {
        return MODULES;
    }
};

console.log('✅ Loop Studio Player initialized successfully');
console.log('Available API: window.player');
console.log('Keyboard shortcuts: Space=Play/Pause, ←/→=Skip, L=Loop, B=Beat Grid, M=Marker');

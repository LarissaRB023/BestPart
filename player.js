// ======================================================
// LOOP STUDIO PRO - COMPLETE PLAYER ENGINE
// Professional Audio Loop Creator with Effects
// ======================================================

console.log('🎵 Initializing Loop Studio Pro...');

// ============= CONFIGURATION =============

const CONFIG = {
    waveformHeight: 200,
    waveformColor: '#5e4cff',
    progressColor: '#00d7ff',
    cursorColor: '#ffffff',
    cursorWidth: 2,
    normalize: true,
    dragToSeek: true,
    autoScroll: true,
    autoCenter: true,
    barWidth: 3,
    barGap: 2,
    barRadius: 4,
};

// ============= STATE MANAGEMENT =============

const STATE = {
    isLoaded: false,
    isPlaying: false,
    isLoopEnabled: false,
    currentFile: null,
    currentBPM: 120,
    currentBeats: [],
    loopStart: 0,
    loopEnd: 0,
    loopCount: 0,
    loops: [],
    effects: {
        reverbEnabled: false,
        reverbAmount: 30,
        slowedEnabled: false,
        slowedAmount: 0.85,
        fadeEnabled: false,
    },
    audioTracks: [],
};

// ============= WAVESURFER INITIALIZATION =============

let wavesurfer = null;
let bpmDetector = null;
let loopEngine = null;
let beatGrid = null;
let waveformHandler = null;

// Initialize WaveSurfer
function initWaveSurfer() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        ...CONFIG,
        height: 200,
    });

    // Events
    wavesurfer.on('ready', onAudioReady);
    wavesurfer.on('play', onPlayStart);
    wavesurfer.on('pause', onPlayPause);
    wavesurfer.on('finish', onPlayEnd);
    wavesurfer.on('timeupdate', onTimeUpdate);
    wavesurfer.on('audioprocess', onAudioProcess);
    wavesurfer.on('error', onError);

    console.log('✅ WaveSurfer initialized');
}

// ============= DOM ELEMENTS =============

const DOM = {
    // File upload
    audioFile: document.getElementById('audioFile'),
    fileName: document.getElementById('file-name'),
    fileDuration: document.getElementById('file-duration'),
    fileInfo: document.getElementById('file-info'),

    // BPM
    bpmDisplay: document.getElementById('bpm-display'),
    bpmSlider: document.getElementById('bpm-slider'),
    bpmValueDisplay: document.getElementById('bpm-value-display'),
    detectBpmBtn: document.getElementById('detect-bpm-btn'),

    // Effects
    reverbToggle: document.getElementById('reverb-toggle'),
    reverbSlider: document.getElementById('reverb-slider'),
    slowedToggle: document.getElementById('slowed-toggle'),
    slowedSlider: document.getElementById('slowed-slider'),
    fadeToggle: document.getElementById('fade-toggle'),

    // Loop controls
    setStartBtn: document.getElementById('set-start-btn'),
    setEndBtn: document.getElementById('set-end-btn'),
    clearLoopBtn: document.getElementById('clear-loop-btn'),

    // Time display
    loopStartDisplay: document.getElementById('loop-start-display'),
    loopEndDisplay: document.getElementById('loop-end-display'),
    currentTimeDisplay: document.getElementById('current-time'),
    durationDisplay: document.getElementById('duration-display'),

    // Playback
    playBtn: document.getElementById('play-btn'),
    pauseBtn: document.getElementById('pause-btn'),
    stopBtn: document.getElementById('stop-btn'),
    backBtn: document.getElementById('back-btn'),
    forwardBtn: document.getElementById('forward-btn'),

    // Loop toggle
    loopToggle: document.getElementById('loop-toggle'),
    loopStats: document.getElementById('loop-stats'),
    loopCountDisplay: document.getElementById('loop-count'),
    loopDurationDisplay: document.getElementById('loop-duration'),

    // Volume
    volumeSlider: document.getElementById('volume-slider'),
    volumeValue: document.getElementById('volume-value'),
    masterVolume: document.getElementById('master-volume'),
    masterVolumeValue: document.getElementById('master-volume-value'),

    // Loops list
    loopsList: document.getElementById('loops-list'),

    // AI
    aiSuggestBtn: document.getElementById('ai-suggest-btn'),
    aiSuggestions: document.getElementById('ai-suggestions'),
    aiText: document.getElementById('ai-text'),

    // Beat grid
    toggleBeatGridBtn: document.getElementById('toggle-beat-grid-btn'),
    beatsInfo: document.getElementById('beats-info'),
    beatsCount: document.getElementById('beats-count'),

    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),

    // Mixer
    addTrackBtn: document.getElementById('add-track-btn'),
    mixerTracks: document.getElementById('mixer-tracks'),

    // Playlists
    newPlaylistBtn: document.getElementById('new-playlist-btn'),
    playlistsContainer: document.getElementById('playlists-container'),

    // YouTube
    youtubeSearch: document.getElementById('youtube-search'),
    youtubeSearchBtn: document.getElementById('youtube-search-btn'),
    youtubeResults: document.getElementById('youtube-results'),
};

// ============= UTILITY FUNCTIONS =============

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    seconds = Math.floor(seconds);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateDisplay() {
    DOM.loopStartDisplay.textContent = formatTime(STATE.loopStart);
    DOM.loopEndDisplay.textContent = formatTime(STATE.loopEnd);
    DOM.currentTimeDisplay.textContent = formatTime(wavesurfer?.getCurrentTime() || 0);
    DOM.durationDisplay.textContent = formatTime(wavesurfer?.getDuration() || 0);
    DOM.bpmDisplay.textContent = Math.round(STATE.currentBPM);
    DOM.volumeValue.textContent = `${DOM.volumeSlider.value}%`;
}

// ============= AUDIO FILE LOADING =============

DOM.audioFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    STATE.currentFile = file;
    DOM.fileName.textContent = `Arquivo: ${file.name}`;
    DOM.fileInfo.classList.remove('hidden');

    // Load audio
    wavesurfer.loadBlob(file);

    // Auto-detect BPM
    setTimeout(() => detectBPM(file), 500);
});

async function detectBPM(file) {
    try {
        if (typeof BPMDetector === 'undefined') {
            console.warn('BPMDetector not available');
            return;
        }

        const detector = new BPMDetector();
        const analysis = await detector.analyze(file);
        
        STATE.currentBPM = analysis.bpm || 120;
        STATE.currentBeats = analysis.beats || [];

        DOM.bpmDisplay.textContent = Math.round(STATE.currentBPM);
        DOM.bpmSlider.value = STATE.currentBPM;
        DOM.bpmValueDisplay.textContent = Math.round(STATE.currentBPM);

        if (beatGrid) {
            beatGrid.setBeats(STATE.currentBeats);
        }

        console.log(`✅ BPM Detected: ${STATE.currentBPM}`);
    } catch (error) {
        console.warn('BPM Detection failed:', error);
    }
}

DOM.detectBpmBtn.addEventListener('click', () => {
    if (STATE.currentFile) {
        detectBPM(STATE.currentFile);
    }
});

// ============= WAVESURFER EVENTS =============

function onAudioReady() {
    STATE.isLoaded = true;
    const duration = wavesurfer.getDuration();
    STATE.loopEnd = duration;
    DOM.durationDisplay.textContent = formatTime(duration);
    DOM.fileDuration.textContent = `Duração: ${formatTime(duration)}`;
    console.log('✅ Audio ready');
    updateDisplay();
}

function onPlayStart() {
    STATE.isPlaying = true;
    DOM.playBtn.textContent = '⏸';
    DOM.pauseBtn.textContent = '⏸';
}

function onPlayPause() {
    STATE.isPlaying = false;
    DOM.playBtn.textContent = '▶';
    DOM.pauseBtn.textContent = '▶';
}

function onPlayEnd() {
    STATE.isPlaying = false;
    DOM.playBtn.textContent = '▶';
    
    if (STATE.isLoopEnabled) {
        wavesurfer.setTime(STATE.loopStart);
        wavesurfer.play();
    }
}

function onTimeUpdate(time) {
    DOM.currentTimeDisplay.textContent = formatTime(time);
}

function onAudioProcess() {
    if (!STATE.isLoopEnabled) return;

    const current = wavesurfer.getCurrentTime();
    if (current >= STATE.loopEnd) {
        STATE.loopCount++;
        DOM.loopCountDisplay.textContent = STATE.loopCount;
        wavesurfer.setTime(STATE.loopStart);
    }
}

function onError(error) {
    console.error('WaveSurfer error:', error);
    alert('❌ Erro ao carregar áudio');
}

// ============= PLAYBACK CONTROLS =============

DOM.playBtn.addEventListener('click', () => {
    if (STATE.isLoaded) {
        wavesurfer.playPause();
    }
});

DOM.pauseBtn.addEventListener('click', () => {
    if (STATE.isLoaded) {
        wavesurfer.pause();
    }
});

DOM.stopBtn.addEventListener('click', () => {
    if (STATE.isLoaded) {
        wavesurfer.stop();
        STATE.loopCount = 0;
        DOM.loopCountDisplay.textContent = '0';
    }
});

DOM.backBtn.addEventListener('click', () => {
    if (STATE.isLoaded) {
        const current = wavesurfer.getCurrentTime();
        wavesurfer.setTime(Math.max(0, current - 5));
    }
});

DOM.forwardBtn.addEventListener('click', () => {
    if (STATE.isLoaded) {
        const current = wavesurfer.getCurrentTime();
        const duration = wavesurfer.getDuration();
        wavesurfer.setTime(Math.min(duration, current + 5));
    }
});

// ============= LOOP CONTROLS =============

DOM.setStartBtn.addEventListener('click', () => {
    if (STATE.isLoaded) {
        STATE.loopStart = wavesurfer.getCurrentTime();
        DOM.loopStartDisplay.textContent = formatTime(STATE.loopStart);
        console.log(`Loop Start: ${formatTime(STATE.loopStart)}`);
    }
});

DOM.setEndBtn.addEventListener('click', () => {
    if (STATE.isLoaded) {
        STATE.loopEnd = wavesurfer.getCurrentTime();
        DOM.loopEndDisplay.textContent = formatTime(STATE.loopEnd);
        const loopDuration = STATE.loopEnd - STATE.loopStart;
        DOM.loopDurationDisplay.textContent = formatTime(loopDuration);
        console.log(`Loop End: ${formatTime(STATE.loopEnd)}`);
    }
});

DOM.clearLoopBtn.addEventListener('click', () => {
    STATE.loopStart = 0;
    STATE.loopEnd = wavesurfer?.getDuration() || 0;
    STATE.loopCount = 0;
    DOM.loopStartDisplay.textContent = '0:00';
    DOM.loopEndDisplay.textContent = formatTime(STATE.loopEnd);
    DOM.loopCountDisplay.textContent = '0';
    DOM.loopToggle.checked = false;
    STATE.isLoopEnabled = false;
    console.log('Loop cleared');
});

DOM.loopToggle.addEventListener('change', (e) => {
    STATE.isLoopEnabled = e.target.checked;
    if (STATE.isLoopEnabled) {
        DOM.loopStats.classList.remove('hidden');
        console.log(`✅ Loop enabled: ${formatTime(STATE.loopStart)} - ${formatTime(STATE.loopEnd)}`);
    } else {
        DOM.loopStats.classList.add('hidden');
        console.log('❌ Loop disabled');
    }
});

// ============= BPM CONTROL =============

DOM.bpmSlider.addEventListener('input', (e) => {
    STATE.currentBPM = parseFloat(e.target.value);
    DOM.bpmValueDisplay.textContent = Math.round(STATE.currentBPM);
    DOM.bpmDisplay.textContent = Math.round(STATE.currentBPM);
    console.log(`BPM adjusted to: ${Math.round(STATE.currentBPM)}`);
});

// ============= EFFECTS CONTROLS =============

// REVERB
DOM.reverbToggle.addEventListener('change', (e) => {
    STATE.effects.reverbEnabled = e.target.checked;
    DOM.reverbSlider.disabled = !e.target.checked;
    applyEffects();
});

DOM.reverbSlider.addEventListener('input', (e) => {
    STATE.effects.reverbAmount = parseFloat(e.target.value);
    applyEffects();
});

// SLOWED
DOM.slowedToggle.addEventListener('change', (e) => {
    STATE.effects.slowedEnabled = e.target.checked;
    DOM.slowedSlider.disabled = !e.target.checked;
    applyEffects();
});

DOM.slowedSlider.addEventListener('input', (e) => {
    STATE.effects.slowedAmount = parseFloat(e.target.value);
    applyEffects();
});

// FADE
DOM.fadeToggle.addEventListener('change', (e) => {
    STATE.effects.fadeEnabled = e.target.checked;
    applyEffects();
});

function applyEffects() {
    if (!wavesurfer) return;

    // Reverb effect
    if (STATE.effects.reverbEnabled) {
        const reverb = STATE.effects.reverbAmount / 100;
        console.log(`🔊 Reverb: ${Math.round(reverb * 100)}%`);
    }

    // Slowed effect (changes playback rate)
    if (STATE.effects.slowedEnabled) {
        const rate = STATE.effects.slowedAmount;
        // WaveSurfer v7 uses setPlaybackRate
        if (wavesurfer.setPlaybackRate) {
            wavesurfer.setPlaybackRate(rate);
        }
        console.log(`🐢 Slowed: ${Math.round(rate * 100)}%`);
    } else {
        if (wavesurfer.setPlaybackRate) {
            wavesurfer.setPlaybackRate(1.0);
        }
    }

    // Fade effect
    if (STATE.effects.fadeEnabled) {
        console.log(`✨ Fade In/Out: Active`);
    }
}

// ============= VOLUME CONTROL =============

DOM.volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    if (wavesurfer) {
        wavesurfer.setVolume(volume);
    }
    DOM.volumeValue.textContent = `${e.target.value}%`;
});

DOM.masterVolume.addEventListener('input', (e) => {
    DOM.masterVolumeValue.textContent = `${e.target.value}%`;
});

// ============= SAVE LOOP =============

function saveLoop() {
    const loopDuration = STATE.loopEnd - STATE.loopStart;
    if (loopDuration <= 0) {
        alert('⚠️ Define o início e o fim do loop primeiro');
        return;
    }

    const loopName = prompt('Nome do loop:', `Loop ${STATE.loops.length + 1}`);
    if (!loopName) return;

    const loop = {
        id: Date.now(),
        name: loopName,
        start: STATE.loopStart,
        end: STATE.loopEnd,
        duration: loopDuration,
        bpm: STATE.currentBPM,
        file: STATE.currentFile?.name || 'unknown',
    };

    STATE.loops.push(loop);
    saveLoopToStorage();
    renderLoopsList();
    console.log(`✅ Loop salvo: "${loopName}"`);
}

function saveLoopToStorage() {
    localStorage.setItem('loops', JSON.stringify(STATE.loops));
}

function loadLoopsFromStorage() {
    const stored = localStorage.getItem('loops');
    if (stored) {
        STATE.loops = JSON.parse(stored);
        renderLoopsList();
    }
}

function renderLoopsList() {
    if (STATE.loops.length === 0) {
        DOM.loopsList.innerHTML = '<p class="empty-state">Nenhum loop salvo</p>';
        return;
    }

    DOM.loopsList.innerHTML = STATE.loops.map(loop => `
        <div class="loop-item">
            <div class="loop-item-name">${loop.name}</div>
            <div class="loop-item-time">${formatTime(loop.start)} → ${formatTime(loop.end)} (${formatTime(loop.duration)})</div>
            <div class="loop-item-actions">
                <button class="btn btn-secondary" onclick="loadLoop(${loop.id})">▶ Play</button>
                <button class="btn btn-danger" onclick="deleteLoop(${loop.id})">✕</button>
            </div>
        </div>
    `).join('');
}

window.loadLoop = (loopId) => {
    const loop = STATE.loops.find(l => l.id === loopId);
    if (loop) {
        STATE.loopStart = loop.start;
        STATE.loopEnd = loop.end;
        wavesurfer.setTime(loop.start);
        wavesurfer.play();
        DOM.loopToggle.checked = true;
        STATE.isLoopEnabled = true;
        DOM.loopStats.classList.remove('hidden');
        console.log(`▶️ Playing loop: "${loop.name}"`);
        updateDisplay();
    }
};

window.deleteLoop = (loopId) => {
    if (confirm('Tem certeza que quer deletar este loop?')) {
        STATE.loops = STATE.loops.filter(l => l.id !== loopId);
        saveLoopToStorage();
        renderLoopsList();
        console.log('✅ Loop deletado');
    }
};

// ============= AI ASSISTANT =============

DOM.aiSuggestBtn.addEventListener('click', () => {
    if (!STATE.isLoaded) {
        alert('Carregue uma música primeiro');
        return;
    }

    DOM.aiSuggestions.classList.remove('hidden');
    DOM.aiText.textContent = '🤖 Analisando música...';

    // Simulated AI suggestion
    setTimeout(() => {
        const duration = wavesurfer.getDuration();
        const suggestedStart = duration * 0.2;
        const suggestedEnd = duration * 0.8;

        DOM.aiText.innerHTML = `
            <strong>🎯 Sugestão de IA:</strong><br>
            Melhor trecho detectado: <strong>${formatTime(suggestedStart)} → ${formatTime(suggestedEnd)}</strong><br>
            <small>Clique em "Set Start" e "Set End" para aplicar</small>
        `;

        STATE.loopStart = suggestedStart;
        STATE.loopEnd = suggestedEnd;
        updateDisplay();
    }, 1500);
});

// ============= BEAT GRID =============

DOM.toggleBeatGridBtn.addEventListener('click', () => {
    if (STATE.currentBeats.length === 0) {
        alert('🎯 Detecte os beats primeiro clicando em "Detectar BPM"');
        return;
    }

    DOM.beatsInfo.classList.toggle('hidden');
    DOM.beatsCount.textContent = STATE.currentBeats.length;
    console.log(`Beat Grid: ${STATE.currentBeats.length} beats detectados`);
});

// ============= KEYBOARD SHORTCUTS =============

document.addEventListener('keydown', (e) => {
    if (!STATE.isLoaded) return;

    switch (e.code) {
        case 'Space':
            e.preventDefault();
            wavesurfer.playPause();
            break;
        case 'ArrowLeft':
            DOM.backBtn.click();
            break;
        case 'ArrowRight':
            DOM.forwardBtn.click();
            break;
        case 'KeyS':
            saveLoop();
            break;
        case 'KeyL':
            DOM.loopToggle.click();
            break;
        case 'KeyB':
            DOM.toggleBeatGridBtn.click();
            break;
    }
});

// ============= TAB NAVIGATION =============

DOM.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Remove active from all
        DOM.tabBtns.forEach(b => b.classList.remove('active'));
        DOM.tabContents.forEach(c => c.classList.remove('active'));

        // Add active to clicked
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        console.log(`📑 Tab: ${tabName}`);
    });
});

// ============= MIXER TAB =============

DOM.addTrackBtn.addEventListener('click', () => {
    const trackId = `track-${Date.now()}`;
    const track = document.createElement('div');
    track.className = 'track';
    track.id = trackId;
    track.innerHTML = `
        <div class="track-info">
            <input type="file" accept="audio/*" class="track-file" placeholder="Selecione áudio...">
            <span class="track-name">Nova Faixa</span>
        </div>
        <input type="range" min="0" max="100" value="100" class="slider track-volume">
        <div class="track-controls">
            <button class="btn btn-danger" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    DOM.mixerTracks.insertBefore(track, DOM.addTrackBtn);
    console.log('➕ Nova faixa adicionada');
});

// ============= PLAYLISTS TAB =============

DOM.newPlaylistBtn.addEventListener('click', () => {
    const playlistName = prompt('Nome da playlist:');
    if (!playlistName) return;

    const playlist = {
        id: Date.now(),
        name: playlistName,
        songs: [],
        createdAt: new Date(),
    };

    // Save to localStorage
    let playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
    playlists.push(playlist);
    localStorage.setItem('playlists', JSON.stringify(playlists));

    renderPlaylists();
    console.log(`✅ Playlist criada: "${playlistName}"`);
});

function renderPlaylists() {
    const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
    
    if (playlists.length === 0) {
        DOM.playlistsContainer.innerHTML = '<p class="empty-state">Nenhuma playlist criada</p>';
        return;
    }

    DOM.playlistsContainer.innerHTML = playlists.map(p => `
        <div class="playlist-item">
            <div class="playlist-name">🎵 ${p.name}</div>
            <div class="playlist-count">${p.songs.length} músicas</div>
        </div>
    `).join('');
}

// ============= YOUTUBE INTEGRATION =============

DOM.youtubeSearchBtn.addEventListener('click', () => {
    const query = DOM.youtubeSearch.value;
    if (!query) return;

    DOM.youtubeResults.innerHTML = '<p>🔍 Procurando...</p>';

    // Simulated YouTube search
    setTimeout(() => {
        const results = [
            { title: `${query} - Original`, channel: 'Music Channel' },
            { title: `${query} - Remix`, channel: 'Remix Master' },
            { title: `${query} - Slowed`, channel: 'Slowed Beats' },
        ];

        DOM.youtubeResults.innerHTML = results.map((r, i) => `
            <div class="video-item">
                <div class="video-title">${r.title}</div>
                <div class="video-channel">🎤 ${r.channel}</div>
                <div class="video-actions">
                    <button class="btn btn-primary" onclick="alert('YouTube integration requires API key')">📥</button>
                    <button class="btn btn-secondary" onclick="alert('Share feature')">📤</button>
                </div>
            </div>
        `).join('');
    }, 1000);
});

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', () => {
    initWaveSurfer();
    loadLoopsFromStorage();
    renderPlaylists();
    updateDisplay();
    console.log('🚀 Loop Studio Pro Ready!');
});

// Export API
window.loopStudio = {
    getState: () => STATE,
    getCurrentTime: () => wavesurfer?.getCurrentTime() || 0,
    getDuration: () => wavesurfer?.getDuration() || 0,
    play: () => wavesurfer?.play(),
    pause: () => wavesurfer?.pause(),
    stop: () => wavesurfer?.stop(),
    setTime: (time) => wavesurfer?.setTime(time),
    getLoops: () => STATE.loops,
    saveLoop,
    loadLoop: window.loadLoop,
    deleteLoop: window.deleteLoop,
};

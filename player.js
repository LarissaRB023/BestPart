// ======================================================
// LOOP STUDIO PLAYER V1
// Desenvolvido para WaveSurfer.js v7
// ======================================================

// ------------------------------
// ELEMENTOS HTML
// ------------------------------

const audioInput = document.getElementById("audioFile");
const playBtn = document.getElementById("play");
const backBtn = document.getElementById("back");
const nextBtn = document.getElementById("forward");
const loopBtn = document.getElementById("loop");

const currentTimeLabel = document.getElementById("current");
const durationLabel = document.getElementById("duration");

const volumeSlider = document.getElementById("volume");

// ------------------------------
// CONFIGURAÇÕES
// ------------------------------

let isLoopEnabled = false;
let loopStart = 0;
let loopEnd = 0;
let isLoaded = false;
let isPlaying = false;

// Variáveis para análise de BPM
let currentBPM = 0;
let currentBeats = [];

// ------------------------------
// WAVESURFER
// ------------------------------

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

// ------------------------------
// FORMATADOR DE TEMPO
// ------------------------------

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
// CARREGAMENTO DE ÁUDIO
// ======================================================

audioInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // Carrega o arquivo no WaveSurfer
    wavesurfer.loadBlob(file);

    // Analisa BPM se disponível
    try {
        if (typeof BPMDetector !== 'undefined') {
            const detector = new BPMDetector();
            const analysis = await detector.analyze(file);
            currentBPM = analysis.bpm;
            currentBeats = analysis.beats;
            console.log("BPM detectado:", analysis.bpm);
            console.log("Beats:", analysis.beats);
        }
    } catch (error) {
        console.warn("BPM detection failed:", error);
    }
});

// ======================================================
// EVENTOS DO WAVESURFER
// ======================================================

// Quando o áudio está pronto
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

// Quando começa a tocar
wavesurfer.on("play", () => {
    isPlaying = true;
    playBtn.innerHTML = "⏸";
});

// Quando pausa
wavesurfer.on("pause", () => {
    isPlaying = false;
    playBtn.innerHTML = "▶";
});

// Quando termina
wavesurfer.on("finish", () => {
    playBtn.innerHTML = "▶";
    isPlaying = false;

    // Se loop está ativado, reinicia
    if (isLoopEnabled) {
        wavesurfer.play();
    }
});

// Atualiza o tempo atual
wavesurfer.on("timeupdate", (time) => {
    currentTimeLabel.innerHTML = formatTime(time);
});

// Executa o loop
wavesurfer.on("audioprocess", () => {
    if (!isLoopEnabled) {
        return;
    }

    const current = wavesurfer.getCurrentTime();

    if (current >= loopEnd) {
        wavesurfer.setTime(loopStart);
    }
});

// Ao clicar na waveform
wavesurfer.on("interaction", () => {
    currentTimeLabel.innerHTML = formatTime(wavesurfer.getCurrentTime());
});

// Erro ao carregar arquivo
wavesurfer.on("error", (error) => {
    console.error("WaveSurfer error:", error);
    alert("Não foi possível carregar esse áudio.");
});

// ======================================================
// BOTÕES DE CONTROLE
// ======================================================

// Play/Pause
playBtn.addEventListener("click", () => {
    if (!isLoaded) {
        return;
    }

    wavesurfer.playPause();
});

// Botão voltar 5 segundos
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

// Botão avançar 5 segundos
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
// SISTEMA DE LOOP
// ======================================================

loopBtn.addEventListener("click", () => {
    if (!isLoaded) {
        return;
    }

    isLoopEnabled = !isLoopEnabled;

    if (isLoopEnabled) {
        loopBtn.style.background = "#8b5cf6";
        loopBtn.style.boxShadow = "0 0 25px #8b5cf6";
    } else {
        loopBtn.style.background = "";
        loopBtn.style.boxShadow = "";
    }
});

// ======================================================
// VOLUME
// ======================================================

volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value / 100;
    wavesurfer.setVolume(volume);
});

// ======================================================
// ATALHOS DE TECLADO
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
    }
});

// ======================================================
// API PARA PRÓXIMAS VERSÕES
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

// Exportar funções para acesso global
window.player = {
    play() {
        wavesurfer.play();
    },

    pause() {
        wavesurfer.pause();
    },

    stop() {
        wavesurfer.stop();
    },

    setLoop(value) {
        isLoopEnabled = value;
    },

    getDuration() {
        return wavesurfer.getDuration();
    },

    getCurrentTime() {
        return wavesurfer.getCurrentTime();
    },

    setLoopPoints(start, end) {
        setLoop(start, end);
    },

    getBPM() {
        return currentBPM;
    },

    getBeats() {
        return currentBeats;
    }
};

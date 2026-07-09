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

// ------------------------------
// WAVESURFER
// ------------------------------

const wavesurfer = WaveSurfer.create({

    container:"#waveform",

    waveColor:"#5e4cff",

    progressColor:"#00d7ff",

    cursorColor:"#ffffff",

    cursorWidth:2,

    height:180,

    normalize:true,

    barWidth:3,

    barGap:2,

    barRadius:4,

    dragToSeek:true,

    autoScroll:true,

    autoCenter:true

});

// ------------------------------
// FORMATADOR DE TEMPO
// ------------------------------

function formatTime(seconds){

    seconds=Math.floor(seconds);

    let min=Math.floor(seconds/60);

    let sec=seconds%60;

    if(sec<10){

        sec="0"+sec;

    }

    return min+":"+sec;

}

// ------------------------------
// CARREGAR MÚSICA
// ------------------------------

audioInput.addEventListener("change",(event)=>{

    const file=event.target.files[0];

    if(!file){

        return;

    }

    wavesurfer.loadBlob(file);

    analyzeAudio(file);

});

// ------------------------------
// MÚSICA CARREGADA
// ------------------------------

wavesurfer.on("ready",()=>{

    isLoaded=true;

    durationLabel.innerHTML=formatTime(

        wavesurfer.getDuration()

    );

    currentTimeLabel.innerHTML="0:00";

    loopStart=0;

    loopEnd=wavesurfer.getDuration();

    playBtn.disabled = false;
    backBtn.disabled = false;
    nextBtn.disabled = false;

});

// ------------------------------
// PLAY
// ------------------------------

playBtn.addEventListener("click",()=>{

    if(!isLoaded){

        return;

    }

    wavesurfer.playPause();

});

// ------------------------------
// PLAY STATE
// ------------------------------

wavesurfer.on("play",()=>{

    isPlaying=true;

    playBtn.innerHTML="⏸";

});

// ------------------------------
// PAUSE STATE
// ------------------------------

wavesurfer.on("pause",()=>{

    isPlaying=false;

    playBtn.innerHTML="▶";

});

// ------------------------------
// FIM
// ------------------------------

wavesurfer.on("finish",()=>{

    if(isLoopEnabled){

        wavesurfer.play();

    } else {

        playBtn.innerHTML="▶";

        isPlaying=false;

    }

});

// ------------------------------
// TEMPO ATUAL
// ------------------------------

wavesurfer.on("timeupdate",(time)=>{

    currentTimeLabel.innerHTML=formatTime(time);

});

// ------------------------------
// VOLUME
// ------------------------------

volumeSlider.addEventListener("input",()=>{

    const volume=

        volumeSlider.value/100;

    wavesurfer.setVolume(volume);

});

// ------------------------------
// BOTÃO VOLTAR
// ------------------------------

backBtn.addEventListener("click",()=>{

    if(!isLoaded){

        return;

    }

    let current=

    wavesurfer.getCurrentTime();

    current=current-5;

    if(current<0){

        current=0;

    }

    wavesurfer.setTime(current);

});

// ------------------------------
// BOTÃO AVANÇAR
// ------------------------------

nextBtn.addEventListener("click",()=>{

    if(!isLoaded){

        return;

    }

    let current=

    wavesurfer.getCurrentTime();

    current=current+5;

    if(

        current>

        wavesurfer.getDuration()

    ){

        current=

        wavesurfer.getDuration();

    }

    wavesurfer.setTime(current);

});

// ------------------------------
// LOOP
// ------------------------------

loopBtn.addEventListener("click",()=>{

    if(!isLoaded){

        return;

    }

    isLoopEnabled=!isLoopEnabled;

    if(isLoopEnabled){

        loopBtn.style.background=

        "#8b5cf6";

        loopBtn.style.boxShadow=

        "0 0 25px #8b5cf6";

    }else{

        loopBtn.style.background="";

        loopBtn.style.boxShadow="";

    }

});

// ------------------------------
// EXECUTA LOOP
// ------------------------------

wavesurfer.on("audioprocess",()=>{

    if(!isLoopEnabled){

        return;

    }

    const current=

    wavesurfer.getCurrentTime();

    if(current>=loopEnd){

        wavesurfer.setTime(loopStart);

    }

});

// ------------------------------
// CLICK NA WAVEFORM
// ------------------------------

wavesurfer.on("interaction",()=>{

    currentTimeLabel.innerHTML=

    formatTime(

        wavesurfer.getCurrentTime()

    );

});

// ------------------------------
// TECLADO: ESPAÇO = PLAY
// ------------------------------

document.addEventListener(

"keydown",

(event)=>{

    if(

        event.code==="Space"

    ){

        event.preventDefault();

        if(!isLoaded){

            return;

        }

        wavesurfer.playPause();

    }

});

// ------------------------------
// TECLADO: L = LOOP
// ------------------------------

document.addEventListener(

"keydown",

(event)=>{

    if(

        event.key.toLowerCase()==="l"

    ){

        loopBtn.click();

    }

});

// ------------------------------
// TECLADO: SETA ESQUERDA
// ------------------------------

document.addEventListener(

"keydown",

(event)=>{

    if(event.key==="ArrowLeft"){

        backBtn.click();

    }

});

// ------------------------------
// TECLADO: SETA DIREITA
// ------------------------------

document.addEventListener(

"keydown",

(event)=>{

    if(event.key==="ArrowRight"){

        nextBtn.click();

    }

});

// ------------------------------
// TRATAMENTO DE ERRO
// ------------------------------

wavesurfer.on("error", (error)=>{

    console.error(error);

    alert(

        "Não foi possível carregar esse áudio."

    );

});

// ------------------------------
// ANÁLISE DE ÁUDIO (BPM)
// ------------------------------

async function analyzeAudio(file){

    const detector = new BPMDetector();

    const analysis = await detector.analyze(file);

    console.log("BPM detectado:", analysis.bpm);

    console.log("Beats:", analysis.beats);

}

// ======================================================
// API PÚBLICA
// ======================================================

function setLoop(start,end){

    loopStart=start;

    loopEnd=end;

}

function disableLoop(){

    isLoopEnabled=false;

}

function enableLoop(){

    isLoopEnabled=true;

}

function play(){

    wavesurfer.play();

}

function pause(){

    wavesurfer.pause();

}

function stop(){

    wavesurfer.stop();

}

function getCurrentTime(){

    return wavesurfer.getCurrentTime();

}

function getDuration(){

    return wavesurfer.getDuration();

}

function getPlayer(){

    return wavesurfer;

}

// Exportar para window
window.player = {

    play(){
        play();
    },

    pause(){
        pause();
    },

    stop(){
        stop();
    },

    setLoop(value){
        if(value) enableLoop();
        else disableLoop();
    },

    getDuration(){
        return getDuration();
    },

    getCurrentTime(){
        return getCurrentTime();
    },

    setLoopRegion(start, end){
        setLoop(start, end);
    }

};

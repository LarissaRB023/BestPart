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
// PLAY
// ------------------------------

wavesurfer.on("play",()=>{

    isPlaying=true;

    playBtn.innerHTML="⏸";

});

// ------------------------------
// PAUSE
// ------------------------------

wavesurfer.on("pause",()=>{

    isPlaying=false;

    playBtn.innerHTML="▶";

});

// ------------------------------
// FIM
// ------------------------------

wavesurfer.on("finish",()=>{

    playBtn.innerHTML="▶";

    isPlaying=false;

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
// ESPAÇO = PLAY
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
// L = LOOP
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
// SETA ESQUERDA
// ------------------------------

document.addEventListener(

"keydown",

(event)=>{

    if(event.key==="ArrowLeft"){

        backBtn.click();

    }

});

// ------------------------------
// SETA DIREITA
// ------------------------------

document.addEventListener(

"keydown",

(event)=>{

    if(event.key==="ArrowRight"){

        nextBtn.click();

    }

});

// ------------------------------
// API PARA PRÓXIMAS VERSÕES
// ------------------------------

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

// player.js - continuação

// Atualiza tempo atual enquanto toca
wavesurfer.on("timeupdate", (time) => {
    current.textContent = formatTime(time);
});


// Atualiza duração quando o áudio carregar
wavesurfer.on("ready", () => {
    const durationTime = wavesurfer.getDuration();

    duration.textContent = formatTime(durationTime);

    play.disabled = false;
    back.disabled = false;
    forward.disabled = false;
});


// Quando terminar o áudio
wavesurfer.on("finish", () => {

    if(loopEnabled){
        wavesurfer.play();
    } else {
        play.innerHTML = "▶";
    }

});


// Erro ao carregar arquivo
wavesurfer.on("error", (error)=>{

    console.error(error);

    alert(
        "Não foi possível carregar esse áudio."
    );

});


// Controle de teclado
document.addEventListener(
"keydown",
(e)=>{

    switch(e.code){

        case "Space":

            e.preventDefault();

            wavesurfer.playPause();

            break;


        case "ArrowLeft":

            wavesurfer.skip(-5);

            break;


        case "ArrowRight":

            wavesurfer.skip(5);

            break;


        case "KeyL":

            toggleLoop();

            break;

    }

});



// Função para carregar áudio manualmente
function loadAudio(file){

    if(!file) return;


    const url = URL.createObjectURL(file);


    wavesurfer.load(url);


}



// Input de arquivo
audioFile.addEventListener(
"change",
(e)=>{

    const file = e.target.files[0];

    loadAudio(file);

});



// Botão play/pause
play.addEventListener(
"click",
()=>{

    wavesurfer.playPause();

});


// Atualiza botão play
wavesurfer.on(
"play",
()=>{

    play.innerHTML="⏸";

});


wavesurfer.on(
"pause",
()=>{

    play.innerHTML="▶";

});


// Botão voltar
back.addEventListener(
"click",
()=>{

    wavesurfer.skip(-5);

});


// Botão avançar
forward.addEventListener(
"click",
()=>{

    wavesurfer.skip(5);

});


// Volume
volume.addEventListener(
"input",
()=>{

    wavesurfer.setVolume(
        volume.value
    );

});


// Sistema de loop
let loopEnabled = false;


function toggleLoop(){

    loopEnabled = !loopEnabled;


    loop.classList.toggle(
        "active",
        loopEnabled
    );


}


loop.addEventListener(
"click",
()=>{

    toggleLoop();

});



// Exportar funções
window.player = {

    play(){
        wavesurfer.play();
    },


    pause(){
        wavesurfer.pause();
    },


    stop(){
        wavesurfer.stop();
    },


    setLoop(value){

        loopEnabled = value;

    },


    getDuration(){

        return wavesurfer.getDuration();

    },


    getCurrentTime(){

        return wavesurfer.getCurrentTime();

    }

};

audioFile.addEventListener("change", async (e)=>{

    const file = e.target.files[0];

    // carrega normalmente
    wavesurfer.load(
        URL.createObjectURL(file)
    );


    // analisa BPM
    const detector = new BPMDetector();

    const analysis =
        await detector.analyze(file);



    console.log(
        "BPM detectado:",
        analysis.bpm
    );


    console.log(
        "Beats:",
        analysis.beats
    );


});
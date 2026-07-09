class BPMDetector {

    constructor(){

        this.audioContext =
            new AudioContext();

    }



    async analyze(file){

        const arrayBuffer =
            await file.arrayBuffer();


        const audioBuffer =
            await this.audioContext
            .decodeAudioData(arrayBuffer);



        const channelData =
            audioBuffer.getChannelData(0);



        const peaks =
            this.detectPeaks(
                channelData,
                audioBuffer.sampleRate
            );



        const bpm =
            this.calculateBPM(
                peaks
            );


        return {

            bpm:bpm,

            beats:peaks,

            duration:
            audioBuffer.duration

        };

    }




    detectPeaks(data, sampleRate){

        const peaks=[];


        let threshold =
            0.85;


        let minDistance =
            sampleRate * 0.25;



        let lastPeak=0;



        for(
            let i=0;
            i<data.length;
            i++
        ){


            const volume =
            Math.abs(data[i]);



            if(
                volume > threshold &&
                i-lastPeak > minDistance
            ){

                peaks.push(
                    i / sampleRate
                );


                lastPeak=i;

            }


        }



        return peaks;

    }




    calculateBPM(beats){


        if(beats.length < 2)
            return 0;



        let intervals=[];



        for(
            let i=1;
            i<beats.length;
            i++
        ){

            intervals.push(
                beats[i]-beats[i-1]
            );

        }



        const average =
            intervals.reduce(
                (a,b)=>a+b,
                0
            )
            /
            intervals.length;



        let bpm =
            60 / average;



        // Corrige valores fora do padrão

        while(bpm < 70)
            bpm*=2;


        while(bpm > 180)
            bpm/=2;



        return Math.round(bpm);

    }

}


window.BPMDetector =
BPMDetector;
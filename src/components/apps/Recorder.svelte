<script>
	import { onMount } from "svelte";
    import Window from "../ui-comps/Window.svelte";
    import fs from "@zenfs/core";
    import { Buffer } from "buffer";
    export let windowSettings = {
        app_id:"sys_recorder",
        windowTitle: "Sound Recorder",
        windowIcon:"/apps/recorder.png",
        windowHeight:420,
        windowWidth:420,
        windowLeft:0,
        windowTop:0,
        disableResize: true,
        disableMaximise: true,
        filePath:"",
    }
    export let windowID = ""
    export let app_id = ""
    export let windowWebDefined = {
            windowHidden:"visible",
            disableMaximise:true,
            disableResize:false,
            currentZIndex:5,
    }

    let audioContext;
let recorder;
let mediaStream;
let chunks = [];
let isRecording = false;

let recordButton
let stopButton
let audioPlayback
let canvas
let canvasContext
$: canvasContext = canvas?.getContext('2d');
let debugMsg = ""
async function startRecording() {
    if (!navigator.mediaDevices) {
        alert('Your browser does not support audio recording.');
        return;
    }

    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const input = audioContext.createMediaStreamSource(mediaStream);
    recorder = new MediaRecorder(mediaStream);

    recorder.ondataavailable = event => {
        chunks.push(event.data);
    };

    recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        chunks = [];
        const audioURL = URL.createObjectURL(blob);
        audioPlayback.src = audioURL;
        try{
            var fileReader = new FileReader();
            fileReader.onload = function() {
                fs.writeFileSync('/drive/music/recording'+Date.now()+'.webm', Buffer.from(new Uint8Array(this.result)));
            };
            fileReader.readAsArrayBuffer(blob);
        }catch(e){
            console.log(e)
        }
    };

    recorder.start();
    isRecording = true;
    recordButton.disabled = true;
    stopButton.disabled = false;
    visualize(input);
}

function stopRecording() {
    recorder.stop();
    mediaStream.getTracks().forEach(track => track.stop());
    audioContext.close();
    // let file = new File(audioPlayback, "Recording-"+Date.now()+".webm", {lastModified: Date.now()});
    // try{fs.writeFileSync("/home/music/"+"Recording-"+Date.now()+".webm",file);
    //     debugMsg.innerText = "Recording saved successfully in /home/music"
    // }catch{
    //      debugMsg.innerText = "Failed to save. Please download to save recording"
    // }
    
    isRecording = false;
    recordButton.disabled = false;
    stopButton.disabled = true;
}

function visualize(stream) {
    const analyser = audioContext.createAnalyser();
    stream.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        if (!isRecording) {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasContext.fillStyle = '#111928';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(255, 255, 255)';
        canvasContext.beginPath();

        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasContext.lineTo(canvas.width, canvas.height / 2);
        canvasContext.stroke();
    }

    draw();
}
</script>
<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
<div class="container">
    <div>
        <button id="recordButton" on:click={startRecording} bind:this = {recordButton}>Record</button>
        <button id="stopButton" on:click={stopRecording} disabled bind:this = {stopButton}>Stop</button>
    </div>
    <canvas id="visualizer" bind:this = {canvas}></canvas>
    <audio id="audioPlayback" controls bind:this = {audioPlayback}></audio>
    <span bind:this = {debugMsg}></span>
</div>
</Window>
<style>
.container {
    text-align: center;
    padding: 20px;
    background-color: #111928;
    display:flex;
    flex-direction: column;
    align-items: center;
    /* border-radius: 10px; */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

button {
    padding: 10px 20px;
    margin: 10px;
    border: none;
    background-color: red;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

canvas {
    display: block;
    margin: 20px auto;
    width: 100%;
    height: 150px;
    border: 1px solid white;
}

</style>
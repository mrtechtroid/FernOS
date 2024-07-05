<script>
    import Window from "../ui-comps/Window.svelte";
    import {onMount} from "svelte"
    import fs from "@zenfs/core";
    export let windowSettings = {
        windowTitle: "Music Player",
        windowIcon:"/apps/music_player.png",
        windowHeight:200,
        windowWidth:600,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"sys_musicplayer"
    }
    export let windowID = ""
    export let app_id = ""
    export let filePath = '';
    export let windowWebDefined = {
            windowHidden:"visible",
            disableMaximise:true,
            disableResize:false,
            currentZIndex:5,
    }
    let _filePath = filePath;
    let audioURL = ""
    function readFile(_filePath, ) {
		if (_filePath != '') {
			try {
				audioURL = "data:audio/"+_filePath.split('.').pop()+";base64," + fs.readFileSync(_filePath, { encoding: 'base64', flag: 'r' });
			} catch (err) {
				console.log(err);
			}
		} 
	}
	$: readFile(_filePath);



let audio;
let playPauseButton;
let volumeControl;
let progressBar;
let currentTimeDisplay;
let totalTimeDisplay;

let isPlaying = false;

function playBtnClick () {
    if (isPlaying) {
        audio.pause();
        playPauseButton.textContent = "Play";
    } else {
        audio.play();
        playPauseButton.textContent = "Pause";
    }
    isPlaying = !isPlaying;
}

function audioTimeUpdate () {
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);

    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
}
function audioEnded(){
    audio.currentTime = 0;
    playPauseButton.textContent = "Play"
    isPlaying = !isPlaying;
}
</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
	<div style="width:100%;height:100%;background-color:#1f2937;padding:10px;">
        <div class="audio-player">
            <audio style = "display:none" id="audio" controls bind:this={audio} on:timeupdate={audioTimeUpdate} on:ended={audioEnded}>
                <source src = {audioURL} type = {"audio/"+_filePath.split('.').pop()}>
                Your browser does not support the audio element.
            </audio>
            <div class="progress">
                <div class="progress-bar" id="progress-bar" bind:this = {progressBar}></div>
            </div>
            <div style="display: flex;flex-direction:row;justify-content:space-between">
                <div id="current-time" bind:this = {currentTimeDisplay}>0:00</div>
                <div id="total-time" bind:this = {totalTimeDisplay}>0:00</div>
            </div>
            <div class="controls">
                <button id="play-pause-button" class = "btn btn-primary"  bind:this = {playPauseButton} on:click={playBtnClick}>Play</button>
                <input type="range" id="volume-control" bind:this={volumeControl} on:input={function(){audio.volume = volumeControl.value;}} min="0" max="1" step="0.01" value="1">
            </div>
        </div>
    </div>
</Window>
<style>

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.progress {
    height: 10px;
    background-color: #ccc;
}

.progress-bar {
    width: 0;
    height: 100%;
    background-color: #4caf50;
}
</style>
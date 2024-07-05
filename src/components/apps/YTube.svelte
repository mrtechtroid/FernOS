<script>
	import { onMount, onDestroy } from 'svelte';
	import Window from '../ui-comps/Window.svelte';
	import fs from '@zenfs/core';
	import { Buffer } from 'buffer';
	export let windowSettings = {
		app_id: 'sys_ytube',
		windowTitle: 'YTube',
		windowIcon: '/apps/ytube.png',
		windowHeight: 360,
		windowWidth: 720,
		windowLeft: 0,
		windowTop: 0,
		disableResize: true,
		disableMaximise: true,
		defaultfilePath: '[sys_ytube]https://www.youtube.com/watch?v=4nOn9YLp7AE'
	};
	export let windowID = '';
	export let app_id = '';
	export let filePath = '';
	export let windowWebDefined = {
		windowHidden: 'visible',
		disableMaximise: true,
		disableResize: false,
		currentZIndex: 5
	};

	let done = false;
	

	onMount(() => {
		window.YT.player = "";
		window.YT.volumechange = function() {
			if (window.YT.player.isMuted() == true) {
				document.getElementById('tb_vl_br').value = 0;
			} else {
				volumebar = document.getElementById('tb_vl_br').value;
				window.YT.player.setVolume(volumebar);
			}
			if (window.YT.player.getVolume() < 100 && window.YT.player.getVolume() > 50) {
				document.getElementById('mute').innerText = 'volume_up';
			}
			if (window.YT.player.getVolume() < 50 && window.YT.player.getVolume() > 0) {
				document.getElementById('mute').innerText = 'volume_down';
			}
			if (window.YT.player.getVolume() == 0) {
				document.getElementById('mute').innerText = 'volume_off';
			}
		}

		window.YT.volumetype = function() {
			if (window.YT.player.isMuted() == true) {
				window.YT.player.unMute();
				document.getElementById('tb_up_btn').innerText = 'volume_up';
			} else {
				window.YT.player.mute();
				document.getElementById('tb_up_btn').innerText = 'volume_off';
			}
		}
		window.YT.fullscreen = function() {
			if (
				document.fullscreenElement ||
				document.webkitFullscreenElement ||
				document.mozFullScreenElement ||
				document.msFullscreenElement
			) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
				document.getElementById('yt_player').style.height = '50%';
				document.getElementById('yt_player').style.width = '68%';
			} else {
				let element = document.getElementById('yt_holdr');
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
				document.getElementById('yt_player').style.height = '90%';
				document.getElementById('yt_player').style.width = '90%';
			}
		}
		window.YT.ldVid = function() {
			window.YT.player.loadVideoById({
				videoId: document.getElementById('yt_vid_id').value,
				startSeconds: 0
			});
		}
		// function onYouTubeIframeAPIReady() {
		window.YT.player = new YT.Player('yt_player', {
			// videoId: '4nOn9YLp7AE',
			playerVars: {
				playsinline: 1,
				controls: 0,
				modestbranding: 1
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});
		// }
		function onPlayerReady(event) {
			event.target.playVideo();
			window.YT.ldVid();
		}
		function onPlayerStateChange(event) {
			if (event.data == YT.PlayerState.PLAYING && !done) {
			}
		}

		document.onkeydown = function (evt) {
			evt = evt || window.event;
			var isEscape = false;
			if ('key' in evt) {
				isEscape = evt.key === 'Escape' || evt.key === 'Esc';
			} else {
				isEscape = evt.keyCode === 27;
			}
			if (isEscape) {
				evt.preventDefault();
				fullscreen();
			}
		};
	});
</script>

<Window {...windowSettings} {...windowWebDefined} {windowID}>
	<div
		id="yt_container"
		style="width:100%;height:100%;display:flex;flex-direction:column;background-color:#1f2937"
	>
		<div
			id="yt_holdr"
			style="width:100%;height:100%;display: flex; justify-content: center;flex-direction: column;align-items: center;"
		>
			<div
				style="width:100%;height:90%;pointer-events: none;background-color: #122235;"
				id="yt_player"
			></div>
			<div
				id="toolbar"
				class="card"
				style="display: flex;flex-direction: column;align-items: center; z-index: 3;width:68%;color: white;border-radius: 0px 0px 12px 12px;"
			>
				<div style="display:flex;flex-direction:row;justify-content: space-evenly;">
					<span
						class="material-symbols-rounded sc_lnk"
						id="tp_bw_btn"
						onclick="window.YT.player.seekTo(window.YT.player.getCurrentTime()-10)}"
						title="-10 Seconds">fast_rewind</span
					>
					<span
						class="material-symbols-rounded sc_lnk"
						id="tp_pl_btn"
						title="Play"
						onclick="window.YT.player.playVideo()">play_arrow</span
					>
					<span
						class="material-symbols-rounded sc_lnk"
						id="tb_pa_btn"
						title="Pause"
						onclick="window.YT.player.pauseVideo()">pause</span
					>
					<span
						class="material-symbols-rounded sc_lnk"
						onclick="window.YT.player.stopVideo()"
						id="tb_st_btn"
						title="Stop">stop</span
					>
					<span
						class="material-symbols-rounded sc_lnk"
						id="tb_fw_btn"
						onclick="window.YT.player.seekTo(window.YT.player.getCurrentTime()+10)}"
						title="+10 Seconds">fast_forward</span
					>
					<span
						class="material-symbols-rounded sc_lnk"
						id="tb_up_btn"
						onclick="window.YT.volumetype()"
						title="Mute/Unmute">volume_up</span
					>
					<span
						class="material-symbols-rounded sc_lnk"
						id="tb_um_btn"
						title="Mute/Unmute"
						onclick="window.YT.fullscreen()">fit_screen</span
					>
					<span
						class="btncmd sc_lnk"
						id="tb_wy_btn"
						onclick="window.open(window.YT.player.getVideoUrl())"
						title="Watch On Youtube"
						><img
							style="filter: invert(1)"
							src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAVdJREFUSEvt1rsuRFEUgOFvNBq3BonErZFo6Kj1EhoheAilQkcnwlOgxFt4Ai0icWsENbIm58Q4ZpjbmYnESVZ39vr3Xnvtvf+CNn2FNnH9g9PKd2AMk0mMImIEPehDV/LzK57wjGtcJXGBiEu8Zbc0W+pIvo1FdDdp/19whq1kEsW0peBxnKO/ScBsmkfMpPBS8DGWc4KmaY+wml3xPQZyBj9gMAt+zxmapi9WubTU1YJPkuard551g2PgHPYxXQe9IXDw4qyvY7fG3mgYnC42LpNNbKCzigo0DZyyJrCDpV/guYD3MN8qcMtL3ZbmiuN0gKkqmqnsw/SnLpA6FvllyLeuvksv8EYz/zD+FkPZuzqerJUcoZH6EGutFoF4EmfLiUBMJDwr1GehyepzmqhP+Fjxq6S3WdkLyQsfG0ZvBdkL4btJRC+krybZy3mLP9P/C33LSv0B2YpAH2FlNUoAAAAASUVORK5CYII="
						/></span
					>
					<input
						class="ip-form"
						type="range"
						min="0"
						max="100"
						value="50"
						id="tb_vl_br"
						style="background-color: grey;width:100px;margin:0px;padding: 0px;"
						onchange="window.YT.volumechange()"
						oninput="window.YT.volumechange()"
					/>
					<input
						class="ip-form"
						type="text"
						value="4nOn9YLp7AE"
						placeholder="Youtube ID"
						id="yt_vid_id"
						style="width:140px;padding:1px;font-size:12px;margin:0px;padding:0px;height:20px;background-color:#1f2937;border:white 1px solid;"
					/><span
						id="yt_id_btn"
						style="background-color: transparent;border:none;color:white;padding:0px;margin:0px;"
						onclick="window.YT.ldVid()"><span class="material-symbols-rounded sc_lnk">search</span></span
					>
				</div>
			</div>
		</div>
	</div>
</Window>

<style>
	#code_edit {
		width: 100%;
		height: 100%;
		display: block;
	}
	.container {
		width: 100%;
		height: 600px;
	}
</style>

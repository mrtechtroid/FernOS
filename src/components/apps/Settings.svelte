<script>
	import { onMount } from "svelte";
    import Window from "../ui-comps/Window.svelte";
	import {windowActions} from "$lib/stores"
	import fs from '@zenfs/core';
	import {versionString} from "$lib/stores"
    export let windowSettings = {
        windowTitle: "Settings",
        windowIcon:"/apps/settings.png",
        windowHeight:410,
        windowWidth:720,
        windowLeft:0,
        windowTop:0,
        disableResize: true,
        disableMaximise: true,
        app_id:"sys_settings"
    }
    export let windowID = ""
    export let app_id = ""
    export let windowWebDefined = {
            windowHidden:"visible",
            disableMaximise:true,
            disableResize:false,
            currentZIndex:5,
    }
    let _tab = "about"
	let background_type = "default"
	let color = "#ffffff"
	let sett_json
	let url_image = ""
	let disableJSON = false
	function loadJSON(){
		try{
		sett_json = JSON.parse(fs.readFileSync("/home/settings.txt", { encoding: 'utf8', flag: 'r' }));
		background_type = sett_json.background.mainscreen.type
		color = sett_json.background.mainscreen.color
		url_image = sett_json.background.mainscreen.imgLocation
		}catch(e){
			disableJSON = true
		}
	}
	function syncJSON(e){
		if (!sett_json){
			return
		}
		sett_json.background.mainscreen.type = background_type
		sett_json.background.mainscreen.color= color
		if (background_type == "url_img"){
			sett_json.background.mainscreen.imgLocation = url_image
		}else{

		}
	}
	function deleteLocalStorage(){
		localStorage.clear();
    	document.location.reload();
	}
	function deleteIndexDB(){
			window.indexedDB.databases().then((r) => {
    for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
}).then(() => {
    document.location.reload();
});
		}
	onMount(()=>{
		loadJSON()
	})
	$: syncJSON(color,background_type,url_image)
	function saveJSON(){
		fs.writeFileSync("/home/settings.txt", JSON.stringify(sett_json));
		$windowActions.push({windowID:"sys_dashboard",action:"background_change"})
		$windowActions = $windowActions
	}
</script>

<Window {...windowSettings} {...windowWebDefined} {windowID}>
	<div class="flex h-screen">
		<aside class="w-1/6flex flex-col items-center py-6" style="width:30px;">
			<div class="flex flex-col items-center space-y-6">
				<button
					class="text-xl material-symbols-rounded"
					on:click={function () {
						_tab = 'about';
					}}>info</button
				>
				<button
					class="text-xl material-symbols-rounded {disableJSON?'hidden':''}"
					on:click={function () {
						_tab = 'background';
					}}>image</button
				>
				<button
					class="text-xl material-symbols-rounded"
					on:click={function () {
						_tab = 'language';
					}}>translate</button
				>
				<button
					class="text-xl material-symbols-rounded"
					on:click={function () {
						_tab = 'warning';
					}}>warning</button
				>
				
				<!-- <button class="text-xl material-symbols-rounded" on:click={function(){_tab = "timer"}}>hourglass_bottom</button> -->
				<!-- <button class="text-xl material-symbols-rounded" on:click={function(){_tab = "alarm"}}>alarm</button> -->
			</div>
		</aside>
		<main
			class="flex-1 p-6 flex flex-column gap-6"
			style="align-items: center;justify-content:center;"
		>
			{#if _tab == 'background'}
				<div style="display:flex;flex-direction:column;align-items:center;width:100%;height:100%;">
				<select class="select select-bordered w-full max-w-xs" bind:value={background_type}>
					<option value="default">Default</option>
					<option value = "color">Color</option>
					<option value = "url_img">URL Image</option>
					<option value = "image" disabled>Local Image(coming soon)</option>
			  	</select>
				{#if background_type == "default"}

				{:else if background_type == "color"}
				<label for="hs-color-input" class="block text-sm font-medium mb-2 dark:text-white">Color:</label>
				<input type="color" bind:value={color} class="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700" id="hs-color-input"  title="Choose your color">
				{:else if background_type == "image"}

				{:else if background_type == "url_img"}
					<label for="hs-color-input" class="block text-sm font-medium mb-2 dark:text-white">URL Image:</label>
					<input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" bind:value = {url_image}/>
				{/if}
				<button class="button btn btn-primary" style="margin:10px" on:click={saveJSON}>Save</button>
				</div>
			{:else if _tab == 'language'}
				<div style="display:flex;flex-direction:column;align-items:center;width:300px;height:100%;">
					Unfortunately only English is supported currently. More languages support is on the way.
				</div>
			{:else if _tab == 'about'}
			<div style="display:flex;flex-direction:column;align-items:center">
				<img src="/banner.png" />
				<center>Version {versionString}</center>
				<center>An Operating system right in your browser, with its own file system, suite of apps and games, built in Svelte.</center>
				<span style="font-size:12px"><a href = "https://github.com/mrtechtroid/fern">github</a>&nbsp;•&nbsp;<a href = "mailto:fern@mtt.one">fern@mtt.one</a>&nbsp;•&nbsp;<a href = "/credits.html">credits</a></span>
				{#if disableJSON}
				<span style="color:red">WARNING:[CRITICAL ERROR] Failed to load settings.json. You can try deleting entire indexedDB database and reloading the page.</span>
				{/if}
			</div>
			{:else if _tab == 'warning'}
			<div style="display:flex;flex-direction:column;align-items:center">
				<button class="button btn btn-warning" id = "deleteindexedDB" style="margin:10px" on:click={deleteLocalStorage}>Delete LocalStorage (/home/)</button>
				<button class="button btn btn-warning" id = "deleteindexedDB" style="margin:10px" on:click={deleteIndexDB}>Delete IndexedDB(/drive/)</button>
			</div>
			{/if}
		</main>
	</div>
</Window>

<style>
	div {
		background-color: #111928;
		width: 100%;
		height: 100%;
		padding: 10px;
	}
	body {
		background-color: #1a1a1a;
	}
	.timer-card {
		background-color: #2d2d2d;
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
	}
	.controls {
		margin-top: 1rem;
		display: flex;
		gap: 0.5rem;
	}
</style>

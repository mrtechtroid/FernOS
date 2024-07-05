<script>
    import {versionString} from "$lib/stores"
    import Window from "../ui-comps/Window.svelte";
    export let windowSettings = {
        windowTitle: "About Fern",
        windowIcon:"/apps/fern-resized.png",
        windowHeight:400,
        windowWidth:400,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"about_fern"
    }
    export let windowID = ""
    export let app_id = ""
    export let windowWebDefined = {
            windowHidden:"visible",
            disableMaximise:true,
            disableResize:false,
            currentZIndex:5,
    }
</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
	<div style="display:flex;flex-direction:column;align-items:center">
		<img src="/banner.png" />
		<center>Version {versionString}</center>
        <center>An Operating system right in your browser, with its own file system, suite of apps and games, built in Svelte.</center>
        <span style="font-size:12px"><a href = "https://github.com/mrtechtroid/fern">github</a>&nbsp;•&nbsp;<a href = "mailto:fern@mtt.one">fern@mtt.one</a>&nbsp;•&nbsp;<a href = "/credits.html">credits</a></span>
	</div>
</Window>
<style>
    div{
        background-color: #111928;
        width:100%;
        height:100%;
        padding:10px;
    }
</style>
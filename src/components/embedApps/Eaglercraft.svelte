<script>
    import Window from "../ui-comps/Window.svelte";
    import EmbeddableApp from "../ui-comps/EmbeddableApp.svelte";
    export let windowSettings = {
        windowTitle: "Eaglercraft",
        windowIcon:"https://eaglercraft.com/img/favicon.png",
        webURL:"https://eaglercraft.q13x.com/",
        windowHeight:360,
        windowWidth:720,
        windowLeft:0,
        windowTop:0,
        disableResize: true,
        disableMaximise: true,
        app_id:"ebd_eaglercraft",
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
    let acceptWarning = false;
</script>
{#if !acceptWarning}
<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
    <div style="width:100%;height:100%;color:black;font-size:20px;text-align:center;">
        <h1>Disclaimer</h1>
        <span>This app is NOT hosted by Fern, and hosted by third parties. Fern does not support or endorse anyone to play pirated copies of Minecraft. </span>
        <span>This application is referenced/used here as part of an Educational project in recreating an OS which can run on browser, and to simulate "games" playable on the OS. </span><br>
        <span style = "font-size:12px;">Request removal: <a href = "mailto:fern@mtt.one">fern@mtt.one</a> </span><br>
        <button on:click={function(){acceptWarning=true}} class = "btn">I Understand</button>
    </div>
</Window>
{:else}
<EmbeddableApp windowSettings={windowSettings} windowID = {windowID}>
</EmbeddableApp>
{/if}
<style>

</style>


<!-- https://eaglercraft.com/mc/1.8.8/ -->
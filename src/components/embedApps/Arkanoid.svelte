<script>
    import EmbeddableApp from "../ui-comps/EmbeddableApp.svelte";
    export let windowSettings = {
        windowTitle: "Arkanoid",
        windowIcon:"https://play.arkanoid.online/favicon.ico",
        webURL:"https://play.arkanoid.online/",
        windowHeight:500,
        windowWidth:500,
        windowLeft:0,
        windowTop:0,
        disableResize: true,
        disableMaximise: true,
        app_id:"ebd_browserling",
        filePath:"",
    }
    export let windowID = ""
</script>

<EmbeddableApp windowSettings={windowSettings} windowID = {windowID}>
</EmbeddableApp>
<style>
    div{
        background-color: #111928;
        width:100%;
        height:100%;
        padding:10px;
    }
</style>
<script>
    import EmbeddableApp from "../ui-comps/EmbeddableApp.svelte";
    export let windowSettings = {
        windowTitle: "Tetris",
        windowIcon:"https://www.lumpty.com/amusements/Games/Tetris/shareIcons/web-app-icon-android.png",
        webURL:"https://www.lumpty.com/amusements/Games/Tetris/tetris.html",
        windowHeight:580,
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
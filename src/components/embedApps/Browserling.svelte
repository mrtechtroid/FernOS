<script>
    import EmbeddableApp from "../ui-comps/EmbeddableApp.svelte";
    export let windowSettings = {
        windowTitle: "Browserling",
        windowIcon:"https://www.browserling.com/favicon.ico",
        webURL:"https://www.browserling.com/browse/win7/chrome109/google.com",
        windowHeight:465,
        windowWidth:752,
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
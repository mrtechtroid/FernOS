<script>
    import EmbeddableApp from "../ui-comps/EmbeddableApp.svelte";
    export let windowSettings = {
        windowTitle: "Photopea",
        windowIcon:"https://www.photopea.com/promo/icon512.png",
        webURL:"https://www.photopea.com/",
        windowHeight:480,
        windowWidth:870,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"ebd_photopea",
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
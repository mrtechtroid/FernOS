<script>
    import Window from "../ui-comps/Window.svelte";
    export let windowSettings = {
        windowTitle: "Embeddable App",
        windowIcon:"/apps/fern-resized.png",
        webURL:"https://mtt.one/",
        windowHeight:400,
        windowWidth:400,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"ebd_about"
    }
    export let windowID = ""
    export let app_id = ""
    export let windowWebDefined = {
            windowHidden:"visible",
            disableMaximise:true,
            disableResize:false,
            currentZIndex:5,
    }
    let embedApp;
    function focusScreen(){
        function _(){embedApp.contentWindow.focus()}
        setTimeout(_, 100);
    }

</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
	<iframe sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts" referrerpolicy="no-referrer" bind:this = {embedApp}  id = {"iframe_"+windowID} src = {windowSettings.webURL} frameborder="0" style="width:100%;height:100%;" allowfullscreen on:load={focusScreen} on:click={focusScreen}></iframe>
</Window>
<style>
    div{
        background-color: #111928;
        width:100%;
        height:100%;
        padding:10px;
    }
</style>
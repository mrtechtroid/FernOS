<script>
	import { onDestroy, onMount } from "svelte";
    import Window from "../ui-comps/Window.svelte";
    import {storeFE} from "$lib/stores"
    export let windowSettings = {
        windowTitle: "Devtools",
        windowIcon:"/apps/devtools.png",
        windowHeight:410,
        windowWidth:720,
        windowLeft:0,
        windowTop:0,
        disableResize: true,
        disableMaximise: true,
        app_id:"sys_devtools"
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
    let eruda;
    let OP_STATUS_;
    const unsubscribe2 = storeFE.subscribe((value) => {
        OP_STATUS_ = value;
    });
    let err = false;
    onMount(async ()=>{
        let appList = OP_STATUS_.windows
        for (let i =0;i<appList.length;i++){
            if (appList[i].app_id == "sys_devtools" && appList[i].windowID == windowID){
                break;
            }
            if (appList[i].app_id == "sys_devtools" && appList[i].windowID!=windowID){
                err = true
                return
            }
        }
        eruda = (await import('eruda')).default
        const el = document.createElement('div');
document.getElementById("devtools_eruda").appendChild(el);

eruda.init({
    container: el,
    autoScale: true,
    tool: ['console', 'elements','network','sources'],
  defaults: {
    displaySize: 100,
    theme: "Monokai Pro",
    transparency: 0,
  },
  useShadowDom: false,

});
    })
    onDestroy(()=>{
        try{
            eruda.destroy();
        }catch(e){

        }
    })
</script>

<Window {...windowSettings} {...windowWebDefined} {windowID}>
    {#if err}
        <span style="color:black">Devtools can be opened in only one window at a time.</span>
    {:else}
    <div style="width: 100%;height:100%" id = "devtools_eruda"></div>
    <div class = "eruda-container eruda-entry-btn"><div class="eruda-dev-tools"><div class="eruda-nav-bar-container"><div class="eruda-nav-bar"></div></div></div></div>
    {/if}
</Window>
<style>
    :global(.eruda-container) {
    position: relative !important;
    z-index: 1 !important;
    }

    :global(.eruda-container .eruda-dev-tools) {
      height: 100% !important;
      opacity: 100% !important;
      display:block !important;
    }
    :global(.eruda-container .eruda-dev-tools .eruda-nav-bar-container .eruda-nav-bar){
        overflow: hidden;
    }
    :global(.eruda-entry-btn) {
      display: none;
    }
</style>
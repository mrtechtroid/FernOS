<script>
    import { onMount } from "svelte";
    import fs from "@zenfs/core";
    import {storeFE,windowActions} from "$lib/stores"
	import NavBar from "../navbar/NavBar.svelte";
    import Window from "../ui-comps/Window.svelte"
    import AppRender from "../ui-comps/AppRender.svelte";
    let OP_STATUS;
    const unsubscribe = storeFE.subscribe((value) => {
        OP_STATUS = value;
    });
    let initSettings;
    onMount(() => {

    })
    const unsubscribe2 = windowActions.subscribe((value)=>{
        checkAction(value);
    })
    function check_login(e){
        if (!e){return}
        try{
            // console.log(fs.readdirSync('/'))
            initSettings = JSON.parse(fs.readFileSync('/home/settings.txt', 'utf-8'));
            changeBackground()
            // console.log(initSettings,initSettings?.background?.mainscreen?.imgLocation)
            
            // console.log("a")
        }catch(e){
            // console.log(e)
        }
    }
    function checkAction(actions){
        let t = actions.find(x=>x.windowID == "dashboard")
        // console.log(t)
        if (t!=undefined){
            if (t.action == "background_change"){
                initSettings = JSON.parse(fs.readFileSync('/home/settings.txt', 'utf-8'))
                changeBackground()
            }
            $windowActions = actions.filter(e => e !== t)
        }
    }
    $:check_login(OP_STATUS.fileSysSetup);
    $:changeBackground(dboard)
    let dboard;
    function changeBackground(){
        if (dboard!=undefined){
            dboard.style.backgroundImage = ""
            dboard.style.background = ""
            dboard.style.backgroundColor = ""
            if (initSettings?.background?.mainscreen?.type == "default"){
                dboard.style.backgroundImage = "url('pxfuel.jpg')"
            }else if (initSettings?.background?.mainscreen?.type == "color"){
                dboard.style.backgroundColor = initSettings?.background?.mainscreen?.color || "#ff0000"
                console.log("color")
            }else if (initSettings?.background?.mainscreen?.type == "url_img"){
                dboard.style.backgroundImage = "url('"+initSettings?.background?.mainscreen?.imgLocation+"')"
            }
            
        };
    }

</script>
<div id = "dashboard" bind:this = {dboard}>
    <AppRender/>
</div>
<NavBar></NavBar>
<style>
    #dashboard{
        /* display: flex; */
		position: relative;
		z-index: 7;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
        z-index:3;
        background-size: cover;
    }
</style>
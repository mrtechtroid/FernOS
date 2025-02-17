<script>
	import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import {storeFE,windowActions} from "$lib/stores"
	import Draggable from "./Draggable.svelte";

    export let windowID = ""
    export let windowTitle = "New Window"
    export let windowIcon = "/app/fern-resized.png"
    export let windowHeight = 400
    export let windowWidth = 400
    export let windowLeft = 0
    export let windowTop = 0
    export let windowHidden = "visible"
    export let disableMaximise = true;
    export let disableResize = false;
    export let currentZIndex = 5;
    export let app_id = "default";
    export let Window_
    export let windowMaximised = false;
    let OP_STATUS;
    onMount(()=>{
        // console.log("added win")
        currentZIndex=OP_STATUS.currZIndex+1;
        $storeFE.currZIndex +=1
        // console.log(windowID);
    })
    // $: $storeFE.windows.find(x => x.windowID === windowID).windowInfo = {windowID:windowID,windowTitle:windowTitle,windowIcon:windowIcon,windowHeight:windowHeight,windowTop:windowTop,windowWidth:windowWidth,windowLeft:windowLeft,};
    // $: console.log(OP_STATUS)
    // $: console.log(windowID);
    const unsubscribe = storeFE.subscribe((value) => {
        OP_STATUS = value;
    });
    const unsubscribe2 = windowActions.subscribe((value)=>{
        checkAction(value);
    })
	let moving = false;
	function checkAction(actions){
        // console.log("e",OP_STATUS.windowActions)
        let t = actions.find(x=>x.windowID == windowID)
        // console.log(t)
        if (t!=undefined){
            if (t.action == "visible_me"){
                if (windowHidden=="visible"){
                    windowHidden = "hidden"
                }else{
                    windowHidden = "visible"
                }
                // windowHidden = "visible"
                changeZ()
            }
            $windowActions = actions.filter(e => e !== t)
        }
        if ($windowActions.find(x=>x.windowID == windowID) != undefined){
            checkAction();
        }
    }

	function onMouseDown() {
		moving = true;
	}
	
	function onMouseMove(e) {
		if (moving) {
			windowLeft += e.movementX;
			windowTop += e.movementY;
		}
	}
	
	function onMouseUp() {
		moving = false;
	}
    // $: console.log(windowHidden)
    function minimizeSelf(){
        windowHidden = "hidden";
        // Window_.style.visibility = "hidden"
    }
    function maximizeSelf(){
        windowMaximised = !windowMaximised
    }
    function removeWindow(){
        // console.log(Window_,windowID,OP_STATUS.windows.filter(window=> window.windowID !== windowID))
        storeFE.update((val)=>{return {...val, windows:OP_STATUS.windows.filter(window=> window.windowID !== windowID)}})
    }
    function changeZ(){
        currentZIndex=OP_STATUS.currZIndex+1;
        $storeFE.currZIndex +=1
    }
</script>
<Draggable disableResize={disableResize} windowMaximised = {windowMaximised} windowHeight={windowHeight} windowLeft={windowLeft} windowTop={windowTop} windowWidth={windowWidth} windowHidden = {windowHidden}>
<div transition:fade={{ delay: 100, duration: 100 }} on:click={changeZ} on:mousedown={changeZ} bind:this={Window_} id = {windowID} class = "window" style="z-index: {currentZIndex};height: 100%;width:100%;visibility:{windowHidden};">
    <div id = {"nav_"+windowID} class="window_nav" on:mousedown={onMouseDown}>
        <div style="display: flex;flex-direction:row;align-items:center;">
            <img src= {windowIcon} style="width:25px;height:25px;margin-right:3px;">
            <span>{windowTitle}</span>
        </div>
        <div class = "closeBar" style="display: flex;flex-direction:row;align-items:center;width:80px;justify-content:space-around">
            <button class="material-symbols-rounded" on:click={minimizeSelf}>minimize</button>
            {#if !disableMaximise}
            <button class="material-symbols-rounded" on:click={maximizeSelf}>check_box_outline_blank</button>
            {/if}
            <button class="material-symbols-rounded" on:click={removeWindow}>close</button>
        </div>
    </div>
    <div class="window_content">
        <slot/>
    </div>
</div>
</Draggable>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />
<style>
    .window{
        background-color: #111928;
        border-radius: 10px;
        position:absolute;
        top:0px;
        left:0px;
        flex-flow: column;
    }
    .window_nav{
        width:100%;
        height:40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding:10px;
        justify-content: space-between;
        user-select: none;
		cursor: move;
        flex: 0 1 40px;
    }
    .window_content{
        width:100%;
        height:calc(100% - 40px);
        background-color: aliceblue;
        border-radius:0px 0px 10px 10px;
        flex: 1 1 auto;
        overflow:hidden;
    }
    .closeBar button:hover{
        color:aqua;
    }
</style>
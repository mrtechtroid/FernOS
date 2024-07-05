<script>
    import { onMount } from "svelte";
    import fs from "@zenfs/core";
    import { fade } from 'svelte/transition';
    import {storeFE,appListDisplay} from "$lib/stores"
	import Tooltip from "./Tooltip.svelte";
    let OP_STATUS;
    const unsubscribe = storeFE.subscribe((value) => {
        OP_STATUS = value;
    });
    let initSettings;
    function newApp(app_id){
        $storeFE.windows[$storeFE.windows.length] = {app_id:app_id,windowID:"window"+parseInt(Math.random()*1000)}
        $appListDisplay = "none"
    }
    function check_login(e){
        try{
            // console.log(fs.readdirSync('/'))
            initSettings = JSON.parse(fs.readFileSync('/home/settings.txt', 'utf-8'));
            // console.log(initSettings)
        }catch(e){

        }
    }
    function countListed(){
        let count = 0;
        for (let i = 0;i<OP_STATUS.appList.length;i++){
            if (OP_STATUS.appList[i].listed){
                count+=1
            }
        }
        return count;
    }
    $:if (OP_STATUS.fileSysSetup){check_login()};
    // export let appListDisplay = "none"
</script>
<div id = "applist" style="display: {$appListDisplay}" transition:fade={{ delay: 200, duration: 200 }} >
    <div id = "app_bars" style="grid-template-rows:repeat({parseInt(countListed()/3)},90px)">
        {#each OP_STATUS.appList as app (app.app_id)}
            {#if app.listed}
            <div id = {"aL_"+app.app_id} on:click={function(){newApp(app.app_id)}} class = "btn" style="width: 90px;height:90px;display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:center;flex-wrap:nowrap;">
                <div class="w-10 rounded-full">
                    <img src={app.info.windowIcon} />
                  </div>
                <span>{app.info.windowTitle}</span>
            </div>
            {/if}
        {/each}
    </div>
    <div id = "log_btn" style="display:flex; flex-direction:row;align-items:center;background-color: #1b2431;justify-content:space-between;height:70px">
        <div class = 'btn' style="display:flex;flex-direction:row;align-items:center;width:max-content;margin:10px;">
            <div class="avatar" style="padding:10px;">
                <div class="w-8 rounded-full">
                  <img src={initSettings?.accountdetails?.profilePicture} />
                </div>
            </div>
            <span>{initSettings?.accountdetails?.name}</span>
        </div>
        <a style="width:70px;margin:10px;" class = "btn" href = "/" data-sveltekit-reload>
            Logout
        </a>
    </div>
</div>

<style>
    #applist{
        position:fixed;
        bottom: calc(10px + 4rem);
        width: 400px;
        background-color: #111928;
        border-radius: 10px;
        height: 500px;
        left:15px;
        z-index:100;
        overflow:hidden;
        flex-direction:column;
    }
    #app_bars{
        height:430px;
        display:grid;
        gap:10px 10px;
        grid-template-columns: 90px 90px 90px;
        padding:10px;
        margin:10px;
        margin-bottom:0px;
        padding-bottom:0px;
        justify-content: center;
        overflow-y: scroll;
    }
</style>
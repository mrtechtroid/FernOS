<script>
    import { onMount } from "svelte";
    import fs from "@zenfs/core";
    import {storeFE} from "$lib/stores"
    let OP_STATUS;
    const unsubscribe = storeFE.subscribe((value) => {
        OP_STATUS = value;
    });
    let time = new Date();
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December",];
    function aZero(n) {
        return n.toString().length == 1 ?  n = '0' + n: n;
    }
    $: hours = aZero(time.getHours());
	$: minutes = aZero(time.getMinutes());
    $: day = days[time.getDay()];
    $: month = months[time.getMonth()];
    $: day_ = aZero(time.getDate());
    let initSettings;
    onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);
		return () => {
			clearInterval(interval);
		};
        
	});
    function check_login(e){
        try{
            // console.log(fs.readdirSync('/'))
            initSettings = JSON.parse(fs.readFileSync('/home/settings.txt', 'utf-8'));
            // console.log(initSettings)
        }catch(e){

        }
    }
    $:if (OP_STATUS.fileSysSetup){check_login()};
    function onKeyDown(e) {
		 switch(e.keyCode) {
            case 13: loaded();break;
         }
    }
    function loaded(){
        document.getElementById("loading").style.animation = "load-remove 1s 1"
        document.getElementById("loading").style.display = "none"
        document.getElementById("loadNext").style.display = "flex"
    }
    let user_pass;
    let err_txt = "";
    function validateUser(){
        if (user_pass == initSettings?.accountdetails?.password){
            // $storeFE.currentStatus = "dashboard"
            storeFE.update((val)=>{return {...val, currentStatus:"dashboard"}})
            err_txt = ""
        }else{
            err_txt = "Invalid Password"
        }
    }
</script>
<div id="e31">
	<div id="loading" class="loaded" on:click={loaded}>
		<div style="height:60vh;width:30vw;min-width:300px;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <h1 class="text-7xl font-bold" style="padding-bottom:20px;">{hours}:{minutes}</h1>
            <h1 class="text-xl font-bold" style="padding-bottom:20px;">{day}, {month} {day_}</h1>
        </div>
	</div>
    <div id = "loadNext" style="display: none;" class="backdrop">
        <div style="height:60vh;width:30vw;min-width:300px;display:flex;flex-direction:column;align-items:center;">
            <div class="avatar" style="padding:10px;">
                <div class="w-32 rounded-full">
                  <img src={initSettings?.accountdetails?.profilePicture} />
                </div>
            </div>
            <h1 class="text-2xl font-bold" style="padding-bottom:20px;">{initSettings?.accountdetails?.name}</h1>
            <div style="display: flex;flex-direction:row">

            
            <label class="input input-bordered flex items-center gap-2" style="margin-bottom:10px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" /></svg>
                <input type="password" class="grow" bind:value={user_pass}/>
            </label>
            <button class = "btn" style="padding:10px;" on:click = {validateUser}>»</button>
            
            </div>
            {#if err_txt != ""}
                <span>Incorrect Password</span>
                <span style="max-width: 60%;">Hint: {initSettings?.accountdetails?.passwordHint}</span>
            {/if}
        </div>
    </div>
</div>

<!-- document.getElementById("loading").style.animation = "load-remove 1s 1" -->

<style>
    .backdrop{
        background: rgba(0,0,0, 0.2);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(5px);
border: 1px solid rgba(0,0,0, 0.3);
    }
	@keyframes load-remove {
		from {
			top: 0vh;
		}
		to {
			top: -100vh;
			display: none;
		}
	}
    #loadNext{
        z-index:1;
    }
	#e31 {
		animation-fill-mode: both !important;
		background-image: url('$img/pexels-elias-tigiser-411757-2757549.jpg');
		background-size: cover;
        width:100vw;
        height:100vh;
        position: fixed;
		top: 0;
		left: 0;
	}
	.loaded {
		animation: '';
		background: transparent;
		display: flex;
		position: fixed;
		z-index: 7;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
        z-index:3;
	}
    #loadNext{
        animation: '';
		background: transparent;
		display: flex;
		position: fixed;
		z-index: 7;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
        z-index:3;
    }
    .card {
    backdrop-filter: blur(25px) saturate(153%);
    -webkit-backdrop-filter: blur(25px) saturate(153%);
    background-color: rgba(17, 25, 40, 1);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
    }
</style>

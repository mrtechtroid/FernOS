<script>
	import { onMount } from 'svelte';
	let time = new Date();
    import Tooltip from '../ui-comps/Tooltip.svelte';
	import {storeFE,windowActions,appListDisplay} from "$lib/stores";
	import AppList from '../ui-comps/AppList.svelte';
	import AppRender from '../ui-comps/AppRender.svelte';
	import Calendar from '../ui-comps/Calendar.svelte';
	let OP_STATUS_;
    const unsubscribe2 = storeFE.subscribe((value) => {
        OP_STATUS_ = value;
    });
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	function aZero(n) {
		return n.toString().length == 1 ? (n = '0' + n) : n;
	}
	$: hours = aZero(time.getHours());
	$: minutes = aZero(time.getMinutes());
	$: seconds = aZero(time.getSeconds());
	$: day = days[time.getDay()];
	$: month = months[time.getMonth()];
	$: day_ = aZero(time.getDate());
	let initSettings;
	let onlineStatus = false;
	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);
		onlineStatus = window.navigator.onLine;
		window.addEventListener('online', () => (onlineStatus = true));
		window.addEventListener('offline', () => (onlineStatus = false));
		if (typeof navigator.getBattery != undefined){
		navigator.getBattery().then((battery) => {
			function updateAllBatteryInfo() {
				updateChargeInfo();
				updateLevelInfo();
			}
			updateAllBatteryInfo();

			battery.addEventListener('chargingchange', () => {
				updateChargeInfo();
			});

			function updateChargeInfo() {
				bt.charging = battery.charging;
			}

			battery.addEventListener('levelchange', () => {
				updateLevelInfo();
			});
			function updateLevelInfo() {
				bt.level = battery.level * 100;
			}
		});
		}else{
			bt.level = 0
			bt.charging= false
		}
		
		return () => {
			clearInterval(interval);
		};
		
	});
	function getConfig(app_id){
		// console.log(OP_STATUS_.appList.find(x => x.app_id === app_id))
		return OP_STATUS_.appList.find(x => x.app_id === app_id).info;
	}
	let bt = { charging: false, level: 0 };
	// $: console.log(OP_STATUS_.windows)
	function visibleMe(winID){
		$windowActions.push({windowID:winID,action:"visible_me"})
		$windowActions = $windowActions
		// console.log(OP_STATUS_.windowActions)
	}
	function addAppList(){
		let f = $appListDisplay
		if (f== "flex"){
			$appListDisplay = "none"
		}else{
			$appListDisplay = "flex"
		}
	}
	let show_calendar = false;
	function showCalendar(){
		show_calendar = !show_calendar
	}
</script>
<AppList/>
<div id="navbar">
    <Tooltip tip = "Apps" top>
	<button id="menu" class="btn btn-square btn-accent" style="border:10px;width:5vw;">
		<span class="material-symbols-rounded" on:click={addAppList}> apps </span>
	</button>
    </Tooltip>
	<div style="max-width:80vw;width:80vw;display:flex;flex-direction:row;overflow:hidden;" id="taskbar">
		{#each OP_STATUS_?.windows as window (window.windowID)}
			<div class = "btn" id = {"tb_"+window.windowID} on:click = {function(){visibleMe(window.windowID)}} style="display:flex;flex-direction:row; width:10vw;justify-content:space-between;align-items:center;flex-wrap:nowrap;margin:10px;">
				<img style = "width:24px;height:24px;" src = {getConfig(window.app_id).windowIcon}/>
				<div style="width:8vw">
					{getConfig(window.app_id).windowTitle}
				</div>
			</div>
		{/each}
	</div>
	<div
		id="sys_tray"
		style="width:10vw;display:flex;flex-direction:row;justify-content:space-around;align-items:center"
	>
        <Tooltip tip = {onlineStatus?"Online":"Offline"} top>
		<span id="battery_status" style="width:20px;height:20px;overflow:hidden" class="material-symbols-rounded">
			{#if onlineStatus}
				signal_wifi_4_bar
			{:else}
				signal_wifi_bad
			{/if}
		</span>
        </Tooltip>
		<Tooltip tip = {"Battery Level: "+bt?.level+"%"} top>
		<span id="battery_status" style="width:20px;height:20px;overflow:hidden" class="material-symbols-rounded" title={bt.level}>
			{#if bt.charging && bt.level > 50}
				battery_charging_full
			{:else if bt.charging && bt.level <= 50}
				battery_charging_50
			{:else if !bt.charging && bt.level > 50}
				battery_5_bar
			{:else if !bt.charging && bt.level <= 50}
				battery_3_bar
			{:else}
				battery_unknown
			{/if}
		</span>
		</Tooltip>
		{#if show_calendar}
			<Calendar/>
		{/if}
		<button on:click = {showCalendar}>
			<div style="display: flex;flex-direction:column;text-align:right;">
				<span style="font-size:14px;">{hours}:{minutes}</span>
				<span style="font-size:14px;color:grey">{day_}/{time.getMonth()}/{time.getFullYear()}</span>
			</div>
		</button>
	</div>
</div>

<style>
	#navbar {
		position: fixed;
		bottom: 10px;
		height: 3.5rem;
		/* background-color: red; */
		width: 98vw;
		margin: auto;
		left: 50%;
		transform: translate(-50%, 0);
		border-radius: 10px;
		backdrop-filter: blur(25px) saturate(153%);
		-webkit-backdrop-filter: blur(25px) saturate(153%);
		background-color: rgba(17, 25, 40, 1);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.125);
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-around;
        z-index:3
	}
    .card {
    backdrop-filter: blur(25px) saturate(153%);
    -webkit-backdrop-filter: blur(25px) saturate(153%);
    background-color: rgba(17, 25, 40, 1);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
    }

    @media screen and (max-width: 1100px){
        #taskbar{
            max-width: 60vw !important;
            min-width:300px;
            width:300px !important;
        }
    }
</style>

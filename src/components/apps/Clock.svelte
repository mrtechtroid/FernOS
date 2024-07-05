<script>
	import Window from '../ui-comps/Window.svelte';
	import { onMount } from 'svelte';
	export let windowSettings = {
		windowTitle: 'Clock',
		windowIcon: '/apps/clock.png',
		windowHeight: 400,
		windowWidth: 620,
		windowLeft: 0,
		windowTop: 0,
		disableResize: false,
		disableMaximise: false,
		app_id: 'sys_clock'
	};
	export let windowID = '';
	export let app_id = '';
	export let windowWebDefined = {
		windowHidden: 'visible',
		disableMaximise: true,
		disableResize: false,
		currentZIndex: 5
	};

	let _tab = 'clock';
	let time = new Date();
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
	let timezone = new Date().toTimeString().slice(9);
	let initSettings;
	let stop_m = aZero(0),
		stop_s = aZero(0),
		stop_ms = aZero(0);
	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});

	let stopwatch_state = 'inactive'; /* active/paused/inactive */
	let stopwatch_interval;
	let stopwatch_time = 0;
	let stopwatch_laps = [];
	function manageStopwatch(state, interval) {
		if (state == 'active') {
			stopwatch_interval = setInterval(function () {
				stopwatch_time += 1;
			});
		} else if (state == 'paused') {
			clearInterval(stopwatch_interval);
		} else {
			stopwatch_time = 0;
			clearInterval(stopwatch_interval);
            stopwatch_laps = []
		}
	}
    function lap(){
        stopwatch_laps.push(stopwatch_time);
        stopwatch_laps = stopwatch_laps
    }
    function formatTime(time){
        return aZero(Math.floor(time / 6000)) + ":"+ aZero(Math.floor(time / 100))+"."+aZero(time % 100)
    }
	$: manageStopwatch(stopwatch_state, stopwatch_interval);
    $: console.log(stopwatch_laps)
</script>

<Window {...windowSettings} {...windowWebDefined} {windowID}>
	<div class="flex h-screen">
		<aside class="w-1/6flex flex-col items-center py-6" style="width:30px;">
			<div class="flex flex-col items-center space-y-6">
				<button
					class="text-xl material-symbols-rounded"
					on:click={function () {
						_tab = 'clock';
					}}>public</button
				>
				<button
					class="text-xl material-symbols-rounded"
					on:click={function () {
						_tab = 'stopwatch';
					}}>timer_5</button
				>
				<!-- <button class="text-xl material-symbols-rounded" on:click={function(){_tab = "timer"}}>hourglass_bottom</button> -->
				<!-- <button class="text-xl material-symbols-rounded" on:click={function(){_tab = "alarm"}}>alarm</button> -->
			</div>
		</aside>
		<main
			class="flex-1 p-6 flex flex-column gap-6"
			style="align-items: center;justify-center:center;"
		>
			{#if _tab == 'timer'}
				<div class="timer-card">
					<div class="text-lg mb-4">1 min</div>
					<div class="circle">
						<div class="text-2xl">00:01:00</div>
					</div>
					<div class="controls">
						<button class="bg-blue-500 p-2 rounded">&#9654;</button>
						<button class="bg-gray-600 p-2 rounded">&#8635;</button>
					</div>
				</div>
				<div class="timer-card">
					<div class="text-lg mb-4">3 min</div>
					<div class="circle">
						<div class="text-2xl">00:03:00</div>
					</div>
					<div class="controls">
						<button class="bg-blue-500 p-2 rounded">&#9654;</button>
						<button class="bg-gray-600 p-2 rounded">&#8635;</button>
					</div>
				</div>
				<div class="timer-card">
					<div class="text-lg mb-4">5 min</div>
					<div class="circle">
						<div class="text-2xl">00:05:00</div>
					</div>
					<div class="controls">
						<button class="bg-blue-500 p-2 rounded">&#9654;</button>
						<button class="bg-gray-600 p-2 rounded">&#8635;</button>
					</div>
				</div>
				<div class="timer-card">
					<div class="text-lg mb-4">10 min</div>
					<div class="circle">
						<div class="text-2xl">00:10:00</div>
					</div>
					<div class="controls">
						<button class="bg-blue-500 p-2 rounded">&#9654;</button>
						<button class="bg-gray-600 p-2 rounded">&#8635;</button>
					</div>
				</div>
			{:else if _tab == 'clock'}
				<div style="min-width:300px;display:flex;flex-direction:column;align-items:center;">
					<h1 class="text-7xl font-bold" style="padding-bottom:20px;">
						{hours}:{minutes}:{seconds}
					</h1>
					<h1 class="text-xl font-bold" style="padding-bottom:5px;">{day}, {month} {day_}</h1>
					<h1 class="text-l font-bold" style="padding-bottom:20px">{timezone}</h1>
				</div>
			{:else if _tab == 'stopwatch'}
				<div
					style="min-width:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;"
				>
					<h1 class="text-7xl font-bold" style="padding-bottom:20px;">
						{aZero(Math.floor(stopwatch_time / 6000))}:{aZero(
							Math.floor(stopwatch_time / 100)
						)}.{aZero(stopwatch_time % 100)}
					</h1>
					<div
						style="display: flex;flex-direction:row;justify-content:center;width:200px;align-content:center;height:100px;"
					>
						{#if stopwatch_state == 'inactive' || stopwatch_state == 'paused'}
							<button
								class="btn btn-primary material-symbols-rounded text-3xl"
								on:click={function () {
									stopwatch_state = 'active';
								}}>play_circle</button
							>
						{:else}
							<button
								class="btn btn-primary material-symbols-rounded text-3xl"
								on:click={function () {
									stopwatch_state = 'paused';
								}}>pause_circle</button
							>
						{/if}
						<button
							class="btn btn-primary material-symbols-rounded text-3xl"
							on:click={lap}>flag</button
						>
						<button
							class="btn btn-error material-symbols-rounded text-3xl"
							on:click={function () {
								stopwatch_state = 'inactive';
							}}>stop_circle</button
						>
					</div>
				</div>
				<!-- {#if stopwatch_laps?.length > 0} -->
					<div class="overflow-x-auto">
						<table class="table">
							<!-- head -->
							<thead>
								<tr>
									<th>No. </th>
									<th>Time</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
								{#each stopwatch_laps as ele, i (i)}
									<tr>
										<th>{i + 1}</th>
										<td>{formatTime(i >= 1 ? stopwatch_laps[i] - stopwatch_laps[i - 1] : stopwatch_laps[i])}</td>
										<td>{formatTime(ele)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				<!-- {/if} -->
			{/if}
		</main>
	</div>
</Window>

<style>
	div {
		background-color: #111928;
		width: 100%;
		height: 100%;
		padding: 10px;
	}
	body {
		background-color: #1a1a1a;
	}
	.timer-card {
		background-color: #2d2d2d;
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
	}
	.controls {
		margin-top: 1rem;
		display: flex;
		gap: 0.5rem;
	}
</style>

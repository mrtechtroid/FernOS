<script>
	// Attribution: Adapted from https://codepen.io/onclick_indo/pen/KLyMdo
	import { onMount } from 'svelte';

	function generate_year_range(start, end) {
		let years = '';
		for (let year = start; year <= end; year++) {
			years += "<option value='" + year + "'>" + year + '</option>';
		}
		return years;
	}
	let today = new Date();
	let currentMonth = today.getMonth();
	let currentYear = today.getFullYear();
	let selectYear;
	let selectMonth;
	let createYear = generate_year_range(1970, 2050);
	let calendar;
	let months = '';
	let days = '';
	let thead_month;
	let monthAndYear;
	let tbl;
	let monthDefault = [
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

	let dayDefault = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	let dataHead = '<tr>';
	for (let dhead in dayDefault) {
		dataHead += "<th data-days='" + dayDefault[dhead] + "'>" + dayDefault[dhead] + '</th>';
	}
	dataHead += '</tr>';

	function next() {
		currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
		currentMonth = (currentMonth + 1) % 12;
		showCalendar(currentMonth, currentYear);
	}

	function previous() {
		currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
		currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		showCalendar(currentMonth, currentYear);
	}

	function jump() {
		currentYear = parseInt(selectYear.value);
		currentMonth = parseInt(selectMonth.value);
		showCalendar(currentMonth, currentYear);
	}

	function daysInMonth(iMonth, iYear) {
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}
	function aZero(n) {
        return n.toString().length == 1 ?  n = '0' + n: n;
    }
	function showCalendar(month, year) {
			let firstDay = new Date(year, month).getDay();

			tbl.innerHTML = '';

			monthAndYear.innerHTML = monthDefault[month] + ' ' + year;
			selectYear.value = year;
			selectMonth.value = month;

			// creating all cells
			let date = 1;
			for (let i = 0; i < 6; i++) {
				let row = document.createElement('tr');

				for (let j = 0; j < 7; j++) {
					if (i === 0 && j < firstDay) {
						let cell = document.createElement('td');
						let cellText = document.createTextNode('');
						cell.appendChild(cellText);
						row.appendChild(cell);
					} else if (date > daysInMonth(month, year)) {
						break;
					} else {
						let cell = document.createElement('td');
						cell.setAttribute('data-date', date);
						cell.setAttribute('data-month', month + 1);
						cell.setAttribute('data-year', year);
						cell.setAttribute('data-month_name', monthDefault[month]);
						cell.className = 'date-picker';
						cell.innerHTML = aZero(date);

						if (
							date === today.getDate() &&
							year === today.getFullYear() &&
							month === today.getMonth()
						) {
							cell.className = 'date-picker';
							cell.style.color = "#99eccb"
							cell.style.textDecoration = "underline"
						}
						row.appendChild(cell);
						date++;
					}
				}

				tbl.appendChild(row);
			}
		}
	onMount(() => {
		selectYear.innerHTML = createYear;
		thead_month.innerHTML = dataHead;
		showCalendar(currentMonth, currentYear);
	});
</script>

<div id="over_calendar" bind:this={calendar}>
		<div class="container-calendar">
			<div class="button-container-calendar">
				<button id="previous" on:click={previous}>&#8249;</button>&nbsp;&nbsp;
				<span bind:this={monthAndYear} id="monthAndYear"></span>&nbsp;&nbsp;
				<button id="next" on:click={next}>&#8250;</button>
			</div>

			<table class="table-calendar" id="calendar" data-lang="en">
				<thead id="thead-month" bind:this={thead_month}></thead>
				<tbody id="calendar-body" bind:this={tbl}></tbody>
			</table>

			<div class="footer-container-calendar">
				<label for="month">Jump To: </label>
				<select id="month" on:change={jump} bind:this={selectMonth}>
					<option value="0">Jan</option>
					<option value="1">Feb</option>
					<option value="2">Mar</option>
					<option value="3">Apr</option>
					<option value="4">May</option>
					<option value="5">Jun</option>
					<option value="6">Jul</option>
					<option value="7">Aug</option>
					<option value="8">Sep</option>
					<option value="9">Oct</option>
					<option value="10">Nov</option>
					<option value="11">Dec</option>
				</select>
				<select id="year" on:change={jump} bind:this={selectYear}></select>
			</div>
		</div>
		<div style = "display:none;" class = 'wrapper selected table-calendar date-picker'><table><tr><th></th></tr><tr><td></td></tr></table></div>
</div>

<style>
	#over_calendar {
		position: fixed;
		bottom: calc(10px + 4rem);
		width: 400px;
		background-color: #111928;
		border-radius: 10px;
		height: 320px;
		right: 5px;
		z-index: 100;
		overflow: hidden;
		flex-direction: column;
		color: #dadada !important;
		font-family: sans-serif;
		font-size: 15px;
		line-height: 1.4;
		color: #444;
		margin: 0;
		font-size: 1em;
		text-align: center;
	}
	.wrapper {
		margin: 15px auto;
		width: 400px;
		height: 420px;
	}

	.container-calendar {
		/* background: #ffffff; */
		padding: 15px;
		/* max-width: 475px; */
		margin: 0 auto;
		overflow: auto;
		height:100%;
		width:100%;
		display:flex;
		flex-direction:column;
		align-items: center;

	}
	.selected{
		color:red !important;
	}
	.button-container-calendar button {
		cursor: pointer;
		display: inline-block;
		zoom: 1;
		background: #99eccb;
		color: #000;
		border: 1px solid #0aa2b5;
		border-radius: 4px;
		padding: 5px 10px;
	}

	.table-calendar {
		border-collapse: collapse;
		width: 100%;
		table-layout: fixed;
	}

	.table-calendar td,
	.table-calendar th {
		padding: 5px;
		border: 1px solid #e2e2e2;
		text-align: center;
		vertical-align: top;
	}

	.date-picker.selected {
		font-weight: bold;
		outline: 1px dashed #99eccb;
	}

	/* sunday */
	.date-picker:nth-child(1) {
		color: red;
	}

	/* friday */
	.date-picker:nth-child(6) {
		color: green;
	}

	#monthAndYear {
		text-align: center;
		margin-top: 0;
	}
	td{
		text-align: center;
	}
	td:hover{
		color:#00a2b7;
	}
	.button-container-calendar {
		position: relative;
		margin-bottom: 1em;
		overflow: hidden;
		clear: both;
	}

	#previous {
		float: left;
	}

	#next {
		float: right;
	}

	.footer-container-calendar {
		margin-top: 1em;
		border-top: 1px solid #dadada;
		padding: 10px 0;
	}

	.footer-container-calendar select {
		cursor: pointer;
		display: inline-block;
		zoom: 1;
		background: #ffffff;
		color: #585858;
		border: 1px solid #bfc5c5;
		border-radius: 3px;
		padding: 5px 1em;
	}
</style>

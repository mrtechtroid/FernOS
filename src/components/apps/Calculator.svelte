<script>
    import Window from "../ui-comps/Window.svelte";
    export let windowSettings = {
        windowTitle: "Calculator",
        windowIcon:"/apps/calculator.png",
        windowHeight:410,
        windowWidth:420,
        windowLeft:0,
        windowTop:0,
        disableResize: true,
        disableMaximise: true,
        app_id:"sys_calculator"
    }
    export let windowID = ""
    export let app_id = ""
    export let windowWebDefined = {
            windowHidden:"visible",
            disableMaximise:true,
            disableResize:false,
            currentZIndex:5,
    }

    let result;
    function clearDisplay() {
    result.value = '';
}

function deleteLast() {
    const display = result;
    display.value = display.value.slice(0, -1);
}

function appendCharacter(character) {
    result.value += character;
}

function calculateResult() {
    const display = result;
    try {
        display.value = eval(sanitizeInput());
    } catch (e) {
        display.value = 'Error';
    }
}
function sanitizeInput() {
    const validCharacters = '0123456789+-*/.%';
    // result.value = result.value.split('').filter(char => validCharacters.includes(char)).join('');
    let b = result.value.split('').filter(char => validCharacters.includes(char)).join('')
    return b==""?"0":b;
}

</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
    <div id="mainDiv">
	<div class="calculator">
        <div class="display">
            <input type="text" id="result" bind:this = {result}>
        </div>
        <div class="buttons">
            <button class="btn" on:click={clearDisplay}>C</button>
            <button class="btn" on:click={deleteLast}>DEL</button>
            <button class="btn" on:click={function(){appendCharacter('%')}}>%</button>
            <button class="btn operator" on:click={function(){appendCharacter('/')}}>/</button>

            <button class="btn" on:click={function(){appendCharacter('7')}}>7</button>
            <button class="btn" on:click={function(){appendCharacter('8')}}>8</button>
            <button class="btn" on:click={function(){appendCharacter('9')}}>9</button>
            <button class="btn operator" on:click={function(){appendCharacter('*')}}>*</button>

            <button class="btn" on:click={function(){appendCharacter('4')}}>4</button>
            <button class="btn" on:click={function(){appendCharacter('5')}}>5</button>
            <button class="btn" on:click={function(){appendCharacter('6')}}>6</button>
            <button class="btn operator" on:click={function(){appendCharacter('-')}}>-</button>

            <button class="btn" on:click={function(){appendCharacter('1')}}>1</button>
            <button class="btn" on:click={function(){appendCharacter('2')}}>2</button>
            <button class="btn" on:click={function(){appendCharacter('3')}}>3</button>
            <button class="btn operator" on:click={function(){appendCharacter('+')}}>+</button>

            <button class="btn" on:click={function(){appendCharacter('0')}}>0</button>
            <button class="btn" on:click={function(){appendCharacter('.')}}>.</button>
            <button class="btn equal" on:click={calculateResult}>=</button>
        </div>
    </div>
    </div>
</Window>
<style>
    #mainDiv{
        background-color: #111928;
        width:100%;
        height:100%;
        padding:10px;
    }
    .calculator {
    width: 400px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.display {
    background-color: transparent;
    color: #fff;
    text-align: right;
    padding: 20px;
    font-size: 2em;
}

.display input {
    width: 100%;
    border: none;
    background: none;
    color: #fff;
    font-size: 1em;
    text-align: right;
    padding: 10px;
    box-sizing: border-box;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background-color: transparent;
}

.operator {
    background-color: #ff9500;
    color: #fff;
}

.operator:hover {
    background-color: #ffb84d;
}

.equal {
    background-color: #ff9500;
    color: #fff;
    grid-column: span 2;
}

.equal:hover {
    background-color: #ffb84d;
}
</style>
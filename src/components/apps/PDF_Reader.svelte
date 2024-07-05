<script>
    import Window from "../ui-comps/Window.svelte";
    import {onMount} from "svelte"
    import fs from "@zenfs/core";
    export let windowSettings = {
        windowTitle: "PDF Reader",
        windowIcon:"/apps/pdf_reader.png",
        windowHeight:600,
        windowWidth:700,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"sys_pdfreader"
    }
    export let windowID = ""
    export let app_id = ""
    export let filePath = '';
    export let windowWebDefined = {
            windowHidden:"visible",
            disableMaximise:true,
            disableResize:false,
            currentZIndex:5,
    }
    let _filePath = filePath;
    let pdfURL = ""
    function readFile(_filePath, ) {
		if (_filePath != '') {
			try {
				pdfURL = "data:application/pdf;base64," + fs.readFileSync(_filePath, { encoding: 'base64', flag: 'r' });
			} catch (err) {
				console.log(err);
			}
		} 
	}
	$: readFile(_filePath);
</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
	<div style="width:100%;height:100%;background-color:#1f2937;padding:10px;">
        <embed style = "width:100%;height:100%;" src = {pdfURL}>
    </div>
</Window>
<style>

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.progress {
    height: 10px;
    background-color: #ccc;
}

.progress-bar {
    width: 0;
    height: 100%;
    background-color: #4caf50;
}
</style>
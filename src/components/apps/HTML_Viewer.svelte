<script>
    import Window from "../ui-comps/Window.svelte";
    import fs from "@zenfs/core";
    export let windowSettings = {
        windowTitle: "HTML_Viewer",
        windowIcon:"/apps/html_viewer.png",
        windowHeight:400,
        windowWidth:400,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"sys_htmlviewer"
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
    let editor_value = ""
    let frame
    let _filePath = filePath;
    function readFile(_filePath) {
		console.log(_filePath, editor_value);
		if (_filePath != '') {
			try {
				frame.srcdoc = fs.readFileSync(_filePath, { encoding: 'utf8', flag: 'r' });
			} catch (err) {
				// console.log(err);
			}
		}
	}
	$: readFile(_filePath,frame);
</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
	<div style="width:100%;height:100%;background-color:#fff;color:white">
        <iframe style="width:100%;height:100%;" bind:this = {frame}></iframe>
    </div>
</Window>
<style>
    div{
        background-color: #111928;
        width:100%;
        height:100%;
        padding:10px;
    }
</style>
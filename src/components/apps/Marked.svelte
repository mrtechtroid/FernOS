<script>
    import Window from "../ui-comps/Window.svelte";
    import {onMount} from "svelte"
    import {marked} from "marked"
    import fs from "@zenfs/core";
    export let windowSettings = {
        windowTitle: "Marked",
        windowIcon:"/apps/marked.png",
        windowHeight:400,
        windowWidth:600,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"sys_marked"
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
    let _filePath = filePath;
    function readFile(_filePath) {
		console.log(_filePath, editor_value);
		if (_filePath != '') {
			try {
				editor_value = marked.parse(fs.readFileSync(_filePath, { encoding: 'utf8', flag: 'r' }));
			} catch (err) {
				console.log(err);
			}
		}
	}
	$: readFile(_filePath);
    
</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
	<div style="width:100%;height:100%;background-color:#1f2937;color:white">
        {@html editor_value}
    </div>
</Window>

<script>
    import Window from "../ui-comps/Window.svelte";
    import {onMount} from "svelte"
    import { ImageViewer } from 'svelte-image-viewer';
    import fs from "@zenfs/core";
    export let windowSettings = {
        windowTitle: "Photo Viewer",
        windowIcon:"/apps/photo_viewer.png",
        windowHeight:400,
        windowWidth:600,
        windowLeft:0,
        windowTop:0,
        disableResize: false,
        disableMaximise: false,
        app_id:"sys_photoviewer"
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
    let photoURL = ""
    function readFile(_filePath, ) {
		if (_filePath != '') {
			try {
				photoURL = "data:image/"+_filePath.split('.').pop()+";base64," + fs.readFileSync(_filePath, { encoding: 'base64', flag: 'r' });
			} catch (err) {
				console.log(err);
			}
		} 
	}
	$: readFile(_filePath);
</script>

<Window {...windowSettings} {...windowWebDefined} windowID = {windowID}>
	<div style="position: relative; height: 512px; user-select: none;border: 1px solid white;">
        <ImageViewer src={photoURL} />
    </div>
</Window>

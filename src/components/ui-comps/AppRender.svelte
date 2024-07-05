<script>
    // Apps
    import Fern from "../apps/Fern.svelte"
    import Calculator from "../apps/Calculator.svelte";
    import Clock from "../apps/Clock.svelte";
    import Recorder from "../apps/Recorder.svelte"
    import Settings from "../apps/Settings.svelte";
    import FileManager from "../apps/File_Manager.svelte";
    import CodeEditor from "../apps/Code_Editor.svelte";
    // Embed Apps
    import Photopea from "../embedApps/Photopea.svelte";
    import Browserling from "../embedApps/Browserling.svelte";
    import Eaglercraft from "../embedApps/Eaglercraft.svelte";
    import { onMount } from "svelte";
    import {storeFE} from "$lib/stores"
	import YTube from "../apps/YTube.svelte";
	import Minetest from "../embedApps/Minetest.svelte";
    import Arkanoid from "../embedApps/Arkanoid.svelte";
	import Sudoku from "../embedApps/Sudoku.svelte";
	import Dino from "../embedApps/Dino.svelte";
	import Marked from "../apps/Marked.svelte";
	import PhotoViewer from "../apps/Photo_Viewer.svelte";
	import MusicPlayer from "../apps/Music_Player.svelte";
	import Devtools from "../apps/Devtools.svelte";
    import Noteplus from "../apps/Noteplus.svelte"
	import PdfReader from "../apps/PDF_Reader.svelte";
	import Tetris from "../embedApps/Tetris.svelte";
	import HtmlViewer from "../apps/HTML_Viewer.svelte";
	
	
    let OP_STATUS_;
    const unsubscribe2 = storeFE.subscribe((value) => {
        OP_STATUS_ = value;
    });
    let initSettings;
    onMount(() => {

    })
    function compareStrings(a, b) {
        // Assuming you want case-insensitive comparison
        a = a.toLowerCase();
        b = b.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }
    
    let AppList = [
        {listed:true,app_id:"about_fern",component:Fern,info:{windowTitle: "About Fern",windowIcon:"/apps/fern-resized.png",}},
        {listed:true,app_id:"ebd_browserling",component:Browserling,info:{windowTitle:"Browserling",windowIcon:"https://www.browserling.com/favicon.ico"}},
        {listed:true,app_id:"sys_calculator",component:Calculator,info:{windowTitle:"Calculator",windowIcon:"/apps/calculator.png"}},
        {listed:true,app_id:"sys_code_editor",component:CodeEditor, info:{windowTitle: "Code Editor",windowIcon:"/apps/code_editor.png",}},
        {listed:true,app_id:"sys_clock",component:Clock,info:{windowTitle:"Clock",windowIcon:"/apps/clock.png"}},
        {listed:true,app_id:"sys_file_manager",component:FileManager, info:{windowTitle: "File Manager",windowIcon:"/apps/file_manager.png",}},
        {listed:true,app_id:"ebd_photopea",component:Photopea,info:{windowTitle:"Photopea",windowIcon:"https://www.photopea.com/promo/icon512.png"}},
        {listed:true,app_id:"sys_recorder",component:Recorder, info:{windowTitle: "Sound Recorder",windowIcon:"/apps/recorder.png",}},
        {listed:true,app_id:"sys_settings",component:Settings, info:{windowTitle: "Settings",windowIcon:"/apps/settings.png",}},
        {listed:true,app_id:"ebd_eaglercraft",component:Eaglercraft, info:{windowTitle: "Eaglercraft",windowIcon:"https://eaglercraft.com/img/favicon.png",}},
        {listed:false,app_id:"ebd_minetest",component:Minetest, info:{windowTitle: "Minetest",windowIcon:"https://www.minetest.net/media/icon.svg",}},
        {listed:true,app_id:"sys_ytube",component:YTube, info:{windowTitle: "YTube",windowIcon:"/apps/ytube.png",}},
        {listed:true,app_id:"ebd_arkanoid",component:Arkanoid,info:{windowTitle: "Arkanoid",windowIcon:"https://play.arkanoid.online/favicon.ico",}},
        {listed:true,app_id:"ebd_sudoku",component:Sudoku,info:{windowTitle: "Sudoku",windowIcon:"/apps/sudoku.png",}},
        {listed:true,app_id:"ebd_dino",component:Dino,info:{windowTitle: "Dino",windowIcon:"/apps/dino.png",}},
        {listed:false,app_id:"sys_marked",component:Marked,info:{windowTitle: "Marked",windowIcon:"/apps/marked.png",}},
        {listed:false,app_id:"sys_photoviewer",component:PhotoViewer,info:{windowTitle: "Photo Viewer",windowIcon:"/apps/photo_viewer.png",}},
        {listed:false,app_id:"sys_htmlviewer",component:HtmlViewer,info:{windowTitle: "HTML Viewer",windowIcon:"/apps/html_viewer.png",}},
        {listed:false,app_id:"sys_musicplayer",component:MusicPlayer,info:{windowTitle: "Music Player",windowIcon:"/apps/music_player.png",}},
        {listed:false,app_id:"sys_pdfreader",component:PdfReader,info:{windowTitle: "PDF Reader",windowIcon:"/apps/pdf_reader.png",}},
        {listed:true,app_id:"sys_devtools",component:Devtools,info:{windowTitle: "Devtools",windowIcon:"/apps/devtools.png",}},
        {listed:true,app_id:"sys_noteplus",component:Noteplus,info:{windowTitle: 'Note +',windowIcon: '/apps/noteplus.png',}},
        {listed:true,app_id:"ebd_tetris",component:Tetris,info:{windowTitle:"Tetris",windowIcon:"https://www.lumpty.com/amusements/Games/Tetris/shareIcons/web-app-icon-android.png"}}
    ]
    AppList.sort(function(a, b) {
        return compareStrings(a.info.windowTitle, b.info.windowTitle);
    })
    let ExtensionMap ={
        "txt":"sys_code_editor",
        "js":"sys_code_editor",
        "css":"sys_code_editor",
        "md":"sys_marked",
        "jpg":"sys_photoviewer",
        "jpeg":"sys_photoviewer",
        "png":"sys_photoviewer",
        "webp":"sys_photoviewer",
        "svg":"sys_photoviewer",
        "gif":"sys_photoviewer",
        "webm":"sys_musicplayer",
        "fernnote":"sys_noteplus",
        "pdf":"sys_pdfreader",
        "htm":"sys_htmlviewer",
        "html":"sys_htmlviewer",
    }
    storeFE.update((val)=>{return {...val , appList:AppList,extensionMap:ExtensionMap}});
    

</script>
<!-- keyed windows necessary -->
{#each OP_STATUS_?.windows as window (window.windowID)}
	<svelte:component this={OP_STATUS_.appList.find(x => x.app_id === window.app_id).component} {...window} {...window?.windowInfo}/>
{/each}


<script>
    import EmbeddableApp from "../ui-comps/EmbeddableApp.svelte";
    export let windowSettings = {
        windowTitle: "Sudoku",
        windowIcon:"/apps/sudoku.png",
        webURL:"http://www.free-sudoku.com/sudoku-webmaster.php?mescandi1=0&fondspage=111928&lesliens=111928&coubo1=1C1D3D&couli1=99EDCC&coucp1=111928&counp1=2B6858&counn1=99EDCC&couce1=FFFFFF&coune1=FF0000&coucr1=111928&hauteur111=750",
        windowHeight:580,
        windowWidth:500,
        windowLeft:0,
        windowTop:0,
        disableResize: true,
        disableMaximise: true,
        app_id:"ebd_browserling",
        filePath:"",
    }
    export let windowID = ""
</script>

<EmbeddableApp windowSettings={windowSettings} windowID = {windowID}>
</EmbeddableApp>
<style>
    div{
        background-color: #111928;
        width:100%;
        height:100%;
        padding:10px;
    }
</style>
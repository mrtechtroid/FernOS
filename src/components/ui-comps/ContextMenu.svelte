<!-- 
Original Repo License: https://svelte.dev/repl/6fb90919e24942b2b47d9ad154386b0c?version=3.49.0
Github @dukenmarga, July 2022
Context Menu is small menu that displayed when user right-click the mouse on browser.
Think of it as a way to show Refresh option on Microsoft Windows when right-click on desktop.
Known bug:
    - If the browser loads the content for the first time, showMenu set to false.
    Hence, we cannot get menu.h and menu.y dimension, since context menu has not been available at DOM.
    The first right click will not shown properly when right-click occurs around the edge (bottom part
    and right part) of the browser.

Inspired from: Context Menu https://svelte.dev/repl/3a33725c3adb4f57b46b597f9dade0c1?version=3.25.0

Modified for Fern
-->




<script>
    import { onMount,createEventDispatcher } from "svelte";

    export let files
    // pos is cursor position when right click occur
    let pos = { x: 0, y: 0 }
    // menu is dimension (height and width) of context menu
    let menu = { h: 0, y: 0 }
    // browser/window dimension (height and width)
    let browser = { h: 0, y: 0 }
    // showMenu is state of context-menu visibility
    let showMenu = false;
    // to display some text
    let content;
    let filemanager;
    export function rightClickContextMenu(e){
        let selectedcount = 0;
        for (let i = 0;i<files.length;i++){
            if (files[i].selected){
                selectedcount+=1
            }
        }
        if (selectedcount<=0){
            menuItems = [
        {
            'name': 'pasteItem',
            'displayText': "Paste",
            'icon': 'content_paste'
        },
    ]
        }else{
            menuItems = [
        
        {
            'name': 'cutItem',
            'displayText': "Cut",
            'icon': 'content_cut'
        },
        {
            'name': 'copyItem',
            'displayText': "Copy",
            'icon': 'content_copy'
        },
        {
            'name': 'pasteItem',
            'displayText': "Paste",
            'icon': 'content_paste'
        },
        {
            'name': 'delete',
            'displayText': "Delete",
            'icon': 'delete'
        },
        {
            'name': 'properties',
            'displayText': "Properties",
            'icon': 'info'
        },
    ]
        }
        showMenu = true
        browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        pos = {
            x: e.clientX,
            y: e.clientY
        };
        // If bottom part of context menu will be displayed
        // after right-click, then change the position of the
        // context menu. This position is controlled by `top` and `left`
        // at inline style. 
        // Instead of context menu is displayed from top left of cursor position
        // when right-click occur, it will be displayed from bottom left.
        if (browser.h -  pos.y < menu.h)
            pos.y = pos.y - menu.h
        if (browser.w -  pos.x < menu.w)
            pos.x = pos.x - menu.w
    }
    export function onPageClick(e){
        // To make context menu disappear when
        // mouse is clicked outside context menu
        showMenu = false;
    }
    function getContextMenuDimension(node){
        // This function will get context menu dimension
        // when navigation is shown => showMenu = true
        let height = node.offsetHeight
        let width = node.offsetWidth
        menu = {
            h: height,
            w: width
        }
    }
    const dispatch = createEventDispatcher();
    export let menuItems = [
        
        {
            'name': 'cutItem',
            'displayText': "Cut",
            'icon': 'content_cut'
        },
        {
            'name': 'copyItem',
            'displayText': "Copy",
            'icon': 'content_copy'
        },
        {
            'name': 'pasteItem',
            'displayText': "Paste",
            'icon': 'content_paste'
        },
        {
            'name': 'delete',
            'displayText': "Delete",
            'icon': 'delete'
        },
        {
            'name': 'properties',
            'displayText': "Properties",
            'icon': 'info'
        },
    ]

</script>
{#if showMenu}
<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px">
    <div class="navbar" id="navbar">
        <ul>
            {#each menuItems as item}
                {#if item.name == "hr"}
                    <hr>
                {:else}
                    <li><button on:click={function(){dispatch('message', {text: item.name});}}><i class="material-symbols-rounded">{item.icon}</i>{item.displayText}</button></li>
                {/if}
            {/each}
        </ul>
    </div>
</nav>
{/if}
<style>
    * {
        padding: 0;
        margin: 0;
        color:rgb(150, 150, 145)
    }
    .navbar{
        display: inline-flex;
        border: 1px #999 solid;
        width: 300px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        flex-direction: column;
    }
    .navbar ul{
        margin: 6px;
    }
    ul li{
        display: block;
        list-style-type: none;
        width: 1fr;
    }
    ul li button{
        font-size: 1rem;
        color: #222;
        width: 100%;
        height: 30px;
        text-align: left;
        border: 0px;
        background-color: #fff;
    }
    ul li button:hover{
        color: #000;
        text-align: left;
        border-radius: 5px;
        background-color: #eee;
    }
    ul li button i{
        padding: 0px 15px 0px 10px;
    }
    ul li button i.fa-square{
        color: #fff;
    }
    ul li button:hover > i.fa-square{
        color: #eee;
    }
    ul li button:hover > i.warning{
        color: crimson;
    }
    :global(ul li button.info:hover){
        color: navy;
    }
    hr{
        border: none;
        border-bottom: 1px solid #ccc;
        margin: 5px 0px;
    }
</style>
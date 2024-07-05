<script>
	import { onMount,createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

    export let topbarJSON = [
      {id:"home",title:"Home", children:[
        {id:"new_file",title:"New File"},
        {id:"open_file",title:"Open File"}
      ]},

    ];
</script>
<div class="window_navbar">
    <div class="window_navbar-top">
        <ul>
          {#each topbarJSON as ele (ele.id)}
            {#if ele?.children!=undefined}
              <li id = {ele.id} class="window_dropdown">
                <a class="dropbtn" on:click = {function(){dispatch('message', {text: ele.id});}}>{ele.title}</a>
                <div class="window_dropdown-content">
              {#each ele?.children as child (child.id)}
                <a id = {child.id} on:click = {function(){dispatch('message', {text: child.id});}}>{child.title}</a>
              {/each}
              </div>
            </li>
            {:else}
              <li id = {ele.id} on:click = {function(){dispatch('message', {text: ele.id});}}><a>{ele.title}</a></li>
            {/if}
          {/each}
        </ul>
      </div>
    </div>
<style>
    .window_navbar{
        position:relative;
        height:24px;
    }
    .window_navbar-top {
  margin: 0;
  padding: 0;
  width: 100%;
  top: 0;
  position: absolute;
}

ul {
  list-style-type: none;
  margin: 0;
  top: 0;
  /*position: fixed;*/
  width: 100%;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li {
  float: left;
}

li a,
.dropbtn {
  font-size: 14px;
  border: none;
  outline: none;
  color: white;
  padding: 4px 4px;
  background-color: inherit;
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */
}

li a:hover,
.window_dropdown:hover .dropbtn {
  background-color: #111;
}

li.window_dropdown {
  display: inline-block;
}

.window_active {
  background-color: #4CAF50;
}

.window_dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.window_dropdown-content a {
  float: none;
  color: black;
  padding: 4px 4px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.window_dropdown-content a:hover {
  background-color: #f1f1f1;
}

.window_dropdown:hover .window_dropdown-content {
  display: block;
}
</style>
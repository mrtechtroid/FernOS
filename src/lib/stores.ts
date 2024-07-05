import { writable } from 'svelte/store';
export let storeFE = writable({
    currentStatus:"setup",
    loggedIn:"",
    fileSysSetup: false,
    windows:[],
    appList:[],
    currZIndex: 3,
    extensionMap:{},
    errorLogs:"",
    bootLogs:"",
    iDBloaded:false,
})
export let versionString = "0.1.0"
export let windowActions = writable([]);
export let appListDisplay = writable("none")
// export default {storeFE , windowActions};
<script>
	import { onMount } from 'svelte';
	import { configure, InMemory, fs } from '@zenfs/core';
	import { IndexedDB, WebStorage } from '@zenfs/dom';
	import { storeFE } from '$lib/stores';
	import Window from '../ui-comps/Window.svelte';
	import Swal from 'sweetalert2';
	import { Buffer } from 'buffer';
	import path from 'path-browserify';
	import ContextMenu from '../ui-comps/ContextMenu.svelte';
	export let windowSettings = {
		windowTitle: 'File Manager',
		windowIcon: '/apps/file_manager.png',
		windowHeight: 500,
		windowWidth: 900,
		windowLeft: 0,
		windowTop: 0,
		disableResize: true,
		disableMaximise: true,
		app_id: 'sys_file_manager'
	};
	export let windowID = '';
	export let app_id = '';
	export let windowWebDefined = {
		windowHidden: 'visible',
		disableMaximise: true,
		disableResize: false,
		currentZIndex: 5
	};
	let renderMode = 'grid';
	let currentPath = '/home';
	let sanitisedRealPath = '/home';
	let OP_STATUS_;
	const unsubscribe2 = storeFE.subscribe((value) => {
		OP_STATUS_ = value;
	});
	let contextmenu;
	let files;
	let lastPath = [];
	let nextPath = [];
	let sort_options = ['Name(A-Z)', 'Last Modified', 'Size'];
	let sort_option = -1;
	onMount(() => {
		let appList = OP_STATUS_.windows;
		for (let i = 0; i < appList.length; i++) {
			if (appList[i].app_id == 'sys_file_manager' && appList[i].windowID == windowID) {
				break;
			}
			if (appList[i].app_id == 'sys_file_manager' && appList[i].windowID != windowID) {
				multi_err = true;
				return;
			}
		}
	});
	function sortFolder(bool) {
		if (bool) {
			sort_option = (sort_option + 1) % 3;
		}
		function compare(a, b, method) {
			if (method == 'modified') {
				a = new Date(a['modified']).getTime();
				b = new Date(b['modified']).getTime();
				return a < b ? -1 : a > b ? 1 : 0;
			}
			if (a[method] < b[method]) {
				return -1;
			}
			if (a[method] > b[method]) {
				return 1;
			}
			return 0;
		}
		function cmpN(a, b) {
			return compare(a, b, 'file');
		}
		function cmpM(a, b) {
			return compare(a, b, 'modified');
		}
		function cmpS(a, b) {
			return compare(a, b, 'size');
		}
		if (sort_option == 2) {
			files.sort(cmpS);
		} else if (sort_option == 1) {
			files.sort(cmpM);
		} else {
			files.sort(cmpN);
		}
		files = files;
	}
	function arrowBack() {
		nextPath.push(sanitisedRealPath);
		let t = lastPath.pop();
		if (!t) {
			return;
		}
		currentPath = t;
	}
	function arrowForward() {
		lastPath.push(currentPath);
		let t = nextPath.pop();
		if (!t) {
			return;
		}
		currentPath = t;
	}
	function arrowUpward() {
		currentPath = path.parse(sanitisedRealPath).dir;
	}
	function viewFiles(path, rf) {
		try {
			// selectedfiles = []
			sanitisedRealPath = fs.realpathSync(currentPath);
			if (fs.lstatSync(path).isDirectory()) {
				let J = fs.readdirSync(path);
				let ans = [];
				for (let i = 0; i < J.length; i++) {
					let o = fs.statSync(currentPath + '/' + J[i]);
					ans.push({
						file: J[i],
						isDir: o.isDirectory() ? 'folder' : 'draft',
						size: o.size / 1024,
						modified: o.mtime.toLocaleString(),
						selected: false
					});
				}
				return ans;
			}
		} catch (e) {
			console.log(e);
			return [];
		}
	}
	let _refresh = 0;
	// let selectedfiles = []
	$: files = viewFiles(currentPath, _refresh);
	$: sortFolder(false, files);
	function amIStatus(path) {
		try {
			if (fs.lstatSync(currentPath + '/' + path).isDirectory()) {
				return 'folder';
			} else {
				return 'draft';
			}
		} catch (e) {
			console.log(e);
		}
	}
	function splUserGenerator() {
		lastPath.push(currentPath);
		nextPath = [];
	}
	function refresh() {
		_refresh += 1;
	}
	function doAction(path) {
		// console.log(currentPath+"/"+path)
		try {
			// console.log(fs.lstatSync(currentPath+"/"+path).isDirectory())
			if (fs.lstatSync(currentPath + '/' + path).isDirectory()) {
				currentPath = currentPath + '/' + path;
			} else {
				let filename = currentPath + '/' + path;
                if ($storeFE.extensionMap[filename.split('.').pop()]==undefined){
                    Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Cannot find a suitable application to open this file.'
			});
                }
				$storeFE.windows[$storeFE.windows.length] = {
					app_id: $storeFE.extensionMap[filename.split('.').pop()],
					windowID: 'window' + parseInt(Math.random() * 1000),
					filePath: filename
				};
			}
		} catch (err) {
			console.log(err);
		}
	}
	let input_file_upload;
	function fileUpload() {
		let files = input_file_upload.files;
		for (let i = 0; i < files.length; i++) {
			let name = files[i].name;
			let size = files[i].size;
			try {
				var fileReader = new FileReader();
				fileReader.onload = function () {
					fs.writeFileSync(currentPath + '/' + name, Buffer.from(new Uint8Array(this.result)));
				};
				fileReader.readAsArrayBuffer(files[i]);
			} catch (e) {
				console.log(e);
			}
		}
		refresh();
	}
	function newFolder() {
		Swal.fire({
			title: 'Enter Folder vName',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Open',
			showLoaderOnConfirm: true,
			preConfirm: (folder) => {
				return folder;
			},
			allowOutsideClick: () => !Swal.isLoading()
		}).then((result) => {
			if (result.isConfirmed) {
				try {
					fs.mkdirSync(currentPath + '/' + result.value, { recursive: true });
				} catch (e) {}
				refresh();
			}
		});
	}
	let multi_err = false;
	function setSelected(file, bool_, g) {
		for (let i = 0; i < files.length; i++) {
			let t = files[i].selected;
			files[i].selected = false;
			if (files[i].file == file) {
				files[i].selected = !bool_;
			} else if (g && t) {
				files[i].selected = true;
			}
		}
	}
	function setAllSeleced(e) {
		for (let i = 0; i < files.length; i++) {
			files[i].selected = e.target.checked;
		}
	}

	function topHandler(event) {
		let _ = event.detail.text;
		switch (_) {
			case 'cutItem':
				cutInit();
				break;
			case 'copyItem':
				copyInit();
				break;
			case 'pasteItem':
				pasteItems();
				break;
			case 'delete':
				deleteItems();
				break;
			case 'properties':
				properties();
				break;
		}
	}
	let cut_files = [];
	let copy_files = [];
	function cutInit() {
		cut_files = [];
		copy_files = [];
		for (let i = 0; i < files.length; i++) {
			if (files[i].selected) {
				cut_files.push({ path: currentPath, name: files[i].file });
			}
		}
	}
	function copyInit() {
		cut_files = [];
		copy_files = [];
		for (let i = 0; i < files.length; i++) {
			if (files[i].selected) {
				copy_files.push({ path: currentPath, name: files[i].file });
			}
		}
	}
	function move(oldPath, newPath, callback) {
		if (isSelf(oldPath, newPath)) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Cannot copy directory into itself. '
			});
		}
		try {
			// https://stackoverflow.com/a/29105404
			fs.rename(oldPath, newPath, function (err) {
				if (err) {
					if (err.code === 'EXDEV') {
						copy();
					} else {
                        console.log(err)
						// callback(err);
					}
					return;
				}
				// callback();
			});

			function copy() {
				var readStream = fs.createReadStream(oldPath);
				var writeStream = fs.createWriteStream(newPath);

				readStream.on('error', callback);
				writeStream.on('error', callback);

				readStream.on('close', function () {
					fs.unlink(oldPath, callback);
				});

				readStream.pipe(writeStream);
			}
		} catch (e) {}
	}
	function isSelf(moveFrom, moveTo) {
		const target = moveTo; // these two lines are simply building a path to the files
		const source = moveFrom;

		return target.startsWith(source)
	}
    const deleteFolderRecursive = function (directoryPath) {
        try{
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
          const curPath = directoryPath + "/"+ file;
          if (fs.lstatSync(curPath).isDirectory()) {
           // recurse
            deleteFolderRecursive(curPath);
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(directoryPath);
      }}
      catch(e){
        console.log(e)
      }
    };

	function pasteItems() {
		console.log(cut_files, copy_files);
		// return
		if (cut_files.length > 0) {
			for (let i = 0; i < cut_files.length; i++) {
				try {
                    let oldPath = cut_files[i].path + '/' + cut_files[i].name;
				    let newPath = currentPath + '/' + cut_files[i].name;
					fs.cpSync(oldPath, newPath, { recursive: true });
                    deleteFolderRecursive(oldPath);
				} catch (e) {
					console.log(e);
				}
			}
		} else {
			for (let i = 0; i < copy_files.length; i++) {
				let oldPath = copy_files[i].path + '/' + copy_files[i].name;
				let newPath = currentPath + '/' + copy_files[i].name;
				if (isSelf(oldPath, newPath)) {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Cannot copy directory into itself. '
					});
					return;
				}
				try {
					console.log(copy_files[i]);
					fs.cpSync(oldPath, newPath, { recursive: true });
				} catch (e) {
					console.log(e);
				}
			}
		}
		refresh();
	}
	function deleteItems() {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				for (let i = 0; i < files.length; i++) {
					if (files[i].selected) {
						try {
							if (fs.lstatSync(currentPath + '/' + files[i].file).isDirectory()) {
                                deleteFolderRecursive(currentPath + '/' + files[i].file);
								// fs.rmdirSync(currentPath + '/' + files[i].file, { recursive: true, force: true });
							} else {
								fs.unlinkSync(currentPath + '/' + files[i].file);
							}
						} catch (e) {
							console.log(e);
						}
					}
				}
				refresh();
			}
		});
	}
	function properties() {}
	let menuItems;
</script>

<Window {...windowSettings} {...windowWebDefined} {windowID}>
	{#if multi_err}
		<span style="color:black"
			>File Manager can be opened in only one window at a time temporarily.</span
		>
	{:else}
		<div class="file_manager" on:contextmenu|preventDefault={contextmenu.rightClickContextMenu} 
		on:click={contextmenu.onPageClick}>
			<div class="file_topbar">
				<button class="file_top_btn" on:click={newFolder}
					><span class="material-symbols-rounded">add</span>New Folder</button
				>
				<button class="file_top_btn" on:click={refresh}
					><span class="material-symbols-rounded">refresh</span>Refresh</button
				>
				<button class="file_top_btn" style="position: relative;"
					><span class="material-symbols-rounded">upload</span>Upload<input
						style="position:absolute;top:0;left:0;opacity: 0;width:100%;height:100%"
						type="file"
						bind:this={input_file_upload}
						on:change={fileUpload}
					/></button
				>
				<button
					class="file_top_btn"
					on:click={function () {
						sortFolder(true);
					}}
					><span class="material-symbols-rounded">sort</span>Sort By {sort_options[
						(sort_option + 1) % 3
					]}</button
				>
				<button class="file_top_btn"><span class="material-symbols-rounded">info</span>Info</button>
			</div>
			<div class="file_middle">
				<div class="file_sidebar">
					<div
						class="file_sidebar_btn {sanitisedRealPath == '/home' ? 'fs_btn_sel' : ''} "
						on:click={function () {
							currentPath = '/home';
						}}
					>
						Home
					</div>
					{#if OP_STATUS_.iDBloaded}
					<div
						class="file_sidebar_btn {sanitisedRealPath == '/drive' ? 'fs_btn_sel' : ''} "
						on:click={function () {
							currentPath = '/drive';
						}}
					>
						Drive
					</div>
					<div
						class="file_sidebar_btn {sanitisedRealPath == '/drive/documents' ? 'fs_btn_sel' : ''} "
						on:click={function () {
							currentPath = '/drive/documents';
						}}
					>
						Documents
					</div>
					<div
						class="file_sidebar_btn {sanitisedRealPath == '/drive/music' ? 'fs_btn_sel' : ''} "
						on:click={function () {
							currentPath = '/drive/music';
						}}
					>
						Music
					</div>
					<div
						class="file_sidebar_btn {sanitisedRealPath == '/drive/videos' ? 'fs_btn_sel' : ''} "
						on:click={function () {
							currentPath = '/drive/videos';
						}}
					>
						Videos
					</div>
					<div
						class="file_sidebar_btn {sanitisedRealPath == '/drive/pictures' ? 'fs_btn_sel' : ''} "
						on:click={function () {
							currentPath = '/drive/pictures';
						}}
					>
						Pictures
						
					</div>
					{/if}
				</div>
				<div class="file_view">
					<div class="overflow-x-auto">
						<table class="table table-compact w-full" style="width:100%;height:100%;">
							<tr class="whitespace-normal">
								<th colspan="1"
									><input type="checkbox" class="checkbox" on:change={setAllSeleced} /></th
								>
								<th><span class="material-symbols-rounded">folder</span></th>
								<th>Name</th>
								<th>Last Modified</th>
								<th>Size</th>
							</tr>
							{#each files as file}
								<tr
									class="file-item {file.selected ? 'file_active' : ''}"
									on:contextmenu={function () {
										setSelected(file.file, false, true);
									}}
									on:dblclick={function (e) {
										doAction(file.file);
									}}
								>
									{#if file.selected}
										<td
											><input
												type="checkbox"
												class="checkbox"
												value={file.file}
												checked
												on:change={function (e) {
													if (e.isTrusted) {
														setSelected(file.file, file.selected, true);
													}
												}}
											/></td
										>
									{:else}
										<td
											><input
												type="checkbox"
												class="checkbox"
												value={file.file}
												on:change={function (e) {
													if (e.isTrusted) {
														setSelected(file.file, file.selected, true);
													}
												}}
											/></td
										>
									{/if}
									<td
										on:click={function () {
											setSelected(file.file, file.selected, false);
										}}
										><span style="color:rgb(92, 92, 78);" class="material-symbols-rounded"
											>{file.isDir}</span
										></td
									>
									<td
										on:click={function () {
											setSelected(file.file, file.selected, false);
										}}>{file.file}</td
									>
									<td
										on:click={function () {
											setSelected(file.file, file.selected, false);
										}}>{file.modified}</td
									>
									<td
										on:click={function () {
											setSelected(file.file, file.selected, false);
										}}>{file.isDir == 'folder' ? '~' : file.size + ' kb'}</td
									>
								</tr>
							{/each}
						</table>
					</div>
				</div>
			</div>
			<div class="file_bottombar">
				<input
					class="path-bar"
					bind:value={currentPath}
					on:change={function (e) {
						if (e.isTrusted) {
							nextPath = [];
						}
					}}
				/>
				<button class="file_top_btn"
					><span class="material-symbols-rounded" on:click={arrowBack}>arrow_back</span></button
				>
				<button class="file_top_btn"
					><span class="material-symbols-rounded" on:click={arrowForward}>arrow_forward</span
					></button
				>
				<button class="file_top_btn"
					><span class="material-symbols-rounded" on:click={arrowUpward}>arrow_upward</span></button
				>
			</div>
		</div>
	{/if}
	<!-- <div class="file-manager">
        <div class="main-content">
            <div class="toolbar">
                
            </div>
            <div class="files" style="height:90%">
                
            </div>
        </div>
    </div> -->
	<ContextMenu on:message={topHandler} bind:this={contextmenu} bind:menuItems bind:files />
</Window>

<style>
	.file_manager {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.file_topbar {
		height: 40px;
		background-color: #dee2e6;
		display: flex;
		flex-direction: row;
		border-bottom: #000 1px solid;
	}
	.file_top_btn {
		padding: 5px;
		margin: 5px;
		color: #000;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.file_active {
		background-color: rgb(150, 150, 145);
	}
	.file_sidebar_btn {
		width: calc(100%-5px);
		height: 30px;
		display: flex;
		color: #000;
		align-content: center;
		text-align: center;
		margin: 5px;
		padding: 5px;
	}
	.file_sidebar_btn:hover {
		background-color: rgb(92, 92, 78);
		color: #fff;
	}
	.fs_btn_sel {
		background-color: rgb(92, 92, 78);
		color: #fff;
	}
	.file_top_btn .material-symbols-rounded {
		color: rgb(92, 92, 78);
		margin: 5px;
	}
	.file_top_btn:hover {
		filter: invert(0.5);
	}
	table tr {
		max-height: 50px;
	}
	.file_middle {
		width: 100%;
		height: calc(100% - 80px);
		display: flex;
		flex-direction: row;
	}
	.file_sidebar {
		background-color: #dee2e6;
		width: 20%;
		border-right: #000 1px solid;
		height: 100%;
	}
	.file_bottombar {
		height: 40px;
		background-color: #dee2e6;
		display: flex;
		flex-direction: row;
		border-top: #000 1px solid;
		align-items: center;
	}
	.path-bar {
		height: 30px;
		width: 60%;
		padding: 5px;
		margin: 5px;
	}
	.file_view {
		width: 80%;
		padding: 5px;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: scroll;
	}
	.file-item {
		color: #000;
	}
</style>

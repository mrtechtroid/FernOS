<script>
	import { onMount, onDestroy } from 'svelte';
	import Window from '../ui-comps/Window.svelte';
	import Swal from 'sweetalert2';
	import fs from '@zenfs/core';
	import { Buffer } from 'buffer';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import WindowTopBar from '../ui-comps/WindowTopBar.svelte';
	// import { AceEditor } from "svelte-ace";
	// import "brace/mode/json";
	// import "brace/theme/chrome";
	export let windowSettings = {
		app_id: 'sys_code_editor',
		windowTitle: 'Code Editor',
		windowIcon: '/apps/code_editor.png',
		windowHeight: 420,
		windowWidth: 720,
		windowLeft: 0,
		windowTop: 0,
		disableResize: true,
		disableMaximise: true,
		defaultfilePath: ''
	};
	export let windowID = '';
	export let app_id = '';
	export let filePath = '';
	export let windowWebDefined = {
		windowHidden: 'visible',
		disableMaximise: true,
		disableResize: false,
		currentZIndex: 5
	};
	let _filePath = filePath;
	let editor_value = '';
	let editor_initialise = false;
	let subscriptions = [];
	// export let content;
	let divEl;
	let editor;
	let Monaco;
	function readFile(_filePath, editor_initialise) {
		console.log(_filePath, editor_value);
		if (_filePath != '' && editor_initialise) {
			try {
				console.log(fs.readFileSync(_filePath, { encoding: 'utf8', flag: 'r' }));
				editor_value = fs.readFileSync(_filePath, { encoding: 'utf8', flag: 'r' });
				editor.setValue(editor_value);
			} catch (err) {
				console.log(err);
			}
		} else if (editor_initialise) {
			editor_value = 'Edit any files you want';
			editor.setValue('Edit any files you want');
		}
	}
	$: readFile(_filePath, editor_initialise);

	onMount(async () => {
		self.MonacoEnvironment = {
			getWorker: function (_moduleId, label) {
				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return new cssWorker();
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return new htmlWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			}
		};
		Monaco = await import('monaco-editor');
		editor = Monaco.editor.create(divEl, {
			value: '/* Loading... */',
			language: 'java',
			theme: 'vs-dark',
			automaticLayout: true
			// readOnly: true,
		});
		editor.onDidChangeModelContent(() => {
			const text = editor.getValue();
			subscriptions.forEach((sub) => sub(text));
		});
		editor_initialise = true;
		let content = {
			subscribe(func) {
				subscriptions.push(func);
				return () => {
					subscriptions = subscriptions.filter((sub) => sub != func);
				};
			},
			set(val) {
				editor.setValue(val);
			}
		};
		return () => {
			editor.dispose();
		};
	});
	let topbarJSON = [
		{
			id: 'file',
			title: 'File',
			children: [
				{ id: 'new_file', title: 'New File' },
				{ id: 'open_file', title: 'Open File' },
				{ id: 'save_file', title: 'Save File' }
			]
		},
		{ id: 'about', title: 'About' }
	];
	function openFile() {
		Swal.fire({
			title: 'Please enter file path',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Open',
			showLoaderOnConfirm: true,
			preConfirm: (path) => {
				return path
			},
			allowOutsideClick: () => !Swal.isLoading()
		}).then((result) => {
			if (result.isConfirmed) {
        let path = result.value;
        console.log(result)
				if (fs.existsSync(path)) {
					if (fs.lstatSync(path).isDirectory()) {
            Swal.fire({title:"Error",text:"provided path is a directory."})
            return
					} else {
            _filePath = path
						console.log(' path is a file!');
					}
				} else {
					Swal.fire({title:"Error",text:"provided path is not a valid path."})
          return
				}
			}
		});
	}
	function saveFile() {
    console.log(_filePath)
		if ((_filePath == '')) {
      Swal.fire({
			title: 'Please enter file path where you want to save',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off'
			},
			showCancelButton: true,
			confirmButtonText: 'Open',
			showLoaderOnConfirm: true,
			preConfirm: (path) => {
				return path
			},
			allowOutsideClick: () => !Swal.isLoading()
		}).then((result) => {
			if (result.isConfirmed) {
        let path = result.value;
        console.log(result)
				if (fs.existsSync(path)) {
					if (fs.lstatSync(path).isDirectory()) {
            Swal.fire({title:"Error",text:"provided path is a directory."})
            return
					} else {
            Swal.fire({title:"Error",text:"A File already exists. do you want to overwrite?",showDenyButton: true}).then((result)=>{
              if (result.isConfirmed){
                fs.writeFileSync(path, editor.getValue());
              }
            })
						console.log(' path is a file!');
            return
					}
				} else {
					try{
            fs.writeFileSync(path, editor.getValue());
          }catch(e){
            console.log(e)
          }
				}
			}
		});
		} else {
      fs.writeFileSync(_filePath, editor.getValue());
		}
	}
	function newFile() {
		if (!(_filePath == '') && editor_value != editor.getValue()) {
			Swal.fire({
				title: 'Caution',
				text: 'Please save the old file before creating a new one',
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonText: 'Save',
				denyButtonText: `Don't save`
			}).then((result) => {
				if (result.isConfirmed) {
					saveFile();
				} else if (result.isDenied) {
					// return
				} else {
					return;
				}
				editor_value = '';
				editor.setValue('');
				_filePath = '';
			});
		} else {
			editor_value = '';
			editor.setValue('');
			_filePath = '';
		}
	}
	function topHandler(event) {
		let _ = event.detail.text;
		switch (_) {
			case 'new_file':
				newFile();break;
      case 'open_file':
        openFile();break;
      case 'save_file':
        saveFile();break;
		}
	}
</script>

<Window {...windowSettings} {...windowWebDefined} {windowID}>
	<div class="container_">
		<WindowTopBar on:message={topHandler} {topbarJSON} />
		<div bind:this={divEl} id="code_edit" />
	</div>
</Window>

<style>
	.container_ {
		width: 100%;
		height: 100%;
	}
	#code_edit {
		width: 100%;
		height: 100%;
		display: block;
		flex-grow: inherit;
	}
</style>

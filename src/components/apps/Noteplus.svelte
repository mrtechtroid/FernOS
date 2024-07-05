<script>
	import { onMount, onDestroy } from 'svelte';
	import Window from '../ui-comps/Window.svelte';
	import Swal from 'sweetalert2';
	import fs from '@zenfs/core';
	import EditorJS from '@editorjs/editorjs';
	import Header from '@editorjs/header';
	import List from '@editorjs/list';
	import Raw from '@editorjs/raw';
	import SimpleImage from '@editorjs/simple-image';
	import Checklist from '@editorjs/checklist';
	import Embed from '@editorjs/embed';
	import Quote from '@editorjs/quote';
	import CodeTool from '@editorjs/code';
	import Warning from '@editorjs/warning';
	import Delimiter from '@editorjs/delimiter';
	import Marker from '@editorjs/marker';
	import Table from '@editorjs/table';
	import InlineCode from '@editorjs/inline-code';
	import WindowTopBar from '../ui-comps/WindowTopBar.svelte';
	import LinkTool from '@editorjs/link';
	// import { AceEditor } from "svelte-ace";
	// import "brace/mode/json";
	// import "brace/theme/chrome";
	export let windowSettings = {
		app_id: 'sys_noteplus',
		windowTitle: 'Note +',
		windowIcon: '/apps/noteplus.png',
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
	let editor
	// export let content;
	let divEl;
	let Monaco;
	function readFile(_filePath, editor_initialise) {
		console.log(_filePath, editor_value);
		if (_filePath != '' && editor_initialise) {
			try {
				console.log(fs.readFileSync(_filePath, { encoding: 'utf8', flag: 'r' }));
				editor_value = JSON.parse(fs.readFileSync(_filePath, { encoding: 'utf8', flag: 'r' }));
				console.log(editor_value)
				editor.isReady.then(() => {
					editor.blocks.render(editor_value)
				})
				.catch((reason) => {
					console.log(`Editor.js initialization failed because of ${reason}`)
				});
				// editor.setValue(editor_value);
			} catch (err) {
				console.log(err);
			}
		} else if (editor_initialise) {
			editor_value = 'Edit any files you want';
			// editor.setValue('Edit any files you want');
		}
	}
	$: readFile(_filePath, editor_initialise);

	onMount(async () => {
		editor = new EditorJS({
			holder: 'editorjs',
			tools: {
				header: Header,
				image: SimpleImage,
				list: List,
				checklist: Checklist,
				quote: Quote,
				warning: Warning,
				marker: Marker,
				code: CodeTool,
				delimiter: Delimiter,
				inlineCode: InlineCode,
				linkTool: LinkTool,
				embed: Embed,
				table: Table,
				raw:Raw,
			}
		});

		editor_initialise = true;
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
		{ id: 'about', title: 'About' },
		{ id: 'how_to', title: 'How to Use?' }
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
				return path;
			},
			allowOutsideClick: () => !Swal.isLoading()
		}).then((result) => {
			if (result.isConfirmed) {
				let path = result.value;
				console.log(result);
				if (fs.existsSync(path)) {
					if (fs.lstatSync(path).isDirectory()) {
						Swal.fire({ title: 'Error', text: 'provided path is a directory.' });
						return;
					} else {
						_filePath = path;
						console.log(' path is a file!');
					}
				} else {
					Swal.fire({ title: 'Error', text: 'provided path is not a valid path.' });
					return;
				}
			}
		});
	}
	async function saveFile() {
		console.log(_filePath);
		if (_filePath == '') {
			Swal.fire({
				title: 'Please enter file path where you want to save',
				input: 'text',
				footer: 'Please set the filetype as <code>.fernnote</code>',
				inputAttributes: {
					autocapitalize: 'off'
				},
				showCancelButton: true,
				confirmButtonText: 'Open',
				showLoaderOnConfirm: true,
				preConfirm: (path) => {
					return path;
				},
				allowOutsideClick: () => !Swal.isLoading()
			}).then(async (result) => {
				let fileContent = '';
				
				fileContent = JSON.stringify(await editor.save())

				if (result.isConfirmed) {
					let path = result.value;
					console.log(result);
					if (fs.existsSync(path)) {
						if (fs.lstatSync(path).isDirectory()) {
							Swal.fire({ title: 'Error', text: 'provided path is a directory.' });
							return;
						} else {
							Swal.fire({
								title: 'Error',
								text: 'A File already exists. do you want to overwrite?',
								showDenyButton: true
							}).then((result) => {
								if (result.isConfirmed) {
									fs.writeFileSync(path, fileContent);
								}
							});
							console.log(' path is a file!');
							return;
						}
					} else {
						try {
							fs.writeFileSync(path, fileContent);
						} catch (e) {
							console.log(e);
						}
					}
				}
			});
		} else {
			fileContent = JSON.stringify(await editor.save())
			fs.writeFileSync(_filePath, fileContent);
		}
	}
	
	function newFile() {
		let fileContent = {};
		editor
			.save()
			.then((outputData) => {
				fileContent = JSON.stringify(outputData);
			})
			.catch((error) => {
				console.log('Saving failed: ', error);
			});
		if (!(_filePath == '')) { // && editor_value != fileContent
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
				// editor.setValue('');
				_filePath = '';
			});
		} else {
			editor_value = '';
			// editor.setValue('');
			_filePath = '';
		}
	}
	function howTo(){
		editor.blocks.insert('header', {
      text: 'Type / in a new line to access filters menu and select an element to activate the font styles bar.',
      level: 2
    });
	}
	function topHandler(event) {
		let _ = event.detail.text;
		// console.log(event.detail.text)
		switch (_) {
			case 'new_file':
				newFile();
				break;
			case 'open_file':
				openFile();
				break;
			case 'save_file':
				saveFile();
				break;
			case 'how_to':
				howTo();
				break;
		}
	}
</script>

<Window {...windowSettings} {...windowWebDefined} {windowID}>
	<div class="container_">
		<WindowTopBar on:message={topHandler} {topbarJSON} />
		<div bind:this={divEl} id="editorjs" style="color:black" />
	</div>
</Window>

<style>
	.container_ {
		width: 100%;
		height: 100%;
	}
	#editorjs {
		width: 100%;
		height: 100%;
		display: block;
		flex-grow: inherit;
		scroll-behavior: auto;
		overflow-y: scroll;
	}
</style>

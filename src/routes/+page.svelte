<script>
	import { storeFE, versionString } from '$lib/stores';
	import { onMount } from 'svelte';
	import { configure, InMemory, fs, resolveMountConfig } from '@zenfs/core';
	import { IndexedDB, WebStorage } from '@zenfs/dom';
	import Dashboard from '../components/dashboard/Dashboard.svelte';
	import Login from '../components/loginscreen/+Login.svelte';
	let OP_STATUS;
	const unsubscribe = storeFE.subscribe((value) => {
		OP_STATUS = value;
	});
	let completed = 0;
	$storeFE.bootLogs += 'Initialising System';
	onMount(async () => {
		// console.log(idbfs._sync);
		console.log(
			`\n%cFernOS v` + versionString + ``,
			'color:#99EDCC; background:#2B6858; font-size:1.5rem; padding:0.15rem 0.25rem; margin: 1rem auto; font-family: Rockwell; border: 2px solid transparent; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;'
		);
		console.log('Currently in Beta. All Features are not stable. ');

		if (await IndexedDB.isAvailable()) {
			await configure({
				mounts: {
					// '/local': { backend: WebStorage, storage: localStorage },
					'/tmp': InMemory,
					'/home': { backend: WebStorage, storage: localStorage }
					// '/drive':IndexedDB,
				},
				disableAsyncCache: true
			});
			completed += 1;
			try {
				$storeFE.bootLogs += '\n Creating /home/config';
				fs.mkdirSync('/home/config');
				completed += 1;
			} catch (e) {
				console.log(e);
				completed += 1;
			}
			if (!fs.existsSync('/home/test.txt')) {
				$storeFE.bootLogs += '\n Creating /home/test.txt';
				try {
					fs.writeFileSync('/home/test.txt', 'This will persist across reloads!');
					completed += 1;
				} catch (e) {
					completed += 1;
				}
			}
			if (!fs.existsSync('/home/marked-test.md')) {
				$storeFE.bootLogs += '\n Creating /home/marked-test.md';
				try {
					fs.writeFileSync('/home/marked-test.md', '### Also supports markdown');
					completed += 1;
				} catch (e) {
					completed += 1;
				}
			}
			let defaultSettings = {
				drive: {},
				accountdetails: {
					name: 'Fern',
					profilePicture:
						'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
					username: 'fern',
					passwordhash: '',
					passwordHint: 'just click login! no password lol'
				},
				language: 'English',
				desktopIcons: {},
				background: {
					lockscreen: {
						type: 'default', // default - color - picture
						color: '',
						imgLocation: '',
						style: '' // cover - contain - repeat
					},
					mainscreen: {
						type: 'default', // default - color - picture
						color: '',
						imgLocation: 'pxfuel.jpg',
						style: '' // cover - contain - repeat
					}
				},
				themes: {
					style: 'default',
					icons: 'default',
					sounds: 'default'
				}
			};
			if (!fs.existsSync('/home/settings.txt')) {
				$storeFE.bootLogs += '\n Creating /home/settings.txt';
				try {
					fs.writeFileSync('/home/settings.txt', JSON.stringify(defaultSettings));
					completed += 1;
				} catch (e) {
					completed += 1;
				}
			}

			try {
				async function _() {
					let t = Date.now();
					console.log('started');
					await resolveMountConfig({ backend: IndexedDB }).then((idb_) => {
						fs.mount('/drive', idb_);
						console.log('done! iDB. took time: ' + String(Date.now() - t) + 'ms');
						$storeFE.iDBloaded = true;
						try {
							fs.mkdirSync('/drive/documents');
							fs.mkdirSync('/drive/pictures');
							fs.mkdirSync('/drive/music');
							fs.mkdirSync('/drive/videos');
						} catch (e) {
							console.log(e);
						}
					});
				}
				_();
			} catch (e) {
				console.log(e);
			}
			storeFE.update((val) => {
				return { ...val, fileSysSetup: true, currentStatus: 'login' };
			});
		} else {
			console.log('Indexed DB Not Supported. Ending Process');
			$storeFE.bootLogs =
				'FATAL ERROR. IndexedDB not supported on this Browser. FernOS requires indexedDB to run properly.';
		}
	});
</script>

{#if !OP_STATUS.iDBloaded}
	<div id="idb_notloaded" style="position:fixed;bottom:0px;left:0px;font-size:12px;z-index:10;">
		IndexedDB is still loading!
	</div>
{/if}
{#if OP_STATUS.currentStatus == 'login'}
	<Login />
{:else if OP_STATUS.currentStatus == 'dashboard'}
	<Dashboard />
{:else if OP_STATUS.currentStatus == 'setup'}
	<div
		style="background-color: black;font-family:Consolas;color:greenyellow;width:100vw;height:100vh;"
	>
		Please wait... setting up your OS. <br />
		{OP_STATUS.bootLogs}
	</div>
{:else}
	<div
		style="background-color: black;font-family:Consolas;color:greenyellow;width:100vw;height:100vh;"
	>
		Major System Error. Please Reload.
	</div>
{/if}

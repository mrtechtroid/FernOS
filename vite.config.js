import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode })=>({
	build: {
		target: "es2022"
	},
	esbuild: {
		supported: {
			'top-level-await': true
		},
	}, optimizeDeps: {
		esbuildOptions: {
			target: "es2022",
		}
	},
	resolve: {
		alias: {
		  $img: mode === "production" ? "./static/" : "../",
		},
	  },
	plugins: [sveltekit()]
}));

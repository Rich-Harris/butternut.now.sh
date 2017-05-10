import svelte from 'rollup-plugin-svelte';

export default {
	entry: 'server/src/main.js',
	dest: 'server/dist/index.js',
	format: 'cjs',
	external: [
		'compression',
		'express',
		'fs',
		'path'
	],
	plugins: [
		svelte({
			generate: 'ssr'
		})
	]
};
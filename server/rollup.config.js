import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

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
		resolve(),
		commonjs(),
		svelte({
			generate: 'ssr'
		})
	]
};
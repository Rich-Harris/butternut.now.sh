import fs from 'fs';
import svelte from 'rollup-plugin-svelte';

function mkdir ( dir ) {
	try {
		fs.mkdirSync( dir );
	} catch ( err ) {

	}
}

export default {
	entry: 'client/src/main.js',
	dest: 'client/dist/bundle.js',
	format: 'iife',
	external: [

	],
	plugins: [
		svelte({
			css: css => {
				mkdir( 'client/dist' );
				fs.writeFileSync( 'client/dist/main.css', css );
			}
		})
	]
};
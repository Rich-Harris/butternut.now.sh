(function () {
'use strict';

let pendingSource;
let butternut;

function init(search) {
	// load Butternut
	const versionMatch = /version=([^&]?(\d+)(?:\.(\d+))?(?:\.(\d+))?)/.exec(
		search
	);
	const version = versionMatch ? versionMatch[1] : 'latest';
	console.log('version', version);

	// 0.3.4 and newer get the minified version
	const format = versionMatch
		? +versionMatch[2] > 0 ||
				!versionMatch[3] ||
				(+versionMatch[3] > 3 ||
					(+versionMatch[3] === 3 && !versionMatch[4])) ||
				+versionMatch[4] >= 4
				? 'min'
				: 'umd'
		: 'min';

	const url = version === 'local'
		? `/butternut.umd.js`
		: `https://unpkg.com/butternut@${version}/dist/butternut.${format}.js`;

	const xhr = new XMLHttpRequest();
	xhr.onload = () => {
		const fn = new Function(xhr.responseText);
		const global = {};

		fn.call(global);
		butternut = global.butternut;

		console.log('ready');

		self.postMessage({
			type: 'init',
			version: version === 'local' ? version : global.butternut.VERSION
		});

		if (pendingSource) {
			squash(pendingSource);
		}
	};
	xhr.onerror = event => {
		self.postMessage({
			type: 'error',
			message: event.message
		});
	};
	xhr.open('GET', url);
	xhr.send();
}

self.addEventListener('message', event => {
	switch (event.data.type) {
		case 'init':
			init(event.data.search);
		case 'source':
			if (butternut) {
				squash(event.data.source);
			} else {
				pendingSource = event.data.source;
			}
			break;
	}
});

function squash(source) {
	try {
		const { code } = butternut.squash(source, {
			check: true
		});

		self.postMessage({
			type: 'result',
			squashed: code
		});
	} catch (error) {
		self.postMessage({
			type: 'error',
			message: error.message
		});
	}
}

}());

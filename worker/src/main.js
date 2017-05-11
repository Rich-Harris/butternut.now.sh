// load Butternut
const versionMatch = typeof window !== 'undefined'
	? /version=([^&]+)/.exec(window.location.search)
	: null;
const version = versionMatch ? versionMatch[1] : 'latest';
const url = version === 'local'
	? `/butternut.umd.js`
	: `https://unpkg.com/butternut@${version}/dist/butternut.umd.js`;

let pendingSource;
let butternut;

const xhr = new XMLHttpRequest();
xhr.onload = () => {
	const fn = new Function(xhr.responseText);
	const global = {};

	fn.call(global);
	butternut = global.butternut;

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

self.addEventListener('message', event => {
	switch (event.data.type) {
		case 'source':
			if (butternut) squash(event.data.source);
			break;
	}
});

function squash(source) {
	try {
		const {code} = butternut.squash(source, {
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

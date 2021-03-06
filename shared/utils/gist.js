const cache = {};

export function getSourceFromGist ( id ) {
	let cancelled = false;

	if ( !cache[ id ] ) {
		cache[ id ] = new Promise( ( resolve, reject ) => {
			const request = new XMLHttpRequest();
			request.open( 'GET', `https://api.github.com/gists/${id}` );
			request.onload = () => resolve( request );
			request.onerror = () => reject( new TypeError('Network request failed') );
			request.send();
		} )
			.then( r => JSON.parse(r.responseText) )
			.then( gist => {
				return gist.files[ 'input.js' ].content;
			})
			.catch( err => {
				cache[ id ] = null;
				throw err;
			});
	}

	const promise = cache[ id ].then( source => {
		if ( cancelled ) throw new Error( `Request was cancelled` );
		return source;
	});

	promise.cancel = () => {
		cancelled = true;
	};

	return promise;
}

export function saveSourceAsGist ( content ) {
	const files = {
		'README.md': {
			content: `# Butternut\n\nThis gist was generated by the [Butternut REPL](https://butternut.now.sh). Visit https://butternut.now.sh/?gist=this_gist_id to see it.`
		},

		'input.js': {
			content
		}
	};

	const body = JSON.stringify({
		description: 'Butternut input',
		public: true,
		files
	});

	return new Promise( ( resolve, reject ) => {
		const request = new XMLHttpRequest();
		request.open( 'POST', `https://api.github.com/gists` );
		request.onload = () => resolve( request );
		request.onerror = () => reject( new TypeError('Network request failed') );
		request.send(body);
	} )
		.then( r => JSON.parse(r.responseText) )
		.then( gist => gist.id );
}

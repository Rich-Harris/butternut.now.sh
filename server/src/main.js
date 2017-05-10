import path from 'path';
import fs from 'fs';
import express from 'express';
import compression from 'compression';
import Home from '../../shared/Home.html';

const dev = process.env.DEV;

const app = express();

const root = path.resolve( __dirname, '../..' );

app.use( compression({ threshold: 0 }) );

app.use( express.static( 'node_modules/butternut/dist', {
	maxAge: '60s'
}));

app.use( express.static( 'client/dist', {
	maxAge: dev ? '1s' : '1y'
}));

app.use( express.static( 'public', {
	maxAge: 1000 * 60 * 60 * 24 // one day
}));

app.get( '/', ( req, res ) => {
	const template = fs.readFileSync( `${root}/server/templates/index.html`, 'utf-8' );
	const home = Home.render();

	const html = template.replace( '__route__', home );

	res.end( html );
});

app.listen( 6789, () => {
	console.log( 'listening on localhost:6789' );
});
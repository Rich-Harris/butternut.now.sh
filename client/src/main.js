import Home from '../../shared/Home.html';

const target = document.body.querySelector( 'main' );
target.innerHTML = ''; // TODO hydration

const app = new Home({
	target
});
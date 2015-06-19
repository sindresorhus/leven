#!/usr/bin/env node
'use strict';
var meow = require('meow');
var leven = require('./');

var cli = meow({
	help: [
		'Example',
		'  $ leven cat cow',
		'  2'
	]
});

if (cli.input.length < 2) {
	console.error('Expected two strings');
	process.exit(1);
}

console.log(leven(cli.input[0], cli.input[1]));

/* globals bench suite */
'use strict';
var levenshteinEditDistance = require('levenshtein-edit-distance');
var fastLevenshtein = require('fast-levenshtein').get;
var levenshteinComponent = require('levenshtein-component');
var ld = require('ld').computeDistance;
var levdist = require('levdist');
var natural = require('natural').LevenshteinDistance;
var levenshtein = require('levenshtein');
var leven = require('./');

function run(fn) {
	fn('a', 'b');
	fn('ab', 'ac');
	fn('ac', 'bc');
	fn('abc', 'axc');
	fn('kitten', 'sitting');
	fn('xabxcdxxefxgx', '1ab2cd34ef5g6');
	fn('cat', 'cow');
	fn('xabxcdxxefxgx', 'abcdefg');
	fn('javawasneat', 'scalaisgreat');
	fn('example', 'samples');
	fn('sturgeon', 'urgently');
	fn('levenshtein', 'frankenstein');
	fn('distance', 'difference');
	fn('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文');
}

suite('leven', function () {
	bench('leven', function () {
		run(leven);
	});

	bench('levenshtein-edit-distance', function () {
		run(levenshteinEditDistance);
	});

	bench('fast-levenshtein', function () {
		run(fastLevenshtein);
	});

	bench('levenshtein-component', function () {
		run(levenshteinComponent);
	});

	bench('levdist', function () {
		run(levdist);
	});

	bench('ld', function () {
		run(ld);
	});

	bench('natural', function () {
		run(natural);
	});

	bench('levenshtein', function () {
		run(levenshtein);
	});
});

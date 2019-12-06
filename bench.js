/* globals bench suite */
'use strict';
const levenshteinEditDistance = require('levenshtein-edit-distance');
const fastLevenshtein = require('fast-levenshtein').get;
const levenshteinComponent = require('levenshtein-component');
const ld = require('ld').computeDistance;
const levdist = require('levdist');
const natural = require('natural').LevenshteinDistance;
const levenshtein = require('levenshtein');
const talisman = require('talisman/metrics/distance/levenshtein');
const leven = require('.');

const strings = [
	['a', 'b'],
	['ab', 'ac'],
	['ac', 'bc'],
	['abc', 'axc'],
	['kitten', 'sitting'],
	['xabxcdxxefxgx', '1ab2cd34ef5g6'],
	['cat', 'cow'],
	['xabxcdxxefxgx', 'abcdefg'],
	['javawasneat', 'scalaisgreat'],
	['example', 'samples'],
	['sturgeon', 'urgently'],
	['levenshtein', 'frankenstein'],
	['distance', 'difference'],
	['I know not all that may be coming, but be it what it will, I\'ll go to it laughing', 'short'],
	['Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.']
]

function run(fn, ...args) {
	strings.forEach(([left, right]) => {
		fn(left, right, ...args)
	})
}

suite('leven', () => {
	bench('leven', () => {
		run(leven);
	});

	bench('leven with maxDistance:5', () => {
		run(leven, {maxDistance: 5})
	});

	bench('leven with maxDistance:10', () => {
		run(leven, {maxDistance: 10})
	});

	bench('talisman', () => {
		run(talisman);
	});

	bench('levenshtein-edit-distance', () => {
		run(levenshteinEditDistance);
	});

	bench('fast-levenshtein', () => {
		run(fastLevenshtein);
	});

	bench('levenshtein-component', () => {
		run(levenshteinComponent);
	});

	bench('ld', () => {
		run(ld);
	});

	bench('levenshtein', () => {
		run(levenshtein);
	});

	bench('levdist', () => {
		run(levdist);
	});

	bench('natural', () => {
		run(natural);
	});
});

/* globals bench suite */
import levenshteinEditDistance from 'levenshtein-edit-distance';
import {get as fastLevenshtein} from 'fast-levenshtein';
import levenshteinComponent from 'levenshtein-component';
import {computeDistance as ld} from 'ld';
import levdist from 'levdist';
import {LevenshteinDistance as natural} from 'natural';
import levenshtein from 'levenshtein';
import talisman from 'talisman/metrics/distance/levenshtein';
import leven from './index.js';

function run(function_) {
	function_('a', 'b');
	function_('ab', 'ac');
	function_('ac', 'bc');
	function_('abc', 'axc');
	function_('kitten', 'sitting');
	function_('xabxcdxxefxgx', '1ab2cd34ef5g6');
	function_('cat', 'cow');
	function_('xabxcdxxefxgx', 'abcdefg');
	function_('javawasneat', 'scalaisgreat');
	function_('example', 'samples');
	function_('sturgeon', 'urgently');
	function_('levenshtein', 'frankenstein');
	function_('distance', 'difference');
	function_('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文');
	function_('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.');
}

suite('leven', () => {
	bench('leven', () => {
		run(leven);
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

'use strict';
var test = require('ava');
var leven = require('./');

test(function (t) {
	t.assert(leven('a', 'b') === 1);
	t.assert(leven('ab', 'ac') === 1);
	t.assert(leven('ac', 'bc') === 1);
	t.assert(leven('abc', 'axc') === 1);
	t.assert(leven('kitten', 'sitting') === 3);
	t.assert(leven('xabxcdxxefxgx', '1ab2cd34ef5g6') === 6);
	t.assert(leven('cat', 'cow') === 2);
	t.assert(leven('xabxcdxxefxgx', 'abcdefg') === 6);
	t.assert(leven('javawasneat', 'scalaisgreat') === 7);
	t.assert(leven('example', 'samples') === 3);
	t.assert(leven('sturgeon', 'urgently') === 6);
	t.assert(leven('levenshtein', 'frankenstein') === 6);
	t.assert(leven('distance', 'difference') === 5);
	t.assert(leven('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文') === 2);
});

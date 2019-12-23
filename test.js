import test from 'ava';
import leven from '.';

test('main', t => {
	t.is(leven('a', 'b'), 1);
	t.is(leven('ab', 'ac'), 1);
	t.is(leven('ac', 'bc'), 1);
	t.is(leven('abc', 'axc'), 1);
	t.is(leven('kitten', 'sitting'), 3);
	t.is(leven('xabxcdxxefxgx', '1ab2cd34ef5g6'), 6);
	t.is(leven('cat', 'cow'), 2);
	t.is(leven('xabxcdxxefxgx', 'abcdefg'), 6);
	t.is(leven('javawasneat', 'scalaisgreat'), 7);
	t.is(leven('example', 'samples'), 3);
	t.is(leven('sturgeon', 'urgently'), 6);
	t.is(leven('levenshtein', 'frankenstein'), 6);
	t.is(leven('distance', 'difference'), 5);
	t.is(leven('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文'), 2);
	t.is(leven('🔥🐎🚀', '🔥🚗🚀'), 1);
});

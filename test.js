import test from 'ava';
import m from './';

test(t => {
	t.is(m('a', 'b'), 1);
	t.is(m('ab', 'ac'), 1);
	t.is(m('ac', 'bc'), 1);
	t.is(m('abc', 'axc'), 1);
	t.is(m('kitten', 'sitting'), 3);
	t.is(m('xabxcdxxefxgx', '1ab2cd34ef5g6'), 6);
	t.is(m('cat', 'cow'), 2);
	t.is(m('xabxcdxxefxgx', 'abcdefg'), 6);
	t.is(m('javawasneat', 'scalaisgreat'), 7);
	t.is(m('example', 'samples'), 3);
	t.is(m('sturgeon', 'urgently'), 6);
	t.is(m('levenshtein', 'frankenstein'), 6);
	t.is(m('distance', 'difference'), 5);
	t.is(m('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文'), 2);
});

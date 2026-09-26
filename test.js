import test from 'ava';
import leven, {closestMatch} from './index.js';

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
});

test('maxDistance option', t => {
	// Test cases from the GitHub issue
	t.is(leven('abcdef', '123456'), 6);
	t.is(leven('abcdef', 'abcdefg'), 1);

	// With maxDistance option
	t.is(leven('abcdef', '123456', {maxDistance: 3}), 3);
	t.is(leven('abcdef', 'abcdefg', {maxDistance: 3}), 1);

	// Additional test cases
	t.is(leven('kitten', 'sitting', {maxDistance: 2}), 2); // Actual distance is 3, should return 2 (max)
	t.is(leven('cat', 'cow', {maxDistance: 5}), 2); // Actual distance is 2, should return 2
	t.is(leven('same', 'same', {maxDistance: 1}), 0); // Identical strings always return 0

	// Early termination based on length difference
	t.is(leven('a', 'abcdefgh', {maxDistance: 3}), 3); // Length diff is 7, exceeds max
	t.is(leven('short', 'muchlongerstringhere', {maxDistance: 5}), 5);

	// Edge cases
	t.is(leven('', 'abc', {maxDistance: 2}), 2); // Empty string
	t.is(leven('', 'abc', {maxDistance: 10}), 3); // Empty string, max > actual
	t.is(leven('abc', '', {maxDistance: 2}), 2); // Empty string reversed
	t.is(leven('abc', 'abc', {maxDistance: 0}), 0); // Identical with max 0
	t.is(leven('abc', 'abd', {maxDistance: 0}), 0); // Different with max 0

	// Verify early termination is working
	t.is(leven('abcdefghijklmnopqrstuvwxyz', '1234567890', {maxDistance: 3}), 3);
	t.is(leven('verylongstringhere', 'completelydifferent', {maxDistance: 1}), 1);

	// Backward compatibility - no options provided
	t.is(leven('foo', 'bar'), 3);
	t.is(leven('foo', 'bar', undefined), 3);
	t.is(leven('foo', 'bar', null), 3);
});

// A plain dynamic programming table, so the banded table can be checked against something that does not share its logic.
const referenceDistance = (first, second) => {
	const table = Array.from({length: first.length + 1}, () => Array(second.length + 1).fill(0));

	for (let index = 0; index <= first.length; index++) {
		table[index][0] = index;
	}

	for (let index = 0; index <= second.length; index++) {
		table[0][index] = index;
	}

	for (let i = 1; i <= first.length; i++) {
		for (let j = 1; j <= second.length; j++) {
			const substitution = first[i - 1] === second[j - 1] ? 0 : 1;
			table[i][j] = Math.min(
				table[i - 1][j] + 1,
				table[i][j - 1] + 1,
				table[i - 1][j - 1] + substitution,
			);
		}
	}

	return table[first.length][second.length];
};

test('every length combination agrees with a full distance table', t => {
	const alphabet = 'abc';
	let seed = 1;
	const word = length => {
		let result = '';
		for (let index = 0; index < length; index++) {
			seed = (seed * 1103515245 + 12345) & 0x7FFFFF;
			result += alphabet[seed % alphabet.length];
		}

		return result;
	};

	for (let firstLength = 0; firstLength <= 8; firstLength++) {
		for (let secondLength = 0; secondLength <= 8; secondLength++) {
			seed = firstLength * 37 + secondLength + 1;
			const first = word(firstLength);
			seed = firstLength * 91 + secondLength + 5;
			const second = word(secondLength);

			const distance = referenceDistance(first, second);
			const label = `${JSON.stringify(first)} / ${JSON.stringify(second)}`;

			t.is(leven(first, second), distance, label);

			// Every cap below the real distance must return the cap, and every cap from the real distance upwards must return that distance.
			for (let maxDistance = 0; maxDistance <= distance + 2; maxDistance++) {
				t.is(leven(first, second, {maxDistance}), Math.min(distance, maxDistance), `${label} with maxDistance ${maxDistance}`);
			}
		}
	}
});

test('strings longer than the initial buffer', t => {
	// The buffers are reused and start out small, so check strings long enough to grow them, then shorter ones to check the grown buffers are reused. The shared text is shifted, so a wrong first row or character code past the initial size changes the result.
	const text = 'the quick brown fox jumps over the lazy dog';

	for (const padding of [150, 80]) {
		const first = 'x'.repeat(padding) + text;
		const second = text + 'y'.repeat(padding);
		const distance = referenceDistance(first, second);

		t.is(leven(first, second), distance);
		t.is(leven(first, second, {maxDistance: 5}), 5);
		t.is(leven(first, second, {maxDistance: distance}), distance);
	}

	t.is(leven('kitten', 'sitting'), 3);
	t.is(leven('kitten', 'sitting', {maxDistance: 2}), 2);
});

test('buffers grown past the retained size still give correct results afterwards', t => {
	// Only the band is computed, so this is cheap, but the buffers still grow to fit the whole string. Doubling from 64 lands exactly on `2 ** 20`, so the length has to be above it.
	const length = (2 ** 20) + 1;
	t.is(leven('a'.repeat(length), 'b'.repeat(length), {maxDistance: 1}), 1);

	t.is(leven('kitten', 'sitting'), 3);
	t.is(leven('kitten', 'sitting', {maxDistance: 2}), 2);
});

test('a maxDistance that cannot bound a distance is ignored', t => {
	t.is(leven('kitten', 'sitting', {maxDistance: Number.NaN}), 3);
	t.is(leven('kitten', 'sitting', {maxDistance: 2.5}), 3);
	t.is(leven('kitten', 'sitting', {maxDistance: -1}), 3);
	t.is(leven('kitten', 'sitting', {maxDistance: Number.POSITIVE_INFINITY}), 3);

	t.is(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: Number.NaN}), 'kitchen');
	t.is(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: 2.5}), 'kitchen');
	t.is(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: -1}), 'kitchen');
});

test('closestMatch', t => {
	// Basic functionality
	// 'kitchen' and 'mittens' are both 2 away, so the first in input order wins
	t.is(closestMatch('kitten', ['sitting', 'kitchen', 'mittens']), 'kitchen');
	t.is(closestMatch('hello', ['jello', 'yellow', 'bellow']), 'jello');

	// With exact match
	t.is(closestMatch('foo', ['bar', 'foo', 'baz']), 'foo');

	// Single candidate
	t.is(closestMatch('test', ['testing']), 'testing');

	// Empty candidates
	t.is(closestMatch('test', []), undefined);
	t.is(closestMatch('test', undefined), undefined);
	t.is(closestMatch('test', null), undefined);

	// All equally distant
	t.is(closestMatch('a', ['b', 'c', 'd']), 'b'); // Should return first one

	// With maxDistance option
	t.is(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: 2}), 'kitchen');
	t.is(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: 1}), undefined); // No matches within distance 1
	t.is(closestMatch('abcdef', ['123456', 'abcdefg', '1234567890'], {maxDistance: 2}), 'abcdefg');

	// No match within maxDistance
	t.is(closestMatch('abcdef', ['123456', '1234567890'], {maxDistance: 2}), undefined);

	// Empty string cases
	t.is(closestMatch('', ['a', 'ab', 'abc']), 'a');
	t.is(closestMatch('abc', ['', 'a', 'ab']), 'ab'); // Distance 1 is closest

	// Case sensitivity
	t.is(closestMatch('Hello', ['hello', 'HELLO', 'hELLo']), 'hello');

	// Unicode strings
	t.is(closestMatch('café', ['cafe', 'caffè', 'café']), 'café');
	t.is(closestMatch('你好', ['您好', '你们好', '大家好']), '您好');

	// Multiple candidates with same distance - should return first
	t.is(closestMatch('abc', ['ab', 'bc', 'ac']), 'ab');

	// Performance test case - should use maxDistance optimization
	const longCandidates = [
		'verylongstringwithlotsofcharacters',
		'anotherlongstringcompletlydifferent',
		'shortstr',
		'test',
	];
	t.is(closestMatch('test', longCandidates), 'test');
	t.is(closestMatch('testing', longCandidates), 'test');

	// Edge cases from review
	// Exact match should return immediately
	t.is(closestMatch('test', ['a', 'b', 'c', 'test', 'd', 'e']), 'test');

	// MaxDistance: 0 only accepts exact matches
	t.is(closestMatch('test', ['test', 'tests', 'testing'], {maxDistance: 0}), 'test');
	t.is(closestMatch('test', ['tests', 'testing'], {maxDistance: 0}), undefined);

	// Duplicates shouldn't affect result
	t.is(closestMatch('abc', ['ab', 'ab', 'ab', 'abcd', 'abcd']), 'ab');

	// LengthDiff === bestDistance should be skipped
	t.is(closestMatch('ab', ['a', 'abc']), 'a'); // Both distance 1, return first

	// Large array optimization (sorting by length diff)
	const largeArray = Array.from({length: 50}, (_, index) => 'x'.repeat(index));
	largeArray.push('test'); // Add exact match
	t.is(closestMatch('test', largeArray), 'test');

	// Dynamic cap behavior - shouldn't incorrectly prefer worse candidates
	t.is(closestMatch('abc', ['ab', 'abcd', 'xyz'], {maxDistance: 2}), 'ab');

	// Tie-break stability for large arrays (>32 items) - should pick first in input order
	const largeTieArray = Array.from({length: 50}, (_, i) => `z${i}`);
	largeTieArray.push('ab', 'ac', 'ad'); // All distance 1 from 'a'
	t.is(closestMatch('a', largeTieArray), 'ab'); // Should pick first equal candidate

	// Ensure capped path never "improves" candidate due to cap
	t.is(closestMatch('test', ['testing', 'tests'], {maxDistance: 2}), 'tests');
	t.is(closestMatch('test', ['testing', 'tests']), 'tests'); // Same result without cap

	// Additional maxDistance edge case
	t.is(closestMatch('test', ['testing'], {maxDistance: 0}), undefined); // No exact match

	// A candidate sitting exactly on the limit still counts as a match
	t.is(closestMatch('abc', ['xyz', 'abd'], {maxDistance: 1}), 'abd');
	t.is(closestMatch('abc', ['abd', 'abe'], {maxDistance: 1}), 'abd');
	t.is(closestMatch('abc', ['xyz', 'abd'], {maxDistance: 0}), undefined);

	// A later candidate that is strictly closer still wins over one already within the limit
	t.is(closestMatch('abcd', ['abxy', 'abcx'], {maxDistance: 2}), 'abcx');
});

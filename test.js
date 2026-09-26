import test from 'node:test';
import assert from 'node:assert/strict';
import leven, {closestMatch} from './index.js';

test('main', () => {
	assert.equal(leven('a', 'b'), 1);
	assert.equal(leven('ab', 'ac'), 1);
	assert.equal(leven('ac', 'bc'), 1);
	assert.equal(leven('abc', 'axc'), 1);
	assert.equal(leven('kitten', 'sitting'), 3);
	assert.equal(leven('xabxcdxxefxgx', '1ab2cd34ef5g6'), 6);
	assert.equal(leven('cat', 'cow'), 2);
	assert.equal(leven('xabxcdxxefxgx', 'abcdefg'), 6);
	assert.equal(leven('javawasneat', 'scalaisgreat'), 7);
	assert.equal(leven('example', 'samples'), 3);
	assert.equal(leven('sturgeon', 'urgently'), 6);
	assert.equal(leven('levenshtein', 'frankenstein'), 6);
	assert.equal(leven('distance', 'difference'), 5);
	assert.equal(leven('因為我是中國人所以我會說中文', '因為我是英國人所以我會說英文'), 2);
});

test('maxDistance option', () => {
	// Test cases from the GitHub issue
	assert.equal(leven('abcdef', '123456'), 6);
	assert.equal(leven('abcdef', 'abcdefg'), 1);

	// With maxDistance option
	assert.equal(leven('abcdef', '123456', {maxDistance: 3}), 3);
	assert.equal(leven('abcdef', 'abcdefg', {maxDistance: 3}), 1);

	// Additional test cases
	assert.equal(leven('kitten', 'sitting', {maxDistance: 2}), 2); // Actual distance is 3, should return 2 (max)
	assert.equal(leven('cat', 'cow', {maxDistance: 5}), 2); // Actual distance is 2, should return 2
	assert.equal(leven('same', 'same', {maxDistance: 1}), 0); // Identical strings always return 0

	// Early termination based on length difference
	assert.equal(leven('a', 'abcdefgh', {maxDistance: 3}), 3); // Length diff is 7, exceeds max
	assert.equal(leven('short', 'muchlongerstringhere', {maxDistance: 5}), 5);

	// Edge cases
	assert.equal(leven('', 'abc', {maxDistance: 2}), 2); // Empty string
	assert.equal(leven('', 'abc', {maxDistance: 10}), 3); // Empty string, max > actual
	assert.equal(leven('abc', '', {maxDistance: 2}), 2); // Empty string reversed
	assert.equal(leven('abc', 'abc', {maxDistance: 0}), 0); // Identical with max 0
	assert.equal(leven('abc', 'abd', {maxDistance: 0}), 0); // Different with max 0

	// Verify early termination is working
	assert.equal(leven('abcdefghijklmnopqrstuvwxyz', '1234567890', {maxDistance: 3}), 3);
	assert.equal(leven('verylongstringhere', 'completelydifferent', {maxDistance: 1}), 1);

	// Backward compatibility - no options provided
	assert.equal(leven('foo', 'bar'), 3);
	assert.equal(leven('foo', 'bar', undefined), 3);
	assert.equal(leven('foo', 'bar', null), 3);
});

// A plain dynamic programming table, so the banded table can be checked against something that does not share its logic.
const referenceDistance = (first, second) => {
	const table = Array.from({length: first.length + 1}, () => Array.from({length: second.length + 1}, () => 0));

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

test('every length combination agrees with a full distance table', () => {
	const alphabet = 'abc';
	let seed = 1;
	const word = length => {
		let result = '';
		for (let index = 0; index < length; index++) {
			seed = ((seed * 1_103_515_245) + 12_345) & 0x7F_FF_FF;
			result += alphabet[seed % alphabet.length];
		}

		return result;
	};

	for (let firstLength = 0; firstLength <= 8; firstLength++) {
		for (let secondLength = 0; secondLength <= 8; secondLength++) {
			seed = (firstLength * 37) + secondLength + 1;
			const first = word(firstLength);
			seed = (firstLength * 91) + secondLength + 5;
			const second = word(secondLength);

			const distance = referenceDistance(first, second);
			const label = `${JSON.stringify(first)} / ${JSON.stringify(second)}`;

			assert.equal(leven(first, second), distance, label);

			// Every cap below the real distance must return the cap, and every cap from the real distance upwards must return that distance.
			for (let maxDistance = 0; maxDistance <= distance + 2; maxDistance++) {
				assert.equal(leven(first, second, {maxDistance}), Math.min(distance, maxDistance), `${label} with maxDistance ${maxDistance}`);
			}
		}
	}
});

test('strings longer than the initial buffer', () => {
	// The buffers are reused and start out small, so check strings long enough to grow them, then shorter ones to check the grown buffers are reused. The shared text is shifted, so a wrong first row or character code past the initial size changes the result.
	const text = 'the quick brown fox jumps over the lazy dog';

	for (const padding of [150, 80]) {
		const first = 'x'.repeat(padding) + text;
		const second = text + 'y'.repeat(padding);
		const distance = referenceDistance(first, second);

		assert.equal(leven(first, second), distance);
		assert.equal(leven(first, second, {maxDistance: 5}), 5);
		assert.equal(leven(first, second, {maxDistance: distance}), distance);
	}

	assert.equal(leven('kitten', 'sitting'), 3);
	assert.equal(leven('kitten', 'sitting', {maxDistance: 2}), 2);
});

test('buffers grown past the retained size still give correct results afterwards', () => {
	// Only the band is computed, so this is cheap, but the buffers still grow to fit the whole string. Doubling from 64 lands exactly on `2 ** 20`, so the length has to be above it.
	const length = (2 ** 20) + 1;
	assert.equal(leven('a'.repeat(length), 'b'.repeat(length), {maxDistance: 1}), 1);

	assert.equal(leven('kitten', 'sitting'), 3);
	assert.equal(leven('kitten', 'sitting', {maxDistance: 2}), 2);
});

test('a maxDistance that cannot bound a distance is ignored', () => {
	assert.equal(leven('kitten', 'sitting', {maxDistance: NaN}), 3);
	assert.equal(leven('kitten', 'sitting', {maxDistance: 2.5}), 3);
	assert.equal(leven('kitten', 'sitting', {maxDistance: -1}), 3);
	assert.equal(leven('kitten', 'sitting', {maxDistance: Infinity}), 3);

	assert.equal(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: NaN}), 'kitchen');
	assert.equal(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: 2.5}), 'kitchen');
	assert.equal(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: -1}), 'kitchen');
});

test('closestMatch', () => {
	// Basic functionality
	// 'kitchen' and 'mittens' are both 2 away, so the first in input order wins
	assert.equal(closestMatch('kitten', ['sitting', 'kitchen', 'mittens']), 'kitchen');
	assert.equal(closestMatch('hello', ['jello', 'yellow', 'bellow']), 'jello');

	// With exact match
	assert.equal(closestMatch('foo', ['bar', 'foo', 'baz']), 'foo');

	// Single candidate
	assert.equal(closestMatch('test', ['testing']), 'testing');

	// Empty candidates
	assert.equal(closestMatch('test', []), undefined);
	assert.equal(closestMatch('test', undefined), undefined);
	assert.equal(closestMatch('test', null), undefined);

	// All equally distant
	assert.equal(closestMatch('a', ['b', 'c', 'd']), 'b'); // Should return first one

	// With maxDistance option
	assert.equal(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: 2}), 'kitchen');
	assert.equal(closestMatch('kitten', ['sitting', 'kitchen', 'mittens'], {maxDistance: 1}), undefined); // No matches within distance 1
	assert.equal(closestMatch('abcdef', ['123456', 'abcdefg', '1234567890'], {maxDistance: 2}), 'abcdefg');

	// No match within maxDistance
	assert.equal(closestMatch('abcdef', ['123456', '1234567890'], {maxDistance: 2}), undefined);

	// Empty string cases
	assert.equal(closestMatch('', ['a', 'ab', 'abc']), 'a');
	assert.equal(closestMatch('abc', ['', 'a', 'ab']), 'ab'); // Distance 1 is closest

	// Case sensitivity
	assert.equal(closestMatch('Hello', ['hello', 'HELLO', 'hELLo']), 'hello');

	// Unicode strings
	assert.equal(closestMatch('café', ['cafe', 'caffè', 'café']), 'café');
	assert.equal(closestMatch('你好', ['您好', '你们好', '大家好']), '您好');

	// Multiple candidates with same distance - should return first
	assert.equal(closestMatch('abc', ['ab', 'bc', 'ac']), 'ab');

	// Performance test case - should use maxDistance optimization
	const longCandidates = [
		'verylongstringwithlotsofcharacters',
		'anotherlongstringcompletlydifferent',
		'shortstr',
		'test',
	];
	assert.equal(closestMatch('test', longCandidates), 'test');
	assert.equal(closestMatch('testing', longCandidates), 'test');

	// Edge cases from review
	// Exact match should return immediately
	assert.equal(closestMatch('test', ['a', 'b', 'c', 'test', 'd', 'e']), 'test');

	// MaxDistance: 0 only accepts exact matches
	assert.equal(closestMatch('test', ['test', 'tests', 'testing'], {maxDistance: 0}), 'test');
	assert.equal(closestMatch('test', ['tests', 'testing'], {maxDistance: 0}), undefined);

	// Duplicates shouldn't affect result
	assert.equal(closestMatch('abc', ['ab', 'ab', 'ab', 'abcd', 'abcd']), 'ab');

	// LengthDiff === bestDistance should be skipped
	assert.equal(closestMatch('ab', ['a', 'abc']), 'a'); // Both distance 1, return first

	// Large array optimization (sorting by length diff)
	const largeArray = Array.from({length: 50}, (_, index) => 'x'.repeat(index));
	largeArray.push('test'); // Add exact match
	assert.equal(closestMatch('test', largeArray), 'test');

	// Dynamic cap behavior - shouldn't incorrectly prefer worse candidates
	assert.equal(closestMatch('abc', ['ab', 'abcd', 'xyz'], {maxDistance: 2}), 'ab');

	// Tie-break stability for large arrays (>32 items) - should pick first in input order
	const largeTieArray = Array.from({length: 50}, (_, i) => `z${i}`);
	largeTieArray.push('ab', 'ac', 'ad'); // All distance 1 from 'a'
	assert.equal(closestMatch('a', largeTieArray), 'ab'); // Should pick first equal candidate

	// Ensure capped path never "improves" candidate due to cap
	assert.equal(closestMatch('test', ['testing', 'tests'], {maxDistance: 2}), 'tests');
	assert.equal(closestMatch('test', ['testing', 'tests']), 'tests'); // Same result without cap

	// Additional maxDistance edge case
	assert.equal(closestMatch('test', ['testing'], {maxDistance: 0}), undefined); // No exact match

	// A candidate sitting exactly on the limit still counts as a match
	assert.equal(closestMatch('abc', ['xyz', 'abd'], {maxDistance: 1}), 'abd');
	assert.equal(closestMatch('abc', ['abd', 'abe'], {maxDistance: 1}), 'abd');
	assert.equal(closestMatch('abc', ['xyz', 'abd'], {maxDistance: 0}), undefined);

	// A later candidate that is strictly closer still wins over one already within the limit
	assert.equal(closestMatch('abcd', ['abxy', 'abcx'], {maxDistance: 2}), 'abcx');
});

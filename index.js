// Buffers are reused between calls so the inner loop never allocates.
let row = new Int32Array(0);
let codes = new Uint16Array(0);

// Releasing buffers above this size on the next call that needs them keeps a single huge comparison from holding on to its memory for the rest of the process.
const maximumRetainedColumns = 2 ** 20;

export default function leven(first, second, options) {
	if (first === second) {
		return 0;
	}

	const maxDistance = options?.maxDistance;
	const swap = first;

	// Swapping the strings if `a` is longer than `b` so we know which one is the
	// shortest & which one is the longest
	if (first.length > second.length) {
		first = second;
		second = swap;
	}

	let firstLength = first.length;
	let secondLength = second.length;

	// Performing suffix trimming:
	// We can linearly drop suffix common to both strings since they
	// don't increase distance at all
	// Note: `~-` is the bitwise way to perform a `- 1` operation
	while (firstLength > 0 && (first.charCodeAt(~-firstLength) === second.charCodeAt(~-secondLength))) {
		firstLength--;
		secondLength--;
	}

	// Performing prefix trimming
	// We can linearly drop prefix common to both strings since they
	// don't increase distance at all
	let start = 0;

	while (start < firstLength && (first.charCodeAt(start) === second.charCodeAt(start))) {
		start++;
	}

	firstLength -= start;
	secondLength -= start;

	// A distance is a whole number, so a cap that is not a non-negative integer cannot bound the table and is ignored.
	if (!Number.isSafeInteger(maxDistance) || maxDistance < 0) {
		return firstLength === 0 ? secondLength : fullDistance(first, second, start, firstLength, secondLength);
	}

	// Early termination after trimming: if difference in length exceeds max distance
	if (secondLength - firstLength > maxDistance) {
		return maxDistance;
	}

	return firstLength === 0 ? secondLength : bandedDistance(first, second, start, firstLength, secondLength, maxDistance);
}

// Fills the character code cache and the first row, growing the buffers to fit.
function prepare(first, start, firstLength) {
	if (row.length < firstLength || row.length > maximumRetainedColumns) {
		let capacity = 64;

		while (capacity < firstLength) {
			capacity *= 2;
		}

		row = new Int32Array(capacity);
		codes = new Uint16Array(capacity);
	}

	for (let index = 0; index < firstLength; index++) {
		codes[index] = first.charCodeAt(start + index);
		row[index] = index + 1;
	}
}

function fullDistance(first, second, start, firstLength, secondLength) {
	prepare(first, start, firstLength);

	let current = 0;

	for (let rowIndex = 0; rowIndex < secondLength; rowIndex++) {
		const bCharacterCode = second.charCodeAt(start + rowIndex);
		let temporary = rowIndex;
		current = rowIndex + 1;

		for (let index = 0; index < firstLength; index++) {
			const substituted = bCharacterCode === codes[index] ? temporary : temporary + 1;
			temporary = row[index];
			// eslint-disable-next-line no-multi-assign
			current = row[index] = temporary > current
				? (substituted > current ? current + 1 : substituted)
				: (substituted > temporary ? temporary + 1 : substituted);
		}
	}

	return current;
}

// Same dynamic programming table as `fullDistance`, but only the cells within `maxDistance` of the diagonal are computed. Every path that stays within the cap runs through that band, so the result is exact, and a row whose minimum rises above the cap rules out every path through it.
function bandedDistance(first, second, start, firstLength, secondLength, maxDistance) {
	prepare(first, start, firstLength);

	// The smallest value a cell outside the band can hold. The cell entering the band on the right still holds its first row value from `prepare`, which is never smaller than this, so it needs no seeding.
	const outside = maxDistance + 1;

	for (let rowIndex = 0; rowIndex < secondLength; rowIndex++) {
		const bCharacterCode = second.charCodeAt(start + rowIndex);
		const low = Math.max(0, rowIndex - maxDistance);
		const high = Math.min(firstLength - 1, rowIndex + maxDistance);

		// The cell to the left of the band is also at least `maxDistance + 1`, while its diagonal is still inside the band. At the first column both are the plain prefix distances.
		let temporary = low > 0 ? row[low - 1] : rowIndex;
		let current = low > 0 ? outside : rowIndex + 1;
		let rowMinimum = outside;

		for (let index = low; index <= high; index++) {
			const substituted = bCharacterCode === codes[index] ? temporary : temporary + 1;
			temporary = row[index];
			// eslint-disable-next-line no-multi-assign
			current = row[index] = temporary > current
				? (substituted > current ? current + 1 : substituted)
				: (substituted > temporary ? temporary + 1 : substituted);

			if (current < rowMinimum) {
				rowMinimum = current;
			}
		}

		// Early termination: if all values in current row exceed maxDistance
		if (rowMinimum > maxDistance) {
			return maxDistance;
		}
	}

	const distance = row[firstLength - 1];
	return Math.min(distance, maxDistance);
}

export function closestMatch(target, candidates, options) {
	if (!Array.isArray(candidates) || candidates.length === 0) {
		return undefined;
	}

	const maxDistance = options?.maxDistance;
	const targetLength = target.length;

	// Exact match fast-path
	for (const candidate of candidates) {
		if (candidate === target) {
			return candidate;
		}
	}

	if (maxDistance === 0) {
		return undefined;
	}

	let best;
	// Starting one above the caller's limit means a candidate must be within the limit to win. It also serves as the cap for `leven`, so every distance below it is exact and no call ever has to be repeated.
	let bestDist = Number.isSafeInteger(maxDistance) && maxDistance > 0 ? maxDistance + 1 : Infinity;
	const seen = new Set();

	for (const candidate of candidates) {
		if (seen.has(candidate)) {
			continue;
		}

		seen.add(candidate);

		const lengthDiff = Math.abs(candidate.length - targetLength);
		if (lengthDiff >= bestDist) {
			continue;
		}

		const distance = bestDist === Infinity
			? leven(target, candidate)
			: leven(target, candidate, {maxDistance: bestDist});

		if (distance >= bestDist) {
			continue;
		}

		bestDist = distance;
		best = candidate;
	}

	return best;
}

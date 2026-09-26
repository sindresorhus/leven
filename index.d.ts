export type Options = {
	/**
	Maximum Levenshtein distance to calculate.

	If the actual distance exceeds this value, the function will return the maximum distance instead of the actual distance. This can significantly improve performance when you only care about matches within a certain threshold.

	Negative and non-integer values are ignored, and the distance is then not capped.

	Without `maxDistance`, the time grows with the product of the string lengths, so two long strings can block for seconds. With it, the time grows only with the string length times `maxDistance`. Set it for untrusted input.

	@example
	```
	import leven from 'leven';

	leven('abcdef', '123456', {maxDistance: 3});
	//=> 3

	leven('cat', 'cow', {maxDistance: 5});
	//=> 2
	```
	*/
	readonly maxDistance?: number;
};

/**
Measure the difference between two strings using the Levenshtein distance algorithm.

@param first - First string.
@param second - Second string.
@returns Distance between `first` and `second`. If `maxDistance` is provided and the actual distance exceeds it, returns `maxDistance`.

@example
```
import leven from 'leven';

leven('cat', 'cow');
//=> 2
```
*/
export default function leven(first: string, second: string, options?: Options): number;

/**
Find the closest matching string from an array of candidates.

@param target - The string to find matches for.
@param candidates - Array of candidate strings to search through.
@returns The closest matching string from candidates, or `undefined` if no candidates are provided or if no match is found within `maxDistance`.

@example
```
import {closestMatch} from 'leven';

closestMatch('kitten', ['sitting', 'kitchen', 'mittens']);
//=> 'kitchen'

closestMatch('hello', ['jello', 'yellow', 'bellow'], {maxDistance: 2});
//=> 'jello'
```
*/
export function closestMatch(target: string, candidates: readonly string[], options?: Options): string | undefined;

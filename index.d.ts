interface Options {
	/**
	When true, Leven will return the value of `maxDistance` if the calculated Levenshtein distance is greater than `maxDistance`.

	Additionally, Leven will determine if calculating the Levenshtein distance is necessary by comparing the difference in string length between `left` and
	`right` to `maxDistance`, which may lead to an increase of performance in your app.

	@example
	```
	import leven = require('leven');

	leven('breathtaking', 'car', {maxDistance: 4});
	//=> 4

	leven('breathtaking', 'car');
	//=> 11
	```
	 */
	readonly maxDistance?: number
}

declare const leven: {
	/**
	Measure the difference between two strings.

	@example
	```
	import leven = require('leven');

	leven('cat', 'cow');
	//=> 2
	```
	*/
	(left: string, right: string, options?: Options): number;

	// TODO: Remove this for the next major release, refactor the whole definition to:
	// declare function leven(left: string, right: string): number;
	// export = leven;
	default: typeof leven;
};

export = leven;

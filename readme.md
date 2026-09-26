# leven

> Measure the difference between two strings using the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) algorithm

## Install

```sh
npm install leven
```

## Usage

```js
import leven from 'leven';

leven('cat', 'cow');
//=> 2
```

## API

### leven(first, second, options?)

#### first

Type: `string`

First string.

#### second

Type: `string`

Second string.

#### options

Type: `object`

##### maxDistance

Type: `number`

Maximum distance to calculate.

If the actual distance exceeds this value, the function will return `maxDistance` instead of the actual distance. This can significantly improve performance when you only care about matches within a certain threshold.

Negative and non-integer values are ignored, and the distance is then not capped.

> [!TIP]
> Without `maxDistance`, the time grows with the product of the string lengths, so two long strings can block for seconds. With it, the time grows only with the string length times `maxDistance`. Set it for untrusted input.

```js
import leven from 'leven';

leven('abcdef', '123456', {maxDistance: 3});
//=> 3

leven('cat', 'cow', {maxDistance: 5});
//=> 2
```

### closestMatch(target, candidates, options?)

Find the closest matching string from an array of candidates.

#### target

Type: `string`

The string to find matches for.

#### candidates

Type: `string[]`

Array of candidate strings to search through.

#### options

Type: `object`

Same options as `leven()`.

##### maxDistance

Type: `number`

Maximum distance to consider. Candidates with a distance greater than this value will be ignored.

Returns the closest matching string from candidates, or `undefined` if no candidates are provided or if no match is found within `maxDistance`.

```js
import {closestMatch} from 'leven';

closestMatch('kitten', ['sitting', 'kitchen', 'mittens']);
//=> 'kitchen'

closestMatch('hello', ['jello', 'yellow', 'bellow'], {maxDistance: 2});
//=> 'jello'

// No match within distance threshold
closestMatch('abcdef', ['123456', '1234567890'], {maxDistance: 2});
//=> undefined
```

## Related

- [leven-cli](https://github.com/sindresorhus/leven-cli) - CLI for this module

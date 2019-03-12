# leven [![Build Status](https://travis-ci.org/sindresorhus/leven.svg?branch=master)](https://travis-ci.org/sindresorhus/leven)

> Measure the difference between two strings<br>
> One of the fastest JS implementations of the [Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) algorithm


## Install

```
$ npm install --save leven
```


## Usage

```js
const leven = require('leven');

leven('cat', 'cow');
//=> 2
```


## Benchmark

```
$ npm run bench
```

```
         356,392 op/s » leven
         365,381 op/s » talisman
         272,076 op/s » levenshtein-edit-distance
         180,289 op/s » fast-levenshtein
         169,901 op/s » levenshtein-component
          82,921 op/s » ld
          70,285 op/s » levenshtein
          48,619 op/s » levdist
           6,108 op/s » natural
```


## Related

- [leven-cli](https://github.com/sindresorhus/leven-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)

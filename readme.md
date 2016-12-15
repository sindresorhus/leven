# leven [![Build Status](https://travis-ci.org/sindresorhus/leven.svg?branch=master)](https://travis-ci.org/sindresorhus/leven)

> Measure the difference between two strings<br>
> The fastest JS implementation of the [Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) algorithm


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
       337,624 op/s » leven
       285,154 op/s » levenshtein-edit-distance
       164,496 op/s » fast-levenshtein
        64,034 op/s » levenshtein-component
        22,013 op/s » levdist
        24,400 op/s » ld
        20,803 op/s » natural
        13,223 op/s » levenshtein
```


## Related

- [leven-cli](https://github.com/sindresorhus/leven-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)

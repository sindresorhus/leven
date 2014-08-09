# leven [![Build Status](https://travis-ci.org/sindresorhus/leven.svg?branch=master)](https://travis-ci.org/sindresorhus/leven)

> Measure the difference between two strings  
> The fastest JS implementation of the [Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) algorithm


## Install

```sh
$ npm install --save leven
```


## Usage

```js
var leven = require('leven');

leven('cat', 'cow');
//=> 2
```


## Benchmark

```sh
$ npm run bench
```
```
         203,025 op/s » leven
          46,748 op/s » levenshtein-edit-distance
          42,073 op/s » fast-levenshtein
          29,508 op/s » levenshtein-component
          24,183 op/s » ld
          18,065 op/s » levdist
          15,022 op/s » natural
          11,764 op/s » levenshtein
```


## CLI

```sh
$ npm install --global leven
```

```sh
$ leven --help

  Example
    leven cat cow
    2
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)

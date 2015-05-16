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
         343,757 op/s » leven
         264,625 op/s » levenshtein-edit-distance
          49,981 op/s » fast-levenshtein
          25,496 op/s » levenshtein-component
          18,240 op/s » levdist
          17,554 op/s » ld
          12,633 op/s » natural
           9,960 op/s » levenshtein
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

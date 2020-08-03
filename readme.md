# leven [![Build Status](https://travis-ci.org/sindresorhus/leven.svg?branch=master)](https://travis-ci.org/sindresorhus/leven)

> Measure the difference between two strings<br>
> Implementation of the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) algorithm


## Install

```
$ npm install leven
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
                      50 words, length max=15 min=5 avr=8.4
         476,628 op/s » fastest-levenshtein
         427,831 op/s » fast-levenshtein
         171,965 op/s » js-levenshtein
         136,828 op/s » leven
         130,892 op/s » talisman
         134,643 op/s » levenshtein-edit-distance
          71,828 op/s » levenshtein-component
          42,189 op/s » ld
          32,185 op/s » levenshtein
          27,428 op/s » levdist
           4,014 op/s » natural

                      20 sentences, length max=106 min=30 avr=64.4
          49,949 op/s » fastest-levenshtein
          48,797 op/s » fast-levenshtein
           8,871 op/s » js-levenshtein
           5,295 op/s » leven
           5,812 op/s » talisman
           4,920 op/s » levenshtein-edit-distance
           2,867 op/s » levenshtein-component
           1,582 op/s » ld
           1,651 op/s » levenshtein
           1,376 op/s » levdist
             190 op/s » natural

                      10 paragraphs, length max=565 min=186 avr=340
           3,578 op/s » fastest-levenshtein
           3,439 op/s » fast-levenshtein
             583 op/s » js-levenshtein
             355 op/s » leven
             374 op/s » talisman
             341 op/s » levenshtein-edit-distance
             189 op/s » levenshtein-component
              91 op/s » ld
             102 op/s » levenshtein
              89 op/s » levdist
               5 op/s » natural
```


## Related

- [leven-cli](https://github.com/sindresorhus/leven-cli) - CLI for this module


---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-leven?utm_source=npm-leven&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>

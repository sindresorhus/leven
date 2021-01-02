# leven

> Measure the difference between two strings<br>
> One of the fastest JS implementations of the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) algorithm


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
         165,926 op/s » leven
         164,398 op/s » talisman
           1,044 op/s » levenshtein-edit-distance
             628 op/s » fast-levenshtein
             497 op/s » levenshtein-component
             195 op/s » ld
             190 op/s » levenshtein
             168 op/s » levdist
              10 op/s » natural
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

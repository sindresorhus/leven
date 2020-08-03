/* globals bench suite */
'use strict';
const levenshteinEditDistance = require('levenshtein-edit-distance');
const fastLevenshtein = require('fast-levenshtein').get;
const levenshteinComponent = require('levenshtein-component');
const ld = require('ld').computeDistance;
const levdist = require('levdist');
const natural = require('natural').LevenshteinDistance;
const levenshtein = require('levenshtein');
const talisman = require('talisman/metrics/distance/levenshtein');
const {distance} = require('fastest-levenshtein');
const jsLevenshtein = require('js-levenshtein');
const leven = require('.');

function wordBench(fn) {
	for (let i = 0; i + 1 < words.length; i += 2) {
		const w1 = words[i];
		const w2 = words[i + 1];
		fn(w1, w2);
	}
}

function sentenceBench(fn) {
	for (let i = 0; i + 1 < sentences.length; i += 2) {
		const s1 = sentences[i];
		const s2 = sentences[i + 1];
		fn(s1, s2);
	}
}

function paragraphBench(fn) {
	for (let i = 0; i + 1 < paragraphs.length; i += 2) {
		const p1 = paragraphs[i];
		const p2 = paragraphs[i + 1];
		fn(p1, p2);
	}
}

suite('50 words, length max=15 min=5 avr=8.4', () => {
	bench('fastest-levenshtein', () => {
		wordBench(distance);
	});

	bench('fast-levenshtein', () => {
		wordBench(fastLevenshtein);
	});

	bench('js-levenshtein', () => {
		wordBench(jsLevenshtein);
	});

	bench('leven', () => {
		wordBench(leven);
	});

	bench('talisman', () => {
		wordBench(talisman);
	});

	bench('levenshtein-edit-distance', () => {
		wordBench(levenshteinEditDistance);
	});

	bench('levenshtein-component', () => {
		wordBench(levenshteinComponent);
	});

	bench('ld', () => {
		wordBench(ld);
	});

	bench('levenshtein', () => {
		wordBench(levenshtein);
	});

	bench('levdist', () => {
		wordBench(levdist);
	});

	bench('natural', () => {
		wordBench(natural);
	});
});

suite('20 sentences, length max=106 min=30 avr=64.4', () => {
	bench('fastest-levenshtein', () => {
		sentenceBench(distance);
	});

	bench('fast-levenshtein', () => {
		sentenceBench(fastLevenshtein);
	});

	bench('js-levenshtein', () => {
		sentenceBench(jsLevenshtein);
	});

	bench('leven', () => {
		sentenceBench(leven);
	});

	bench('talisman', () => {
		sentenceBench(talisman);
	});

	bench('levenshtein-edit-distance', () => {
		sentenceBench(levenshteinEditDistance);
	});

	bench('levenshtein-component', () => {
		sentenceBench(levenshteinComponent);
	});

	bench('ld', () => {
		sentenceBench(ld);
	});

	bench('levenshtein', () => {
		sentenceBench(levenshtein);
	});

	bench('levdist', () => {
		sentenceBench(levdist);
	});

	bench('natural', () => {
		sentenceBench(natural);
	});
});

suite('10 paragraphs, length max=565 min=186 avr=340', () => {
	bench('fastest-levenshtein', () => {
		paragraphBench(distance);
	});

	bench('fast-levenshtein', () => {
		paragraphBench(fastLevenshtein);
	});

	bench('js-levenshtein', () => {
		paragraphBench(jsLevenshtein);
	});

	bench('leven', () => {
		paragraphBench(leven);
	});

	bench('talisman', () => {
		paragraphBench(talisman);
	});

	bench('levenshtein-edit-distance', () => {
		paragraphBench(levenshteinEditDistance);
	});

	bench('levenshtein-component', () => {
		paragraphBench(levenshteinComponent);
	});

	bench('ld', () => {
		paragraphBench(ld);
	});

	bench('levenshtein', () => {
		paragraphBench(levenshtein);
	});

	bench('levdist', () => {
		paragraphBench(levdist);
	});

	bench('natural', () => {
		paragraphBench(natural);
	});
});

const words = [
	'vizierate',
	'lyophilizing',
	'bucklered',
	'gonglike',
	'moperies',
	'regales',
	'sublates',
	'expecter',
	'implorers',
	'whump',
	'candygram',
	'beblooding',
	'parceled',
	'pledgor',
	'elegiac',
	'agnates',
	'narrowed',
	'dewlapped',
	'sensationally',
	'distal',
	'demijohn',
	'myxamoebae',
	'eosin',
	'buckets',
	'parvis',
	'ticcing',
	'uncaged',
	'cantors',
	'superstructural',
	'drowse',
	'autoimmune',
	'echinoid',
	'interschool',
	'scrumptious',
	'legionnaire',
	'kwanza',
	'gallicas',
	'joying',
	'cobras',
	'slinkinesses',
	'nubilous',
	'sandlings',
	'moldinesses',
	'glutaraldehydes',
	'align',
	'upreach',
	'remotions',
	'scotches',
	'killed',
	'poleyns'
];

const sentences = [
	'The beach was crowded with snow leopards.',
	'Your girlfriend bought your favorite cookie crisp cereal but forgot to get milk.',
	'I love eating toasted cheese and tuna sandwiches.',
	'Wisdom is easily acqui                       be called a beach if there was no sand.',
	'He was the type of guy who liked Christmas lights on his house in the middle of July.',
	'As the years pass by, we all know owners look more and more like their dogs.',
	'The shark-infested South Pine channel was the only way in or out.',
	'She tilted her head back and let whip cream stream into her mouth while taking a bath.',
	'He had unknowingly taken up sleepwalking as a nighttime hobby.',
	'He wasn\'t bitter that she had moved on but from the radish.',
	'I am never at home on Sundays.',
	'Each person who knows you has a different perception of who you are.',
	'She was too short to see over the fence.',
	'Let me help you with your baggage.',
	'He realized there had been several deaths on this road, but his concern rose when he saw the exact number.',
	'She had some amazing news to share but nobody to share it with.',
	'Buried deep in the snow, he hoped his batteries were fresh in his avalanche beacon.',
	'There are no heroes in a punk rock band.',
	'The snow-covered path was no help in finding his way out of the back-country.'
];

const paragraphs = [
	'A long black shadow slid across the pavement near their feet and the five Venusians, very much startled, looked overhead. They were barely in time to see the huge gray form of the carnivore before it vanished behind a sign atop a nearby building which bore the mystifying information "Pepsi-Cola.',
	'The boy walked down the street in a carefree way, playing without notice of what was about him. He didn\'t hear the sound of the car as his ball careened into the road. He took a step toward it, and in doing so sealed his fate.',
	'He was aware there were numerous wonders of this world including the unexplained creations of humankind that showed the wonder of our ingenuity. There are huge heads on Easter Island. There are the Egyptian pyramids. There’s Stonehenge. But he now stood in front of a newly discovered monument that simply didn\'t make any sense and he wondered how he was ever going to be able to explain it.',
	'Greg understood that this situation would make Michael terribly uncomfortable. Michael simply had no idea what was about to come and even though Greg could prevent it from happening, he opted to let it happen. It was quite ironic, really. It was something Greg had said he would never wish upon anyone a million times, yet here he was knowingly letting it happen to one of his best friends. He rationalized that it would ultimately make Michael a better person and that no matter how uncomfortable, everyone should experience racism at least once in their lifetime.',
	'Balloons are pretty and come in different colors, different shapes, different sizes, and they can even adjust sizes as needed. But don\'t make them too big or they might just pop, and then bye-bye balloon. It\'ll be gone and lost for the rest of mankind. They can serve a variety of purposes, from decorating to water balloon wars. You just have to use your head to think a little bit about what to do with them.',
	'She was in a hurry. Not the standard hurry when you\'re in a rush to get someplace, but a frantic hurry. The type of hurry where a few seconds could mean life or death. She raced down the road ignoring speed limits and weaving between cars. She was only a few minutes away when traffic came to a dead standstill on the road ahead.',
	'The box sat on the desk next to the computer. It had arrived earlier in the day and business had interrupted her opening it earlier. She didn\'t who had sent it and briefly wondered who it might have been. As she began to unwrap it, she had no idea that opening it would completely change her life.',
	'She counted. One. She could hear the steps coming closer. Two. Puffs of breath could be seen coming from his mouth. Three. He stopped beside her. Four. She pulled the trigger of the gun.',
	'It was a question of which of the two she preferred. On the one hand, the choice seemed simple. The more expensive one with a brand name would be the choice of most. It was the easy choice. The safe choice. But she wasn\'t sure she actually preferred it.',
	'Green vines attached to the trunk of the tree had wound themselves toward the top of the canopy. Ants used the vine as their private highway, avoiding all the creases and crags of the bark, to freely move at top speed from top to bottom or bottom to top depending on their current chore. At least this was the way it was supposed to be. Something had damaged the vine overnight halfway up the tree leaving a gap in the once pristine ant highway.'
];

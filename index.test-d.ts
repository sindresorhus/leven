import {expectType} from 'tsd';
import leven = require('.');

expectType<number>(leven('kitten', 'sitting'));
expectType<number>(leven('kitten', 'sitting', {}));
expectType<number>(leven('kitten', 'sitting', {maxDistance: 4}));

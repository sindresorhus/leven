import {expectType} from 'tsd';
import leven = require('.');

expectType<number>(leven('kitten', 'sitting'));

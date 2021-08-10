import {expectType} from 'tsd';
import leven from './index.js';

expectType<number>(leven('kitten', 'sitting'));

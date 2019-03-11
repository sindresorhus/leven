import {expectType} from 'tsd-check';
import leven from '.';

expectType<number>(leven('kitten', 'sitting'));

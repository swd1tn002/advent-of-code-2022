import path from 'path';
import { readFileSync } from 'fs';
import { splitLines, splitStringMatrix, splitNumberMatrix, extractNumber, extractNumbers } from '../utils/strings';
import { sum, last, max, min, reverseRows, sortNumbers, splitToChunks, transpose } from '../utils/arrays';


const puzzleInput = readFileSync(path.join(__dirname, '/input.txt'), 'utf-8');

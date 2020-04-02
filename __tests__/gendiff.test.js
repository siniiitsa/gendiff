import fs from 'fs';
import path from 'path';

import genDiff from '../src/gendiff.js';

const getFixturePath = (filename) => (
  path.join(__dirname, '..', '__fixtures__', filename)
);

const readFile = (filename) => (
  fs.readFileSync(getFixturePath(filename), 'utf-8')
);

const result = readFile('result.txt');

test.each`
  before           | after           | expected  | format
  ${'before.json'} | ${'after.json'} | ${result} | ${'JSON'}
  ${'before.yml'}  | ${'after.yml'}  | ${result} | ${'YAML'}
  ${'before.ini'}  | ${'after.ini'}  | ${result} | ${'INI'}
`('compare flat $format files', ({ before, after, expected }) => {
  const pathBefore = getFixturePath(before);
  const pathAfter = getFixturePath(after);

  expect(genDiff(pathBefore, pathAfter)).toBe(expected);
});

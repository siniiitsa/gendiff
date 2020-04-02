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

test('compare flat JSON files', () => {
  const pathBefore = getFixturePath('before.json');
  const pathAfter = getFixturePath('after.json');

  expect(genDiff(pathBefore, pathAfter)).toBe(result);
});

test('compare flat YAML files', () => {
  const pathBefore = getFixturePath('before.yml');
  const pathAfter = getFixturePath('after.yml');

  expect(genDiff(pathBefore, pathAfter)).toBe(result);
});

test('compare flat INI files', () => {
  const pathBefore = getFixturePath('before.ini');
  const pathAfter = getFixturePath('after.ini');

  expect(genDiff(pathBefore, pathAfter)).toBe(result);
});

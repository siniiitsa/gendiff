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
  const jsonBefore = getFixturePath('before.json');
  const jsonAfter = getFixturePath('after.json');

  expect(genDiff(jsonBefore, jsonAfter)).toBe(result);
});

test('compare flat YAML files', () => {
  const yamlBefore = getFixturePath('before.yml');
  const yamlAfter = getFixturePath('after.yml');

  expect(genDiff(yamlBefore, yamlAfter)).toBe(result);
});

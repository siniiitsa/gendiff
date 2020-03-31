import fs from 'fs';
import path from 'path';

import genDiff from '../src/gendiff.js';

const getFixturePath = (filename) => (
  path.join(__dirname, '..', '__fixtures__', filename)
);

const readFile = (filename) => (
  fs.readFileSync(getFixturePath(filename), 'utf-8')
);

test('compare flat JSON files', async () => {
  const jsonBefore = getFixturePath('before.json');
  const jsonAfter = getFixturePath('after.json');
  const result = await readFile('result.txt');

  expect(genDiff(jsonBefore, jsonAfter)).toBe(result);
});

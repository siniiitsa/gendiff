import fs from 'fs';
import path from 'path';

import genDiff from '../src/gendiff.js';

const getFixturePath = (filename) => (
  path.join(__dirname, '..', '__fixtures__', filename)
);

const readFile = (filename) => (
  fs.readFileSync(getFixturePath(filename), 'utf-8')
);

test('compare flat json files', async () => {
  const beforePath = getFixturePath('before.json');
  const afterPath = getFixturePath('after.json');
  const result = await readFile('result.txt');

  expect(genDiff(beforePath, afterPath)).toBe(result);
});

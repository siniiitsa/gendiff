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
  ext        
  ${'.json'}
  ${'.yml'}
  ${'.ini'}
`('compare flat $ext files', ({ ext }) => {
  const pathBefore = getFixturePath(`before${ext}`);
  const pathAfter = getFixturePath(`after${ext}`);

  expect(genDiff(pathBefore, pathAfter)).toBe(result);
});

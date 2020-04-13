import fs from 'fs';
import path from 'path';

import genDiff from '../src/gendiff.js';

const getFixturePath = (filename) => (
  path.join(__dirname, '..', '__fixtures__', filename)
);

const readFile = (filename) => (
  fs.readFileSync(getFixturePath(filename), 'utf-8')
);

const resultObject = readFile('result-object.txt');
const resultPlain = readFile('result-plain.txt');

describe.each`
  ext        
  ${'.json'}
  ${'.yml'}
  ${'.ini'}
`('compare $ext files', ({ ext }) => {
  const pathBefore = getFixturePath(`before${ext}`);
  const pathAfter = getFixturePath(`after${ext}`);

  test('--format "object"', () => {
    expect(genDiff(pathBefore, pathAfter, 'object')).toBe(resultObject);
  });

  test('--format "plain"', () => {
    expect(genDiff(pathBefore, pathAfter, 'plain')).toBe(resultPlain);
  });
});

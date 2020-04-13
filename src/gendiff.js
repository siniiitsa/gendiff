import { has, isEqual, uniq } from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
import isObject from './helpers.js';

const getJsObject = (filePath) => {
  const parse = getParser(path.extname(filePath));
  return parse(fs.readFileSync(filePath, 'utf8'));
};

const makeDiff = (type, key, value, children) => {
  const diff = { type, key, value, children: children || null };
  return diff;
};

const makeDiffsColl = (bef, aft) => {
  const keys = uniq([...Object.keys(bef), ...Object.keys(aft)]).sort();

  const coll = keys.reduce((acc, key) => {
    if (!has(bef, key)) {
      return [...acc, makeDiff('added', key, aft[key])];
    }

    if (!has(aft, key)) {
      return [...acc, makeDiff('deleted', key, bef[key])];
    }

    if (isObject(bef[key]) && isObject(aft[key])) {
      const children = makeDiffsColl(bef[key], aft[key]);
      return [...acc, makeDiff('changed', key, null, children)];
    }

    const newDiff = isEqual(bef[key], aft[key])
      ? makeDiff('unchanged', key, bef[key])
      : [makeDiff('deleted', key, bef[key]), makeDiff('added', key, aft[key])];

    return [...acc, newDiff].flat();
  }, []);

  return coll;
};

const genDiff = (befPath, aftPath, format) => {
  const bef = getJsObject(befPath);
  const aft = getJsObject(aftPath);

  const stringify = getFormatter(format);
  const diffsColl = makeDiffsColl(bef, aft);

  return stringify(diffsColl);
};

export default genDiff;

import { has, isEqual, uniq } from 'lodash';
import fs from 'fs';

const getJsObject = (path) => JSON.parse(fs.readFileSync(path));

const diffTypes = {
  unchanged: 'unchanged',
  removed: 'removed',
  added: 'added',
};

const getSign = (type) => {
  switch (type) {
    case diffTypes.unchanged:
      return ' ';
    case diffTypes.added:
      return '+';
    case diffTypes.removed:
      return '-';
    default:
      return null;
  }
};

const makeDiff = (key, value, type) => ({ key, value, type });

const diffToStr = ({ key, value, type }) => `${getSign(type)} ${key}: ${value}`;

const indentStr = (str, count) => `${' '.repeat(count)}${str}`;

const toString = (diffs) => {
  const diffStrings = diffs
    .map(diffToStr)
    .map((diffStr) => indentStr(diffStr, 2))
    .join('\n');

  const wrapped = `{\n${diffStrings}\n}`;
  return wrapped;
};

const genDiff = (befPath, aftPath) => {
  const bef = getJsObject(befPath);
  const aft = getJsObject(aftPath);

  const keys = uniq([...Object.keys(bef), ...Object.keys(aft)]);

  const diffs = keys.reduce((acc, key) => {
    if (!has(bef, key)) {
      return [...acc, makeDiff(key, aft[key], diffTypes.added)];
    }

    if (!has(aft, key)) {
      return [...acc, makeDiff(key, bef[key], diffTypes.removed)];
    }

    const newDiff = isEqual(bef[key], aft[key])
      ? makeDiff(key, bef[key], diffTypes.unchanged)
      : [makeDiff(key, aft[key], diffTypes.added), makeDiff(key, bef[key], diffTypes.removed)];

    return [...acc, newDiff];
  }, []).flat();

  return toString(diffs);
};

export default genDiff;

import { has, isEqual, uniq } from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';

const getJsObject = (filePath) => {
  const parse = getParser(path.extname(filePath));
  return parse(fs.readFileSync(filePath, 'utf8'));
};

const isObject = (value) => {
  if (Array.isArray(value) || value === null) {
    return false;
  }
  return typeof value === 'object';
};

const getSign = (type) => {
  const signs = {
    unchanged: ' ',
    changed: ' ',
    added: '+',
    removed: '-',
  };

  return signs[type] || null;
};

const wrapWithCurlyBraces = (string, indentCount = 0) => {
  const indent = ' '.repeat(indentCount);
  return `{\n${string}\n${indent}}`;
};

const objectToString = (object, indentCount) => {
  const indent = ' '.repeat(indentCount + 4);

  const pairsString = Object.entries(object)
    .map(([key, val]) => `${indent}${key}: ${val}`)
    .join('\n');

  return wrapWithCurlyBraces(pairsString, indentCount);
};

const stringify = (diffColl) => {
  const iter = (diffs, indentCount) => {
    const indent = ' '.repeat(indentCount);
    const diffToString = ({ key, value, type, children }) => {
      const sign = getSign(type);

      if (children) {
        const formatedValue = wrapWithCurlyBraces(
          iter(children, indentCount + 4),
          indentCount + 2,
        );
        return `${indent}${sign} ${key}: ${formatedValue}`;
      }

      const formatedValue = isObject(value)
        ? objectToString(value, indentCount + 2)
        : value;

      return `${indent}${sign} ${key}: ${formatedValue}`;
    };

    const diffString = diffs
      .map(diffToString)
      .join('\n');

    return diffString;
  };

  return wrapWithCurlyBraces(iter(diffColl, 2));
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
      return [...acc, makeDiff('removed', key, bef[key])];
    }

    if (isObject(bef[key]) && isObject(aft[key])) {
      const children = makeDiffsColl(bef[key], aft[key]);
      return [...acc, makeDiff('changed', key, null, children)];
    }

    const newDiff = isEqual(bef[key], aft[key])
      ? makeDiff('unchanged', key, bef[key])
      : [makeDiff('removed', key, bef[key]), makeDiff('added', key, aft[key])];

    return [...acc, newDiff].flat();
  }, []);

  return coll;
};

const genDiff = (befPath, aftPath) => {
  const bef = getJsObject(befPath);
  const aft = getJsObject(aftPath);

  const diffsColl = makeDiffsColl(bef, aft);
  return stringify(diffsColl);
};

export default genDiff;

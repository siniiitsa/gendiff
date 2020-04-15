import { has, isEqual, uniq } from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
import isObject from './helpers.js';

const getJsObject = (filePath) => {
  const parse = getParser(path.extname(filePath));
  const data = fs.readFileSync(filePath, 'utf8');
  return parse(data);
};

const makeNode = (type, key, value, children) => {
  const node = { type, key, value, children: children || null };
  return node;
};

const makeAst = (bef, aft) => {
  const keys = uniq([...Object.keys(bef), ...Object.keys(aft)]).sort();

  const ast = keys.reduce((acc, key) => {
    if (!has(bef, key)) {
      return [...acc, makeNode('added', key, aft[key])];
    }

    if (!has(aft, key)) {
      return [...acc, makeNode('deleted', key, bef[key])];
    }

    if (isObject(bef[key]) && isObject(aft[key])) {
      const children = makeAst(bef[key], aft[key]);
      return [...acc, makeNode('changed', key, null, children)];
    }

    if (isEqual(bef[key], aft[key])) {
      return [...acc, makeNode('unchanged', key, bef[key])];
    }

    return [
      ...acc,
      makeNode('deleted', key, bef[key]),
      makeNode('added', key, aft[key]),
    ];
  }, []);

  return ast;
};

const genDiff = (befPath, aftPath, format) => {
  const bef = getJsObject(befPath);
  const aft = getJsObject(aftPath);

  const stringify = getFormatter(format);
  const ast = makeAst(bef, aft);

  return stringify(ast);
};

export default genDiff;

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

const makeAst = (bef, aft) => {
  const keys = uniq([...Object.keys(bef), ...Object.keys(aft)]).sort();

  const ast = keys.reduce((acc, key) => {
    if (!has(bef, key)) {
      const addedNode = { status: 'added', key, value: aft[key] };
      return [...acc, addedNode];
    }

    if (!has(aft, key)) {
      const deletedNode = { status: 'deleted', key, value: bef[key] };
      return [...acc, deletedNode];
    }

    if (isObject(bef[key]) && isObject(aft[key])) {
      const children = makeAst(bef[key], aft[key]);
      const changedNode = { status: 'changed', key, children };
      return [...acc, changedNode];
    }

    if (isEqual(bef[key], aft[key])) {
      const unchangedNode = { status: 'unchanged', key, value: bef[key] };
      return [...acc, unchangedNode];
    }

    const deletedNode = { status: 'deleted', key, value: bef[key] };
    const addedNode = { status: 'added', key, value: aft[key] };
    return [...acc, deletedNode, addedNode];
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

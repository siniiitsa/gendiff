import {
  has,
  isEqual,
  union,
  isPlainObject,
} from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';
import { isObject } from './helpers.js';

const getFileData = (filePath) => {
  const fullFilePath = path.resolve(filePath);
  return fs.readFileSync(fullFilePath, 'utf8');
};

const getFileFormat = (fileName) => path.extname(fileName);

const parse = (data, format) => getParser(format)(data);

const makeAst = (config1, config2) => {
  const keys = uniq([...Object.keys(config1), ...Object.keys(config2)]).sort();

  const ast = keys.reduce((acc, key) => {
    if (!has(config1, key)) {
      const addedNode = { status: 'added', key, value: config2[key] };
      return [...acc, addedNode];
    }

    if (!has(config2, key)) {
      const deletedNode = { status: 'deleted', key, value: config1[key] };
      return [...acc, deletedNode];
    }

    if (isObject(config1[key]) && isObject(config2[key])) {
      const children = makeAst(config1[key], config2[key]);
      const changedNode = { status: 'changed', key, children };
      return [...acc, changedNode];
    }

    if (isEqual(config1[key], config2[key])) {
      const unchangedNode = { status: 'unchanged', key, value: config1[key] };
      return [...acc, unchangedNode];
    }

    const deletedNode = { status: 'deleted', key, value: config1[key] };
    const addedNode = { status: 'added', key, value: config2[key] };
    return [...acc, deletedNode, addedNode];
  }, []);

  return ast;
};

const genDiff = (path1, path2, outputFormat) => {
  const data1 = getFileData(path1);
  const data2 = getFileData(path2);

  const config1 = parse(data1, getFileFormat(path1));
  const config2 = parse(data2, getFileFormat(path2));

  const stringify = getFormatter(outputFormat);
  const ast = makeAst(config1, config2);

  return stringify(ast);
};

export default genDiff;

import {
  has,
  union,
  isPlainObject,
} from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers.js';
import getFormatter from './formatters/index.js';

const getFileData = (filePath) => {
  const fullFilePath = path.resolve(filePath);
  return fs.readFileSync(fullFilePath, 'utf8');
};

const getFileFormat = (fileName) => {
  const ext = path.extname(fileName);

  switch (ext) {
    case '.json':
      return 'json';
    case '.ini':
      return 'ini';
    case '.yaml':
      return 'yaml';
    case '.yml':
      return 'yaml';
    default:
      throw new Error(`Unsupported file extension: "${ext}". Supported extensions: ".json", ".ini", ".yaml", ".yml".`);
  }
};

const parse = (data, format) => getParser(format)(data);

const makeAst = (config1, config2) => {
  const keys = union(Object.keys(config1), Object.keys(config2)).sort();

  const ast = keys.map((key) => {
    if (!has(config1, key)) {
      const addedNode = { key, status: 'added', value: config2[key] };
      return addedNode;
    }

    if (!has(config2, key)) {
      const deletedNode = { key, status: 'deleted', value: config1[key] };
      return deletedNode;
    }

    if (config1[key] === config2[key]) {
      const unchangedNode = { key, status: 'unchanged', value: config1[key] };
      return unchangedNode;
    }

    if (isPlainObject(config1[key]) && isPlainObject(config2[key])) {
      const children = makeAst(config1[key], config2[key]);
      const changedNode = { key, status: 'changed_children', children };
      return changedNode;
    }

    const changedNode = {
      key,
      status: 'changed_value',
      oldValue: config1[key],
      newValue: config2[key],
    };

    return changedNode;
  });

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

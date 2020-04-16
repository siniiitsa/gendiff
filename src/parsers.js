import yaml from 'js-yaml';
import ini from 'ini';
import { cloneDeepWith } from 'lodash';

const parseIni = (data) => {
  const normalizeNumbers = (value) => {
    if (typeof value === 'string') {
      return +value || undefined;
    }
    return undefined;
  };

  const obj = ini.parse(data);
  return cloneDeepWith(obj, normalizeNumbers);
};

const getParser = (extname) => {
  switch (extname) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    case '.ini':
      return parseIni;
    default:
      return null;
  }
};

export default getParser;

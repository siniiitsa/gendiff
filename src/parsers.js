import yaml from 'js-yaml';
import ini from 'ini';
import { cloneDeepWith } from 'lodash';

const parseIni = (data) => {
  const normalizeNumbers = (value) => {
    const shouldBeNumber = (typeof value === 'string') && Number(value);
    return shouldBeNumber ? Number(value) : undefined;
  };

  const obj = ini.parse(data);
  return cloneDeepWith(obj, normalizeNumbers);
};

const getParser = (format) => {
  switch (format) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    case '.ini':
      return parseIni;
    default:
      throw new Error(`Unsupported format: "${format}". Supported formats: ".json", ".yml", ".ini".`);
  }
};

export default getParser;

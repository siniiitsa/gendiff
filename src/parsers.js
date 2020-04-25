import yaml from 'js-yaml';
import ini from 'ini';
import { cloneDeepWith } from 'lodash';

const parseIni = (data) => {
  const normalizeNumbers = (value) => {
    const shouldBeNumber = (typeof value === 'string') && Number(value);
    return shouldBeNumber ? Number(value) : undefined;
  };

  const object = ini.parse(data);
  const objectNormalized = cloneDeepWith(object, normalizeNumbers);
  return objectNormalized;
};

const getParser = (format) => {
  switch (format) {
    case 'json':
      return JSON.parse;
    case 'yaml':
      return yaml.safeLoad;
    case 'ini':
      return parseIni;
    default:
      throw new Error(`No parser for "${format}" format. Supported formats: "json", "yaml", "ini".`);
  }
};

export default getParser;

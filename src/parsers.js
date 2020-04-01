import yaml from 'js-yaml';

const getParser = (extname) => {
  switch (extname) {
    case '.json':
      return JSON.parse;
    case '.yml':
      return yaml.safeLoad;
    default:
      return null;
  }
};

export default getParser;

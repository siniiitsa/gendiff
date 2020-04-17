import formatAsTree from './tree.js';
import formatAsPlain from './plain.js';
import formatAsJson from './json.js';

const getFormatter = (format) => {
  switch (format) {
    case 'tree':
      return formatAsTree;
    case 'json':
      return formatAsJson;
    case 'plain':
      return formatAsPlain;
    default:
      throw new Error(`Unknown format option: "${format}". Use one of these instead: "tree", "json", "plain".`);
  }
};

export default getFormatter;

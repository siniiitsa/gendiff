import formatAsTree from './tree.js';
import formatAsPlain from './plain.js';
import formatAsJson from './json.js';

const getFormatter = (format) => {
  const formatters = {
    tree: formatAsTree,
    plain: formatAsPlain,
    json: formatAsJson,
  };

  return formatters[format] || null;
};

export default getFormatter;

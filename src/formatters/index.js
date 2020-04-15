import formatAsTree from './tree.js';
import formatAsPlain from './plain.js';

const getFormatter = (format) => {
  const formatters = {
    tree: formatAsTree,
    plain: formatAsPlain,
  };

  return formatters[format] || null;
};

export default getFormatter;

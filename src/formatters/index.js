import formatAsObject from './object.js';
import formatAsPlain from './plain.js';

const getFormatter = (format) => {
  const formatters = {
    object: formatAsObject,
    plain: formatAsPlain,
  };

  return formatters[format] || null;
};

export default getFormatter;

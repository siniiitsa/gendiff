import formatAsJsObject from './object.js';
import formatAsPlain from './plain.js';

const getFormatter = (format) => {
  const formatters = {
    object: formatAsJsObject,
    plain: formatAsPlain,
  };

  return formatters[format] || null;
};

export default getFormatter;

import { isPlainObject } from 'lodash';

const formatValue = (value) => {
  if (isPlainObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return `${value}`;
};

const formatAsPlain = (ast, initialPath = '') => {
  const iter = (node, ancestry) => {
    const path = ancestry.length > 0 ? `${ancestry}.${node.key}` : node.key;

    switch (node.type) {
      case 'deleted':
        return `Property '${path}' was deleted`;
      case 'added':
        return `Property '${path}' was added with value: ${formatValue(node.value)}`;
      case 'changed':
        return `Property '${path}' was changed from ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`;
      case 'nested':
        return formatAsPlain(node.children, path);
      default:
        throw new Error(`Unknown ast node type: "${node.type}".`);
    }
  };

  return ast
    .filter((node) => node.type !== 'unchanged')
    .flatMap((node) => iter(node, initialPath))
    .join('\n');
};

export default formatAsPlain;

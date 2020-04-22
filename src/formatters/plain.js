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

const itemToString = (item) => {
  switch (item.status) {
    case 'deleted':
      return `Property '${item.path}' was deleted`;
    case 'added':
      return `Property '${item.path}' was added with value: ${formatValue(item.value)}`;
    case 'changed_value':
      return `Property '${item.path}' was changed from ${formatValue(item.oldValue)} to ${formatValue(item.newValue)}`;
    default:
      throw new Error(`Unknown ast node status: "${item.status}".`);
  }
};

const formatAsPlain = (ast) => {
  const iter = (node, pathAcc) => {
    const {
      key,
      value,
      oldValue,
      newValue,
      status,
      children,
    } = node;

    const currentPath = pathAcc.length > 0 ? `${pathAcc}.${key}` : key;

    if (status === 'unchanged') {
      return null;
    }

    if (status === 'changed_children') {
      return children.map((child) => iter(child, currentPath));
    }

    if (status === 'changed_value') {
      return {
        status,
        path: currentPath,
        oldValue,
        newValue,
      };
    }

    return {
      status,
      path: currentPath,
      value,
    };
  };

  const plainDiff = ast
    .map((node) => iter(node, ''))
    .flat(Infinity)
    .filter(Boolean)
    .map(itemToString)
    .join('\n');

  return plainDiff;
};

export default formatAsPlain;

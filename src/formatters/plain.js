import isObject from '../helpers.js';

const formatValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
};

const itemToString = ({ status, path, value, oldValue, newValue }) => {
  switch (status) {
    case 'deleted':
      return `Property '${path}' was deleted`;
    case 'added':
      return `Property '${path}' was added with value: ${formatValue(value)}`;
    case 'changed':
      return `Property '${path}' was changed from ${formatValue(oldValue)} to ${formatValue(newValue)}`;
    default:
      return null;
  }
};

const groupChangedItems = (acc, item, index, items) => {
  if ((index < items.length - 1) && items[index + 1].path === item.path) {
    const newItem = {
      ...item,
      status: 'changed',
      oldValue: item.value,
      newValue: items[index + 1].value,
    };

    return [...acc, newItem];
  }

  if ((index !== 0) && items[index - 1].path === item.path) {
    return acc;
  }

  return [...acc, item];
};

const makeDiffItem = (status, path, value) => ({ status, path, value });

const formatAsPlain = (ast) => {
  const iter = (node, pathAcc) => {
    const { key, value, status, children } = node;
    const currentPath = pathAcc.length > 0 ? `${pathAcc}.${key}` : key;

    if (status === 'unchanged') {
      return null;
    }

    if (status === 'deleted') {
      return makeDiffItem(status, currentPath, value);
    }

    if (status === 'added') {
      return makeDiffItem(status, currentPath, value);
    }

    if (value && !children) {
      return makeDiffItem(status, currentPath, value);
    }

    return children.map((child) => iter(child, currentPath));
  };

  return ast
    .map((diff) => iter(diff, ''))
    .flat(Infinity)
    .filter(Boolean)
    .reduce(groupChangedItems, [])
    .map(itemToString)
    .join('\n');
};

export default formatAsPlain;

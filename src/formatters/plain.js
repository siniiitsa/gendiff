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

const makeLine = ({ type, path, value, oldValue, newValue }) => {
  switch (type) {
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
      type: 'changed',
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

const makeDiffItem = (type, path, value) => ({ type, path, value });

const formatAsPlain = (diffs) => {
  const iter = (node, pathAcc) => {
    const { key, value, type, children } = node;
    const currentPath = pathAcc.length > 0 ? `${pathAcc}.${key}` : key;

    if (type === 'unchanged') {
      return null;
    }

    if (type === 'deleted') {
      return makeDiffItem(type, currentPath, value);
    }

    if (type === 'added') {
      return makeDiffItem(type, currentPath, value);
    }

    if (value && !children) {
      return makeDiffItem(type, currentPath, value);
    }

    return children.map((child) => iter(child, currentPath));
  };

  return diffs
    .map((diff) => iter(diff, ''))
    .flat(Infinity)
    .filter(Boolean)
    .reduce(groupChangedItems, [])
    .map(makeLine)
    .join('\n');
};

export default formatAsPlain;

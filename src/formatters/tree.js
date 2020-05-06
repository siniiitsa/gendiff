import { isPlainObject } from 'lodash';

const makeIndent = (depth, sign) => {
  const indentStep = 4;
  const indent = ' '.repeat(depth * indentStep);
  return sign === undefined ? indent : `${indent.slice(2)}${sign} `;
};

const wrapCurlyBraces = (content, depth) => {
  const closingBraceIndent = makeIndent(depth - 1);
  return `{\n${content}\n${closingBraceIndent}}`;
};

const formatObject = (object, depth) => {
  const indent = makeIndent(depth + 1);
  const objectContent = Object.entries(object)
    .map(([key, value]) => `${indent}${key}: ${value}`)
    .join('\n');

  return wrapCurlyBraces(objectContent, depth + 1);
};

const formatValue = (value, indentCount) => (
  isPlainObject(value) ? formatObject(value, indentCount) : `${value}`
);

const formatAsTree = (ast, depth = 1) => {
  const iter = (node) => {
    switch (node.type) {
      case 'added': {
        const indent = makeIndent(depth, '+');
        const value = formatValue(node.value, depth);
        return `${indent}${node.key}: ${value}`;
      }
      case 'deleted': {
        const indent = makeIndent(depth, '-');
        const value = formatValue(node.value, depth);
        return `${indent}${node.key}: ${value}`;
      }
      case 'unchanged': {
        const indent = makeIndent(depth);
        const value = formatValue(node.value, depth);
        return `${indent}${node.key}: ${value}`;
      }
      case 'changed': {
        const deletedIndent = makeIndent(depth, '-');
        const addedIndent = makeIndent(depth, '+');
        const newValue = formatValue(node.newValue, depth);
        const oldValue = formatValue(node.oldValue, depth);
        return [
          `${deletedIndent}${node.key}: ${oldValue}`,
          `${addedIndent}${node.key}: ${newValue}`,
        ];
      }
      case 'nested': {
        const indent = makeIndent(depth);
        const children = formatAsTree(node.children, depth + 1);
        return `${indent}${node.key}: ${children}`;
      }
      default: {
        throw new Error(`Unknown ast node type: "${node.type}".`);
      }
    }
  };

  const tree = ast
    .flatMap((node) => iter(node))
    .join('\n');

  return wrapCurlyBraces(tree, depth);
};

export default formatAsTree;

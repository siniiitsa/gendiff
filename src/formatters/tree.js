import { isPlainObject } from 'lodash';

const makeIndent = (indentCount, sign) => (
  `${' '.repeat(indentCount - 2)}${sign || ' '} `
);

const wrapCurlyBraces = (content, indentCount) => {
  const closingBraceIndent = makeIndent(indentCount).slice(4);
  return `{\n${content}\n${closingBraceIndent}}`;
};

const formatObject = (object, indentCount) => {
  const indent = makeIndent(indentCount + 4);
  const objectContent = Object.entries(object)
    .map(([key, value]) => `${indent}${key}: ${value}`)
    .join('\n');

  return wrapCurlyBraces(objectContent, indentCount + 4);
};

const formatValue = (value, indentCount) => (
  isPlainObject(value) ? formatObject(value, indentCount) : `${value}`
);

const formatAsTree = (ast, indentCount = 4) => {
  const iter = (node) => {
    switch (node.type) {
      case 'added': {
        const indent = makeIndent(indentCount, '+');
        const value = formatValue(node.value, indentCount);
        return `${indent}${node.key}: ${value}`;
      }
      case 'deleted': {
        const indent = makeIndent(indentCount, '-');
        const value = formatValue(node.value, indentCount);
        return `${indent}${node.key}: ${value}`;
      }
      case 'unchanged': {
        const indent = makeIndent(indentCount);
        const value = formatValue(node.value, indentCount);
        return `${indent}${node.key}: ${value}`;
      }
      case 'changed': {
        const indentAdded = makeIndent(indentCount, '+');
        const indentDeleted = makeIndent(indentCount, '-');
        const newValue = formatValue(node.newValue, indentCount);
        const oldValue = formatValue(node.oldValue, indentCount);
        return [
          `${indentDeleted}${node.key}: ${oldValue}`,
          `${indentAdded}${node.key}: ${newValue}`,
        ];
      }
      case 'nested': {
        const indent = makeIndent(indentCount);
        const children = formatAsTree(node.children, indentCount + 4);
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

  return wrapCurlyBraces(tree, indentCount);
};

export default formatAsTree;

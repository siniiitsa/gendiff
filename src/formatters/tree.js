import { isPlainObject } from 'lodash';

const INDENT_STEP = 4;

const makeIndent = (indentCount, sign) => {
  const emptyPart = ' '.repeat(indentCount - 2);
  const signPart = sign ? `${sign} ` : '  ';
  return `${emptyPart}${signPart}`;
};

const wrapCurlyBraces = (content, indentCount) => {
  const closingBraceIndent = makeIndent(indentCount).slice(INDENT_STEP);
  return `{\n${content}\n${closingBraceIndent}}`;
};

const formatObject = (object, indentCount) => {
  const indent = makeIndent(indentCount + INDENT_STEP);
  const objectContent = Object.entries(object)
    .map(([key, value]) => `${indent}${key}: ${value}`)
    .join('\n');

  return wrapCurlyBraces(objectContent, indentCount + INDENT_STEP);
};

const formatValue = (value, indentCount) => (
  isPlainObject(value) ? formatObject(value, indentCount) : `${value}`
);

const formatAsTree = (ast, indentCount = INDENT_STEP) => {
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
        const children = formatAsTree(node.children, indentCount + INDENT_STEP);
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

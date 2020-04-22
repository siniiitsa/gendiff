import { isPlainObject } from 'lodash';

const makeIndent = (indentCount) => ' '.repeat(indentCount);

const wrapWithBraces = (string, indentCount = 0) => {
  const indent = makeIndent(indentCount);
  return `{\n${string}\n${indent}}`;
};

const objectToString = (object, indentCount) => {
  const indent = makeIndent(indentCount + 4);
  const keyValuePairsFormated = Object.entries(object)
    .map(([key, value]) => `${indent}${key}: ${value}`)
    .join('\n');

  return wrapWithBraces(keyValuePairsFormated, indentCount);
};

const formatValue = (value, indentCount) => {
  const formatedValue = isPlainObject(value)
    ? objectToString(value, indentCount)
    : value;

  return formatedValue;
};

const getSign = (status) => {
  const signs = {
    unchanged: ' ',
    changed_value: ' ',
    changed_children: ' ',
    added: '+',
    deleted: '-',
  };

  return signs[status] || null;
};

const formatAsTree = (ast) => {
  const iter = (diffs, indentCount) => {
    const indent = makeIndent(indentCount);

    const nodeToString = ({
      key,
      value,
      oldValue,
      newValue,
      status,
      children,
    }) => {
      if (status === 'changed_children') {
        const sign = getSign(status);
        const valueFormated = wrapWithBraces(
          iter(children, indentCount + 4),
          indentCount + 2,
        );

        return `${indent}${sign} ${key}: ${valueFormated}`;
      }

      if (status === 'changed_value') {
        const oldValueFormated = formatValue(oldValue, indentCount + 2);
        const newValueFormated = formatValue(newValue, indentCount + 2);

        const delSign = getSign('deleted');
        const addSign = getSign('added');

        return [
          `${indent}${delSign} ${key}: ${oldValueFormated}`,
          `${indent}${addSign} ${key}: ${newValueFormated}`,
        ];
      }

      const valueFormated = formatValue(value, indentCount + 2);
      const sign = getSign(status);

      return `${indent}${sign} ${key}: ${valueFormated}`;
    };

    const diffString = diffs
      .map(nodeToString)
      .flat()
      .join('\n');

    return diffString;
  };

  return wrapWithBraces(iter(ast, 2));
};

export default formatAsTree;

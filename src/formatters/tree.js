import { isPlainObject } from 'lodash';

const wrapCurly = (string, indentCount = 0) => {
  const indent = ' '.repeat(indentCount);
  return `{\n${string}\n${indent}}`;
};

const objectToString = (object, indentCount) => {
  const indent = ' '.repeat(indentCount + 4);

  const pairsString = Object.entries(object)
    .map(([key, val]) => `${indent}${key}: ${val}`)
    .join('\n');

  return wrapCurly(pairsString, indentCount);
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
    const indent = ' '.repeat(indentCount);

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
        const formatedValue = wrapCurly(
          iter(children, indentCount + 4),
          indentCount + 2,
        );

        return `${indent}${sign} ${key}: ${formatedValue}`;
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

      const formatedValue = formatValue(value, indentCount + 2);
      const sign = getSign(status);

      return `${indent}${sign} ${key}: ${formatedValue}`;
    };

    const diffString = diffs
      .map(nodeToString)
      .flat()
      .join('\n');

    console.log(diffString);
    return diffString;
  };

  return wrapCurly(iter(ast, 2));
};

export default formatAsTree;

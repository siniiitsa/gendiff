import _ from 'lodash';
import fs from 'fs';

const getJsObject = (path) => JSON.parse(fs.readFileSync(path));

const makeDiff = (key, val, sign) => (
  sign === undefined ? `    ${key}: ${val}` : `  ${sign} ${key}: ${val}`
);

const genDiff = (befPath, aftPath) => {
  const bef = getJsObject(befPath);
  const aft = getJsObject(aftPath);
  const lineBreak = '\n';

  const removedAndChangedDiffs = Object.entries(bef).reduce((acc, [key, val]) => {
    if (!_.has(aft, key)) {
      return [...acc, makeDiff(key, val, '-')];
    }

    if (_.isEqual(aft[key], val)) {
      return [...acc, makeDiff(key, val)];
    }

    return [
      ...acc,
      makeDiff(key, aft[key], '+'),
      makeDiff(key, val, '-'),
    ];
  }, []);


  const diffs = Object.entries(aft).reduce((acc, [key, val]) => {
    if (!_.has(bef, key)) {
      return [...acc, makeDiff(key, val, '+')];
    }

    return acc;
  }, removedAndChangedDiffs);

  const output = `{${lineBreak}${diffs.join(lineBreak)}${lineBreak}}`;
  return output;
};

export default genDiff;

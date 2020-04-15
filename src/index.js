import path from 'path';
import program from 'commander';
import genDiff from './gendiff.js';

// basics
program
  .version('0.0.1')
  .description('Compares two configuration files and shows the difference.');

// arguments
program
  .arguments('<firstConfig> <secondConfig>');

// options
program
  .option('-f, --format [type]', 'output format', 'tree');

// actions
program
  .action((firstConfig, secondConfig) => {
    const path1 = path.resolve(firstConfig);
    const path2 = path.resolve(secondConfig);
    const diff = genDiff(path1, path2, program.format);
    console.log(diff);
  });

export default program;

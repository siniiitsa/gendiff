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
  .option('-f, --format [type]', 'output format');

// actions
program
  .action((firstConfig, secondConfig) => {
    const diff = genDiff(firstConfig, secondConfig);
    console.log(diff);
  });

export default program;

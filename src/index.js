import program from 'commander';

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

export default program;

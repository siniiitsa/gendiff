import program from 'commander';
import genDiff from './gendiff.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows the difference.');

program
  .arguments('<firstConfig> <secondConfig>');

program
  .option('-f, --format [type]', 'output format', 'tree');

program
  .action((firstConfigPath, secondConfigPath) => {
    const diff = genDiff(firstConfigPath, secondConfigPath, program.format);
    console.log(diff);
  });

export default program;

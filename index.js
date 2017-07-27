#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const generator = require('./src/generator');
const swapper = require('./src/swapper');
const config = require('../../.majora.js');
const { getAppName } = require('./src/auditor');

program
  .version('0.1.0')

program
  .command('init')
  .description('Generate a .majora.lock.json file')
  .action(async () => {
    const appName = await getAppName();
    await generator(appName);
    console.log(
      chalk.green('Majora lock file created! 🌛')
    );
  });

program
  .option('-m, --mask [appName]', 'Swap the current version of the app to [appName]');

program.parse(process.argv);

// No argument for the flag --mask was entered
if (program.mask === true) {
  console.log(
    chalk.bold.red([
    'ERROR! Must provide argument to -m, --mask command.',
    'Example:',
    '\tmajora --mask MyOtherVersion'
  ].join('\n')));
  process.exit(1);
}

const getPromptQuestions = () => {
  try {
    const config = require('../../.majora.js');
    return [{
      type: 'list',
      name: 'build',
      message: 'Choose the white label version to build as:',
      choices: config.packages.map(package => package.appName)
    }];
  } catch (err) {
    console.log(
      chalk.red('ERROR! No .majora.js found in root directory.')
    );
    process.exit(1);
  }
};

// User enters no arguments
if (process.argv.length === 2) {
  inquirer.prompt(getPromptQuestions())
    .then(() => console.log('Starting Majora 🌝  🌖  🌗  '))
    .then(({ build }) => swapper(build))
    .then(() => {
      console.log(chalk.bold.green('Success! Build version applied: ' + build));
      console.log('Majora completed. 🌗  🌘  🌚')
    })
    .catch(err => console.error(err));
}

// User enters an argument for --mask
if (program.mask !== undefined) {
  const [ firstLetter, ...otherLetters ] = program.mask;
  const capitalizedMaskName = firstLetter.toUpperCase() + otherLetters.join('');
  console.log('Starting Majora 🌝  🌖  🌗  ');
  swapper(capitalizedMaskName)
    .then(() => {
      console.log(chalk.bold.green('Success! Build version applied: ' + capitalizedMaskName));
      console.log('Majora completed. 🌗  🌘  🌚')
    })
    .catch(err => console.error(err));
}
const fs = require('fs-extra');
const chalk = require('chalk');
const { getWhiteLabelFiles } = require('./auditor');

// Generates the lock file
const getIdentifier = (file) => {
  return file
    .split('/')
    .slice(-1)
    .join()
    .replace('.whitelabel.js', '');
};

const getDefaultComponent = (file) => {
  return file
    .replace('app/', '')
    .replace('.whitelabel.js', '');
};

const getWhiteLabelComponent = (file) => {
  return file
    .replace('app/', '')
    .replace('.js', '');
};

const makeEntry = (file) => {
  return {
    identifier: getIdentifier(file),
    default: getDefaultComponent(file),
    whitelabel: getWhiteLabelComponent(file)
  };
};

const entries = (files) => {
  return files.map(makeEntry);
};

const writeLockFile = async (whiteLabelFiles, newAppName) => {
  console.log(
    chalk.blue('Generating .majora.lock.json...')
  );

  return fs.writeJson('./.majora.lock.json', {
    currentBuild: newAppName,
    components: entries(whiteLabelFiles)
  }, { spaces: 2 });
};

module.exports = (newAppName) => writeLockFile(getWhiteLabelFiles(), newAppName);
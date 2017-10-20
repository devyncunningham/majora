/**
 * This module is responsible for generating the majora.lock.json file
 * that lives in the root directory of your project.
 */
const fs = require('fs-extra');
const chalk = require('chalk');
const { getWhiteLabelFiles } = require('./auditor');

/**
 * @description Converts
 *
 * Array<{
 *   ...package,           // package key/value pairs from majora.js
 *   identifier: string,   // identifier name of component used in imports
 *   default: string,      // default component location of non-whitelabel version
 *   whitelabel: {
 *     [ string ]: string  // key is the white label app name, value is its white label component name
 *   }
 * }>
 *
 * into
 *
 * Array<{
 *   identifier: string,  // identifier name of component used in import statements
 *   default: string,     // default component location of non-whitelabel version
 *   whitelabel: {        // the white label object may have multiple key/value pairs
 *     [ string ]: string // keys are the white label app name, value is the white label component name
 *   }
 * }>
 *
 * The goal is to organize the list of white label components by component instead of by white-label.
 *
 * @param {Array<{
 *   ...package,
 *   idenfitier: string,
 *   default: string,
 *   whitelabel: { [ string ]: string }
 * }>} whiteLabels - return value of getWhiteLabelFiles
 *
 * @returns see desc above
 */
const getComponentEntries = (whiteLabels) => {
  const util = require('util');
  return whiteLabels.reduce((all, whiteLabel) => {
    if (!all.length) {
      return [ ...all, ...whiteLabel.files ];
    }

    return whiteLabel.files.reduce((updatedAll, component, index) => {
      const componentInExistingList = updatedAll.find(
        file => file.identifier === component.identifier
      );
      if (componentInExistingList) {
        const indexOfComponent = updatedAll.indexOf(componentInExistingList);

        const updatedList = [
          ...updatedAll.slice(0, indexOfComponent),
          {
            ...componentInExistingList,
            whitelabel: {
              ...componentInExistingList.whitelabel,
              ...component.whitelabel
            }
          },
          ...updatedAll.slice(indexOfComponent + 1)
        ];

        return updatedList;
      }
      return [ ...updatedAll, component ];
    }, all);
  }, []);
 };

const writeLockFile = (newPackage, config) => {
  const whiteLabelFiles = getWhiteLabelFiles(config);
  const { appName, extension } = newPackage;

  console.log(
    chalk.blue('Generating majora.lock.json...')
  );

  const newConfig = config.packages.find((pkg) => pkg.appName === appName);
  const currentBuildObj = {
    appName,
    packageName: newConfig.packageName,
    bundleId: newConfig.bundleId
  };

  return fs.writeJson('./majora.lock.json', {
    currentBuild: currentBuildObj,
    components: getComponentEntries(whiteLabelFiles)
  }, { spaces: 2 });
};


module.exports = {
  getComponentEntries,
  writeLockFile
};
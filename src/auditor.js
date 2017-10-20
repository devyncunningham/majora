/**
 * This module is responsible for reading from the file system.
 *
 */
const glob = require('glob');
const xml2js = require('xml2js');
const fs = require('fs-extra');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const parseString = promisify(xml2js.parseString);

const getIdentifier = (extension = '', file) => {
  return file
    .split('/')
    .slice(-1)
    .join()
    .replace(`${extension}.js`, '')
};

const getDefaultComponentPath = (extension = '', file) => {
  return file
    .replace('app/', '')
    .replace(`${extension}.js`, '');
};

const getWhiteLabelComponentPath = (file) => {
  return file
    .replace('app/', '')
    .replace('.js', '');
};

/**
 * Finds all of the white label files for each build
 * @param   {MajoraConfig} config - majora.js config object
 * @returns {
 *   Array<{
 *     ...package,           // package key/value pairs from majora.js
 *     identifier: string,   // identifier name of component used in imports
 *     default: string,      // default component location of non-whitelabel version
 *     whitelabel: {
 *       [ string ]: string  // key is the white label app name, value is its white label component name
 *     }
 *   }>
 * }
 */
const getWhiteLabelFiles = (config) => {
  return config.packages.reduce((all, pkg) => {
    if (pkg.extension) {
      return [ ...all, {
        ...pkg,
        files: glob.sync(`*${pkg.extension}.js`, { matchBase: true })
          .map(path => ({
            identifier: getIdentifier(pkg.extension, path),
            default: getDefaultComponentPath(pkg.extension, path),
            whitelabel: {
              [pkg.appName]: getWhiteLabelComponentPath(path)
            }
          })
        )
      } ];
    }
    return all;
  }, []);
};

const getAppName = async () => {
  try {
    const xmlText = await readFileAsync('./android/app/src/main/res/values/strings.xml');
    const data = await parseString(xmlText);
    const appNameEntry = data.resources.string.find((entry) => entry['$'].name === 'app_name');
    return appNameEntry['_'];
  } catch (err) {
    console.log('ERROR: Failed to read strings.xml inside the Android values directory!', err);
    process.exit(1);
  }
}

module.exports = {
  getAppName,
  getIdentifier,
  getDefaultComponentPath,
  getWhiteLabelComponentPath,
  getWhiteLabelFiles
};
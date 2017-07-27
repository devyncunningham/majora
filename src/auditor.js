const glob = require('glob');
const xml2js = require('xml2js');
const fs = require('fs-extra');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const parseString = promisify(xml2js.parseString);

const getWhiteLabelFiles = () => glob.sync('*.whitelabel.js', { matchBase: true });

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
  getWhiteLabelFiles
};
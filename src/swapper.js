const chalk = require('chalk');
const replace = require('replace');
const fs = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const generator = require('./generator');
const config = require('../../../.majora.js');

const generateMinMapMapping = (assetsPath) => {
  const BASE_PATH_TO_MIPMAPS = './android/app/src/main/res/';
  const newMipMapMapping = [
    {
      type: 'mipmap-hdpi',
      to: BASE_PATH_TO_MIPMAPS + 'mipmap-hdpi/',
      from: assetsPath + '/mipmap-hdpi/'
    }, {
      type: 'mipmap-mdpi',
      to: BASE_PATH_TO_MIPMAPS + 'mipmap-mdpi/',
      from: assetsPath + '/mipmap-mdpi/',
    }, {
      type: 'mipmap-xhdpi',
      to: BASE_PATH_TO_MIPMAPS + 'mipmap-xhdpi/',
      from: assetsPath + '/mipmap-xhdpi/'
    }, {
      type: 'mipmap-xxhdpi',
      to: BASE_PATH_TO_MIPMAPS + 'mipmap-xxhdpi/',
      from: assetsPath + '/mipmap-xxhdpi/'
    }, {
      type: 'mipmap-xxxhdpi',
      to: BASE_PATH_TO_MIPMAPS + 'mipmap-xxxhdpi/',
      from: assetsPath + '/mipmap-xxxhdpi/'
    }
  ];
  return newMipMapMapping;
}

const changeProjectSubfolderName = async (baseFolder, newFolderName) => {
  console.log(
    chalk.bold.blue(
      '📂  Changing Project Subfolder Name'
    )
  );
  await fs.move(baseFolder, newFolderName, { overwrite: true });
};

const removeOldProjectSubfolder = async (oldFolder) => {
  await fs.remove(oldFolder);
};

const changePackageId = async (oldId, newId) => {
  const PATH_TO_BUILD_GRADLE = './android/app/build.gradle';
  const PATH_TO_ANDROID_MANIFEST = './android/app/src/main/AndroidManifest.xml';
  const PATH_TO_BUCK = './android/app/BUCK';
  const PATH_TO_MAIN_ACTIVITY = `./android/app/src/main/java/${oldId.replace(/\./g, '/')}/MainActivity.java`;
  const PATH_TO_MAIN_APPLICATION = `./android/app/src/main/java/${oldId.replace(/\./g, '/')}/MainApplication.java`;

  console.log(
    chalk.bold.blue(
      '🎫  Changing Package ID'
    )
  );
  replace({
    regex: new RegExp(oldId),
    replacement: newId,
    paths: [
      PATH_TO_BUILD_GRADLE,
      PATH_TO_ANDROID_MANIFEST,
      PATH_TO_BUCK,
      PATH_TO_MAIN_ACTIVITY,
      PATH_TO_MAIN_APPLICATION
    ],
    silent: true
  });
}

const changeAppName = async (oldName, newName) => {
  const PATH_TO_STRINGS = './android/app/src/main/res/values/strings.xml';
  console.log(
    chalk.bold.blue(
      '🔖  Changing App Name'
    )
  );
  replace({
    regex: new RegExp(oldName),
    replacement: newName,
    paths: [ PATH_TO_STRINGS ],
    silent: true
  });
}

const changeAppIcon = async (assetPath) => {
  const newMipMapMapping = generateMinMapMapping(assetPath);
  console.log(
    chalk.bold.blue(
      '🎭  Changing App Icons'
    )
  );
  await Promise.all(
    newMipMapMapping.map(mapping => {
      return fs.copy(mapping.from, mapping.to, { overwrite: true });
    })
  );
};

const changeAppStyle = async (assetPath) => {
  const pathToValuesStyles = './android/app/src/main/res/values/styles.xml';
  await fs.copy(assetPath + '/values/styles.xml', pathToValuesStyles, { overwrite: true });
};

const cleanGradle = async () => {
  console.log(
    chalk.bold.blue(
      '✨  Cleaning Gradle Wrapper'
    )
  );
  const { stdout, stderr } = await exec('cd android && ./gradlew clean && cd ..');
  if (stderr) {
    throw new Error(stderr);
  }
  if (stdout) {
    console.log(stdout);
    return;
  }
};

const preScript = async (pre) => {
  await exec(pre);
}

const postScript = async (post) => {
  await exec(post);
}

const init = async (newAppName, { moveAssets }) => {
  const lockFile = require('../../../.majora.lock.json');
  const { currentBuild } = lockFile;

  if (newAppName.toLowerCase() === currentBuild.toLowerCase()) {
    console.log(
      chalk.green(
        '⚠️  Build already configured as ' + newAppName,
      )
    );
    process.exit(0);
  }

  const oldPackage = config.packages.find((package) => package.appName === currentBuild);
  if (!oldPackage) {
    throw new Error([
      'Failed to find current package settings in your .majora.js file.',
      'Check the .majora.js config and be sure that your current settings are present.'
    ].join(' '));
    process.exit(1);
  }

  const newPackage = config.packages.find((package) => package.appName.toLowerCase() === newAppName.toLowerCase());
  if (!newPackage) {
    throw new Error([
      'Failed to find package settings for the target build in your .majora.js file.',
      'Check the .majora.js config and be sure that your current settings are present.'
    ].join(' '));
    process.exit(1);
  }

  await preScript(newPackage.prescript);

  if (!moveAssets) { // only update majora.lock.json if moveAssets is true
    await changePackageId(oldPackage.packageName, newPackage.packageName);
    await changeAppName(oldPackage.appName, newPackage.appName);
    await changeAppIcon(newPackage.resources);
    await changeAppStyle(newPackage.resources);
    const baseFolder = './android/app/src/main/java/' + oldPackage.packageName.replace(/\./g, '/') + '/';
    const destination = './android/app/src/main/java/' + newPackage.packageName.replace(/\./g, '/') + '/';
    await changeProjectSubfolderName(baseFolder, destination);
    const oldProjectSubfolderName = './android/app/src/main/java/' + oldPackage.packageName.replace(/\./g, '/') + '/';
    await removeOldProjectSubfolder(oldProjectSubfolderName);
    await cleanGradle();
  }
  await generator(newPackage.appName);
  await postScript(newPackage.postscript);
};


module.exports = init;

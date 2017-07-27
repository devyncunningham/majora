# 🌝  MajoraJS

Majora is a tool to manage white label builds for React Native. Majora manages assets for each white label version of your app and interchanges the app name, package name, and other assets.

## Installation

Download MajoraJS by running `# todo`.

Create a `.majora.js` file in the root of your React Native project directory.

```js
module.exports = {
  packages: [
    {
      appName: 'My Doggy Daycare',
      packageName: 'name.of.package',
      resources: './assets/myDoggyDaycare',
      prescript: '# script to run before moving assets',
      postscript: '# script to run after moving assets'
    },
    {
      appName: 'Nashville Doggy Daycare',
      packageName: 'name.of.package',
      resources: './assets/nashvilleDoggyDaycare',
      prescript: '# script to run before moving assets',
      postscript: '# script to run after moving assets'
    },
    // List other white-label versions of your app
  ],
  defaultPackage: 'My Doggy Daycare'
};
```

The `resources` property should be a relative file path to a folder with the following assets:

```
assets/
  myDoggyDaycare/
    mipmap-hdpi/
    mipmap-mdpi/
    mipmap-xhdpi/
    mipmap-xxhdpi/
    mipmap-xxxhdpi/
    values/
      styles.xml
  nashvilleDoggyDaycare/
    mipmap-hdpi/
    mipmap-mdpi/
    mipmap-xhdpi/
    mipmap-xxhdpi/
    mipmap-xxxhdpi/
    values/
      styles.xml
```

Each `mipmap-*` folder should contain its appropriate `ic_launcher.png` file. Each subdirectory in `assets/` should also contain a `styles.xml`. These assets will be copied when MajoraJS runs.

## Usage

After creating a `.majora.js` file in the root of your project directory, add the following npm scripts:

```json
"scripts": {
  "majora:init": "./node_modules/majorajs init",
  "majora": "./node_modules/majorajs"
}
```

Run `npm run majora:init` to generate a `.majora.lock.json` file. Do not manually edit this file. This will save your current white-label version's configuration.

You can run `npm run majora` to be prompted to select which white-label version you want to build as. Otherwise, you can run `./node_modules/majorajs --mask nameOfApp` to build as a specific version without being prompted. The argument provided to `--mask` should match an `appName` for a package in `.majora.js`.

You can add the specific build commands to your npm scripts:

```json
"scripts": {
  "majora:myDoggyDaycare": "./node_modules/majorajs --m 'My Doggy Daycare'",
  "majora:nashvilleDoggyDaycare": "./node_modules/majorajs --m 'Nashville Doggy Daycare'"
}
```

## Contributing

TODO
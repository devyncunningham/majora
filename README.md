# 🌝  MajoraJS

Majora is a tool to manage white label builds for React Native. Majora manages assets for each white label version of your app and interchanges the app name, package name, and other assets.

## Why MajoraJS?

MajoraJS allows you to develop multiple white-label versions based on one main version of your React Native app. MajoraJS makes swapping app names, package ids, and moving assets like app icons easy. MajoraJS also lets you create custom components for each white-label version and import them only for that specific white-label version's build.

MajoraJS's required Babel plugin [`babel-plugin-majorajs`](https://github.com/SperaHealth/babel-plugin-majorajs) allows you to determine at compile-time which components to import for your white-labeled app.

Example:

```jsx
import React from 'react';
import LogIn from '../components/LogIn';

export default class LogInContainer extends React.Component {
  render() {
    return <LogIn/>;
  }
}
```

Let's assume you have a `LogIn.js` file that acts as your login component for your app. You also have a white-label component file called `LogIn.whitelabel.js`. With `babel-plugin-majorajs`, your `import` statements are evaluated at compile time. If you use MajoraJS to build your app as a white-label version, Babel will change the `import` declaration to: `import LogIn from '../components/LogIn.whitelabel;` at compile time. This lets you set dynamic `import` statements that get evaluated at build time.

Without MajoraJS, you have code that probably looks like:

```jsx
import React from 'react';
import LogIn from '../components/LogIn';
import LogInWhiteLabel from '../components/LogIn.whitelabel';

export default class LogInContainer extends React.Component {
  render() {
    if (process.env.VERSION === 'WHITE_LABEL') {
      return <LogInWhiteLabel/>;
    }
    else {
      return <LogIn/>;
    }
  }
}
```

This is not optimal as you will need to either import all versions of the same component or write logic to determine which component to lazy-load at run-time. Both alternatives increase the size of your JavaScript bundle. With MajoraJS, you write one `import` statement every time.

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

Follow the installation instructions for [babel-plugin-majorajs](https://github.com/SperaHealth/babel-plugin-majorajs).

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

You can add the specific build commands to your npm scripts. You will also need to delete temporary cache files created by the React Native packager for `babel-plugin-majorajs` to work properly.

```json
"scripts": {
  "clean": "rm -fr $TMPDIR/react-*",
  "majora:myDoggyDaycare": "./node_modules/majorajs --mask 'My Doggy Daycare' | npm run clean",
  "majora:nashvilleDoggyDaycare": "./node_modules/majorajs --mask 'Nashville Doggy Daycare' | npm run clean"
}
```

## Contributing

TODO
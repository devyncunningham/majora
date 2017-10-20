const auditor = require('../src/auditor');

describe('The identifier for a component should always be the file name without the extension', () => {
  it('getIdentifier should remove the white label extension, JS extension, and folder name', () => {
    const file = 'app/components/Resources.nashville.js';
    const extension = '.nashville';

    const expected = 'Resources';

    const identifier = auditor.getIdentifier(extension, file);
    expect(identifier).toBe(expected);
  });

  it('should select identifiers from incorrect whitelabels', () => {
    const file = 'app/components/Resources.nashville.js';
    const extension = '.texas';

    const notExpected = 'Resources';
    const identifier = auditor.getIdentifier(extension, file);
    expect(identifier).not.toBe(notExpected);
  });

  it('should only select the text before the white label extension', () => {
    const file = 'app/components/Resources.nashville.js';
    const extension = '.nashville';

    const notExpected = 'Information';
    const identifier = auditor.getIdentifier(extension, file);
    expect(identifier).not.toBe(notExpected);
  });
});

describe('When a component does not have a white label variant, the default component should always be identifiable', () => {
  it('getDefaultComponentPath should get the location of the default component', () => {
    const file = 'app/components/Resources.nashville.js';
    const extension = '.nashville';

    const expected = 'components/Resources';

    const defaultComponentPath = auditor.getDefaultComponentPath(extension, file);
    expect(defaultComponentPath).toBe(expected);
  });
});

describe('White label files include a custom extension followed by .js', () => {
  it('should get the path to the white label component', () => {
    const file = 'app/components/Resources.nashville.js';

    const expected = 'components/Resources.nashville'

    const whiteLabelComponentPath = auditor.getWhiteLabelComponentPath(file);

    expect(whiteLabelComponentPath).toBe(expected);
  });

  it('should strip "app/" from the component path since all imports will be from within the app directory', () => {
    const file = 'app/components/Resources.nashville.js';
    const expected = 'components/Resources.nashville'

    const whiteLabelComponentPath = auditor.getWhiteLabelComponentPath(file);

    expect(whiteLabelComponentPath).not.toMatch(/app/);
  });
});

describe('White label files should be found for each white label', () => {
  it(`should create a list of all white label components for a specific white label.
      It should extend the package object from the majora.config.js file with the
      white label files that the auditor finds.
`, () => {
    jest.mock('glob');
    const config = require('mockMajoraConfig');
    const whiteLabelFiles = auditor.getWhiteLabelFiles(config);

    const expectedFilesForNashville = [{
      identifier: 'LogIn',
      default: 'components/LogIn',
      whitelabel: {
        Nashville: 'components/LogIn.nashville'
      }
    }, {
      identifier: 'Resources',
      default: 'components/Resources',
      whitelabel: {
        Nashville: 'components/Resources.nashville'
      }
    }];

    const expectedFilesForMississippi = [{
      identifier: 'LogIn',
      default: 'components/LogIn',
      whitelabel: {
        Mississippi: 'components/LogIn.mississippi'
      }
    }, {
      identifier: 'Resources',
      default: 'components/Resources',
      whitelabel: {
        Mississippi: 'components/Resources.mississippi'
      }
    }, {
      identifier: 'Home',
      default: 'components/Home',
      whitelabel: {
        Mississippi: 'components/Home.mississippi'
      }
    }];

    const expectedFilesForTexas = [{
      identifier: 'LogIn',
      default: 'components/LogIn',
      whitelabel: {
        Texas: 'components/LogIn.texas'
      }
    }];

    const expected = [{
      ...config.packages.find(({ appName }) => appName === 'Nashville'),
      files: expectedFilesForNashville
    }, {
      ...config.packages.find(({ appName }) => appName === 'Mississippi'),
      files: expectedFilesForMississippi
    }, {
      ...config.packages.find(({ appName }) => appName === 'Texas'),
      files: expectedFilesForTexas
    }];

    expect(whiteLabelFiles).toEqual(expected);
  });
});
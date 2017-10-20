const auditor = require('../src/auditor');
const generator = require('../src/generator');

describe('A list of components should exist such that each component lists each of its white label variants', () => {
  it('should create a list of components with each white label and their respective white-label components', () => {
    const config = require('mockMajoraConfig');
    const whiteLabelFiles = auditor.getWhiteLabelFiles(config);
    const componentEntries = generator.getComponentEntries(whiteLabelFiles);

    const expected = [{
      identifier: 'LogIn',
      default: 'components/LogIn',
      whitelabel: {
        Nashville: 'components/LogIn.nashville',
        Mississippi: 'components/LogIn.mississippi',
        Texas: 'components/LogIn.texas'
      }
    }, {
      identifier: 'Resources',
      default: 'components/Resources',
      whitelabel: {
        Nashville: 'components/Resources.nashville',
        Mississippi: 'components/Resources.mississippi'
      }
    }, {
      identifier: 'Home',
      default: 'components/Home',
      whitelabel: {
        Mississippi: 'components/Home.mississippi'
      }
    }];

    expect(componentEntries).toEqual(expected);
  });
});
module.exports = {
  packages: [
    {
      appName: 'Ralli',
      packageName: 'sperahealth.ralli.android',
      bundleId: 'sperahealth.ralli.ios',
      resources: './assets/ralli',
      prescript: 'echo "Swapping to Ralli!"',
      postscript: 'echo "Ralli is now active."'
    },
    {
      appName: 'Nashville',
      packageName: 'sperahealth.nashville.android',
      extension: '.nashville',
      bundleId: 'spera.nashville.ios',
      resources: './assets/nashville',
      prescript: 'echo "Swapping to Nashville!"',
      postscript: 'echo "Nashville is now active."'
    },
    {
      appName: 'Mississippi',
      packageName: 'sperahealth.mississippi.android',
      extension: '.mississippi',
      bundleId: 'spera.mississippi.ios',
      resources: './assets/mississippi',
      prescript: 'echo "Swapping to Mississippi!"',
      postscript: 'echo "Mississippi is now active."'
    },
    {
      appName: 'Texas',
      packageName: 'sperahealth.texas.android',
      extension: '.texas',
      bundleId: 'spera.texas.ios',
      resources: './assets/texas',
      prescript: 'echo "Swapping to Texas!"',
      postscript: 'echo "Texas is now active."'
    }
  ],
  defaultPackage: 'Ralli'
}
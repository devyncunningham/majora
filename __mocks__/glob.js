const nashvilleFiles = [
  'app/components/LogIn.nashville.js',
  'app/components/Resources.nashville.js'
];

const mississippiFiles = [
  'app/components/LogIn.mississippi.js',
  'app/components/Resources.mississippi.js',
  'app/components/Home.mississippi.js'
];

const texasFiles = [
  'app/components/LogIn.texas.js'
];

const sync = (pattern, options) => {
  if (pattern.includes('nashville')) {
    return nashvilleFiles;
  }
  if (pattern.includes('mississippi')) {
    return mississippiFiles;
  }
  if (pattern.includes('texas')) {
    return texasFiles;
  }
  return [];
};

module.exports = {
  sync
};

const deepReadDir = require('./deepReadDir.js');
const readFilesQueued = require('./readFilesQueued.js');

const ignoredFilenames = [
  '.git',
  '.gitignore',
  '.gitattributes',
  'package.json',
  'package-lock.json',
  '*/node_modules',
];

async function findEnvVariables() {
  const files = await readDirFiles(process.cwd());

  const keysFound = {};

  function setKeyValueOfKeysFound(key, value = '') {
    keysFound[key.trim()] = value.trim();
  }

  function addDestructuredEnvKeyToKeysFound(key) {
    const defaultValueDelimiter = '=';
    if (key.includes(defaultValueDelimiter)) {
      const [actualKey, value] = key.split(defaultValueDelimiter);
      setKeyValueOfKeysFound(actualKey, value);
      return;
    }
    setKeyValueOfKeysFound(key);
  }

  function addClassicEnvKeyToKeysFound(key) {
    setKeyValueOfKeysFound(key);
  }

  for (const key in files) {
    if (Object.hasOwnProperty.call(files, key)) {
      const element = files[key];
      console.log(`Matching ${key} with RegExps...`);

      const destructured = element.matchAll(/\{(?<keyName>[^}]*)\}\s*=\s*process\.env(.*)+$/gm);
      for (const {
        groups: { keyName },
      } of destructured) {
        console.log('Found in destructuring:', keyName);
        const separateValueDelimiter = ',';
        if (keyName.includes(separateValueDelimiter)) {
          const cleanKeyNames = keyName.split(separateValueDelimiter);
          cleanKeyNames.forEach(addDestructuredEnvKeyToKeysFound);
        } else {
          addDestructuredEnvKeyToKeysFound(keyName);
        }
      }

      const classic = element.matchAll(/process\.env\.(?<keyName>[\w\d]+)(.*)+$/gm);
      for (const {
        groups: { keyName },
      } of classic) {
        console.log('Found in classic vars:', keyName);
        addClassicEnvKeyToKeysFound(keyName);
      }
    }
  }

  console.log('KEYS FOUND:', keysFound);

  return keysFound;
}

async function readDirFiles(directory) {
  const fileNames = await deepReadDir(directory);

  return readFilesQueued(fileNames.flat(Number.POSITIVE_INFINITY).filter((fileName) => !shouldExclude(fileName)));
}

function shouldExclude(fileName) {
  if (ignoredFilenames.find((ignoredFilename) => ignoredFilename === fileName)) return true; // if fileName exactly matches any ignored one — skip it
  if (ignoredFilenames.some((ignoredFilename) => ignoredFilename.startsWith('*/') && fileName.includes(ignoredFilename.slice(2)))) return true; // if there's a directory wildcard in ignoredFilenames and fileName matches it — skip it // TODO make wildcards handled via regex
  return false;
}

module.exports = {
  findEnvVariables,
};

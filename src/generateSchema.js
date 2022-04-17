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
      setKeyValueOfKeysFound(handleDestructuredRenaming(actualKey), value);
      return;
    }
    setKeyValueOfKeysFound(handleDestructuredRenaming(key));
  }

  function handleDestructuredRenaming(possiblyRenamedKey) {
    const renamingDelimiter = ':';
    if (possiblyRenamedKey.includes(renamingDelimiter)) {
      const [keyWithoutRename] = possiblyRenamedKey.split(renamingDelimiter);
      return keyWithoutRename;
    }
    return possiblyRenamedKey;
  }

  function addClassicEnvKeyToKeysFound(key) {
    setKeyValueOfKeysFound(key);
  }

  for (const key in files) {
    if (Object.hasOwnProperty.call(files, key)) {
      const element = files[key];
      // console.log(`Matching ${key} with RegExps...`);

      const destructured = element.matchAll(/\{(?<keyName>[^{}]*)\}\s*=\s*process\.env(.*)+$/gm);
      // TODO? if this gives something like `\\n  NODE_ENV\\n` — that's means that the newlines are actually there in text, since we are using multiline RegExp. A good example — if you scan the Babel source map files. They often have `.json` extension. To solve this, we either need to exclude `.json` files from the scan, or use `.replace(/\\n/g, '')` to remove the newlines.
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

  const readerFunc = readFilesQueued; // TODO make this a class in the future, so that function that reads files can be really passed to constructor.

  return readerFunc(fileNames.flat(Number.POSITIVE_INFINITY).filter((fileName) => !shouldExclude(fileName)));
}

function shouldExclude(fileName) {
  if (ignoredFilenames.find((ignoredFilename) => ignoredFilename === fileName)) return true; // if fileName exactly matches any ignored one — skip it
  if (ignoredFilenames.some((ignoredFilename) => ignoredFilename.startsWith('*/') && fileName.includes(ignoredFilename.slice(2)))) return true; // if there's a directory wildcard in ignoredFilenames and fileName matches it — skip it // TODO make wildcards handled via regex
  return false;
}

module.exports = {
  findEnvVariables,
};

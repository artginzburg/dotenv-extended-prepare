const fs = require('fs');

const ignoredFilenames = [
  '.git',
  '.gitignore',
  '.gitattributes',
  'package.json',
  'package-lock.json',
  'node_modules',
];

function findEnvVariables() {
  const dirname = process.cwd();
  const fileNames = fs.readdirSync(dirname);

  const files = {};
  for (const fileName of fileNames) {
    if (ignoredFilenames.find((ignoredFilename) => ignoredFilename === fileName)) continue; // if fileName exactly matches any ignored one — skip it

    try {
      const file = fs.readFileSync(`${dirname}/${fileName}`, 'utf8');
      files[fileName] = file;
    } catch (error) {
      if (error.code === 'EISDIR') {
        console.log(
          `${fileName} is a directory — Adding the directory contents to the parsing loop...`,
        );
        const nextFileNames = fs.readdirSync(`${dirname}/${fileName}`);
        fileNames.push(...nextFileNames.map((name) => `${fileName}/${name}`));
      } else {
        console.log(`Failed to read ${fileName}!`, error);
      }
    }
  }

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

module.exports = {
  findEnvVariables,
};

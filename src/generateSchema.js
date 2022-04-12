const fs = require('fs');

const ignoredFilenames = [
  '.git',
  '.gitignore',
  '.gitattributes',
  'package.json',
  'package-lock.json',
  '*/node_modules',
];

function findEnvVariables() {
  const files = readdirNestedCustom();

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

function readdirNestedCustom() {
  // Last test duration: 1:32.061 (m:ss.mmm)
  // Note: the test was using fs/promises instead of fs.
  // Test without promises gave 1:08.739 (much less, for some reason).
  const dirname = process.cwd();
  const fileNames = fs.readdirSync(dirname);

  const files = {};
  for (const fileName of fileNames) {
    if (ignoredFilenames.find((ignoredFilename) => ignoredFilename === fileName)) continue; // if fileName exactly matches any ignored one — skip it
    if (ignoredFilenames.some((ignoredFilename) => ignoredFilename.startsWith('*/') && fileName.includes(ignoredFilename.slice(2)))) continue; // if there's a directory wildcard in ignoredFilenames and fileName matches it — skip it // TODO make wildcards handled via regex

    try {
      const file = fs.readFileSync(`${dirname}/${fileName}`, 'utf8');
      files[fileName] = file;
    } catch (error) {
      if (error.code === 'EISDIR') {
        // console.log(
        //   `${fileName} is a directory — Adding the directory contents to the parsing loop...`,
        // );
        const nextFileNames = fs.readdirSync(`${dirname}/${fileName}`);
        fileNames.push(...nextFileNames.map((name) => `${fileName}/${name}`));
      } else {
        // console.log(`Failed to read ${fileName}!`, error);
      }
    }
  }

  return files;
}

// async function readdirNestedDependent() {
//   // Last test duration: 1:35.458 (m:ss.mmm)
//   const rra = require('recursive-readdir-async');

//   const dirname = process.cwd();
//   const filesWithContent = await rra.list(dirname, {
//     readContent: true,
//     exclude: ignoredFilenames,
//   });

//   const files = {};

//   for (const file of filesWithContent) {
//     files[file.path] = base64Decode(file.data);
//   }

//   return files;
// }

// /**
//  * An {@link atob} implementation that is not deprecated.
//  */
// function base64Decode(data) {
//   return Buffer.from(data, 'base64').toString();
// }

module.exports = {
  findEnvVariables,
};

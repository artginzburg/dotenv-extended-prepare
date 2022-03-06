const fs = require('fs');

const { envStringifyInit } = require('./envStringifyInit');

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

  const keysFound = new Set();

  for (const key in files) {
    if (Object.hasOwnProperty.call(files, key)) {
      const element = files[key];
      console.log(`Matching ${key} with RegExps...`);

      const destructured = element.matchAll(/\{(?<keyName>[^}]*)\}\s*=\s*process\.env(.*)+$/gm);
      for (let result of destructured) {
        let { keyName } = result.groups;
        console.log('Found in destructuring:', keyName);
        if (keyName.includes(',')) {
          const cleanKeyNames = keyName.split(',').map((item) => item.trim());
          cleanKeyNames.forEach((cleanKeyName) => {
            keysFound.add(cleanKeyName);
          });
        } else {
          keysFound.add(keyName.trim());
        }
      }

      const classic = element.matchAll(/process\.env\.(?<keyName>[\w\d]+)(.*)+$/gm);
      for (let result of classic) {
        let { keyName } = result.groups;
        console.log('Found in classic vars:', keyName);
        keysFound.add(keyName.trim());
      }
    }
  }

  console.log('KEYS FOUND:', keysFound);

  return Array.from(keysFound);
}

function generateSchema(keysFound) {
  const schemaObj = Object.fromEntries(keysFound.map((item) => ([item, ''])));
  const schema = envStringifyInit(schemaObj);
  return schema;
}

module.exports = {
  findEnvVariables,
  generateSchema,
};

import deepReadDir from './deepReadDir';
import readFilesQueued from './readFilesQueued';

const ignoredFilenames = [
  '.git',
  '.gitignore',
  '.gitattributes',
  'package.json',
  'package-lock.json',
  '*/node_modules',
  // TODO? Maybe shouldn't scan .json at all (like Babel source maps). Or maybe anything other than JS-like extensions. I think it's better to not exclude them by default, but leave a mention somewhere in the docs.
];

export async function findEnvVariables() {
  const files = await readDirFiles(process.cwd());

  const keysFound = {};

  function setKeyValueOfKeysFound(key, value = '') {
    keysFound[key.trim()] = value.trim();
  }

  function addDestructuredEnvKeyToKeysFound(key) {
    const [handledKey, value] = handleDestructuredDefaultValues(key);
    setKeyValueOfKeysFound(
      handleDestructuredRenaming(handleDestructuredPlainNewlines(handledKey)),
      value,
    );
  }

  function handleDestructuredDefaultValues(key) {
    const defaultValueDelimiter = '=';
    if (key.includes(defaultValueDelimiter)) {
      const [actualKey, value] = key.split(defaultValueDelimiter);
      return [actualKey, value];
    }
    return [key];
  }

  function handleDestructuredRenaming(possiblyRenamedKey) {
    const renamingDelimiter = ':';
    if (possiblyRenamedKey.includes(renamingDelimiter)) {
      const [keyWithoutRename] = possiblyRenamedKey.split(renamingDelimiter);
      return keyWithoutRename;
    }
    return possiblyRenamedKey;
  }

  /** Handles \n inside env keys of files like Babel .json source maps */
  function handleDestructuredPlainNewlines(possiblyKeyWithNewline) {
    const newlineCharacter = '\\n';
    if (possiblyKeyWithNewline.includes(newlineCharacter)) {
      return possiblyKeyWithNewline.replaceAll(newlineCharacter, '');
    }
    return possiblyKeyWithNewline;
  }

  function addClassicEnvKeyToKeysFound(key) {
    setKeyValueOfKeysFound(key);
  }

  for (const key in files) {
    if (Object.hasOwnProperty.call(files, key)) {
      const element: string = files[key];
      // console.log(`Matching ${key} with RegExps...`);

      const destructured = element.matchAll(/\{(?<keyName>[^{}]*)\}\s*=\s*process\.env(.*)+$/gm);
      for (const {
        // @ts-expect-error keyName exists. If it does not, then `destructured` would contain nothing, meaning that the loop wouldn't execute.
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
        // @ts-expect-error keyName exists. If it does not, then `destructured` would contain nothing, meaning that the loop wouldn't execute.
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

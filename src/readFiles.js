const fs = require('fs');

/**
 * Currently unused, readFilesQueued is used instead.
 */
function readFiles(fileNames) {
  const files = {};

  for (const fileName of fileNames) {
    const file = fs.readFileSync(fileName, 'utf8');
    files[fileName] = file;
  }

  return files;
}

module.exports = readFiles;

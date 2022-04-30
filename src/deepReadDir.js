const { lstat, readdir } = require('node:fs/promises');
const { join } = require('node:path');

const deepReadDir = async (dirPath) => Promise.all(
  (await readdir(dirPath)).map(async (entity) => {
    const path = join(dirPath, entity);
    return (await lstat(path)).isDirectory() ? deepReadDir(path) : path;
  }),
);

module.exports = deepReadDir;

const {lstat, readdir} = require('node:fs/promises')
const {join} = require('node:path')

const deepReadDir = async (dirPath) => await Promise.all(
  (await readdir(dirPath)).map(async (entity) => {
    const path = join(dirPath, entity)
    return (await lstat(path)).isDirectory() ? await deepReadDir(path) : path
  }),
)

module.exports = deepReadDir;

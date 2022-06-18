import { lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const deepReadDir = async (dirPath: string) => Promise.all(
  (await readdir(dirPath)).map(async (entity) => {
    const path = join(dirPath, entity);
    return (await lstat(path)).isDirectory() ? deepReadDir(path) : path;
  }),
);

export default deepReadDir;

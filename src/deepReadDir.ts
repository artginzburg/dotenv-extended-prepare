import { lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const deepReadDir = async (dirPath: string): Promise<NestedStrings> => Promise.all(
  (await readdir(dirPath)).map(async (entity) => {
    const path = join(dirPath, entity);
    return (await lstat(path)).isDirectory() ? deepReadDir(path) : path;
  }),
) as Promise<NestedStrings>;

/**
 * Practically means that the strings can be infinitely nested.
 * @example ['one', ['two', 'three', ['four', ['five', [], 'six']]]]
 */
type NestedStrings = (string | string[])[];

export default deepReadDir;

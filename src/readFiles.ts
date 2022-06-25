import fs from 'fs';

/**
 * Currently unused, readFilesQueued is used instead.
 */
function readFiles(fileNames: string[]) {
  const files: Record<string, string> = {};

  for (const fileName of fileNames) {
    const file = fs.readFileSync(fileName, 'utf8');
    files[fileName] = file;
  }

  return files;
}

export default readFiles;

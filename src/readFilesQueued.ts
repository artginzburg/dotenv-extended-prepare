import fsPromises from 'fs/promises';

import { TaskQueue } from 'cwait';

// Allow max. 10 concurrent file reads.
// @ts-expect-error i know that the Result may be `undefined`, and it's ok.
const queue = new TaskQueue(Promise, 10);
const read = queue.wrap(fsPromises.readFile);

async function readFilesQueued(fileNames: string[]) {
  const files = {};

  await Promise.all(
    fileNames.map(async (fileName) => {
      // @ts-expect-error 2nd argument is valid here.
      const file = await read(fileName, 'utf8');
      files[fileName] = file;
    }),
  );

  return files;
}

export default readFilesQueued;

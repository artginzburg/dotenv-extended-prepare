const fsPromises = require('fs/promises');

const cwait = require('cwait');

// Allow max. 10 concurrent file reads.
const queue = new cwait.TaskQueue(Promise, 10);
const read = queue.wrap(fsPromises.readFile);

async function readFilesQueued(fileNames) {
  const files = {};

  await Promise.all(
    fileNames.map(async (fileName) => {
      const file = await read(fileName, 'utf8');
      files[fileName] = file;
    })
  );

  return files;
}

module.exports = readFilesQueued;

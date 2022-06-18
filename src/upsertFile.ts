import fs from 'fs';

export function upsertFile(path: fs.PathOrFileDescriptor, dataIfNotFound: string | NodeJS.ArrayBufferView) {
  try {
    fs.writeFileSync(path, dataIfNotFound, { flag: 'wx' });
    console.log(`[${process.env.npm_package_name}] Prepared ${path} file`);
  } catch (error) {
    // It's ok, just means the file already exists.
  }
}

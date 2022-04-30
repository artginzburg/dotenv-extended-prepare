const fs = require('fs');

function upsertFile(path, dataIfNotFound) {
  try {
    fs.writeFileSync(path, dataIfNotFound, { flag: 'wx' });
    console.log(`[${process.env.npm_package_name}] Prepared ${path} file`);
  } catch (error) {

  }
}

module.exports = {
  upsertFile,
};

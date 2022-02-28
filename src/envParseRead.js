const fs = require('fs');

function envParse(envString) {
  const envArr = envString.trim().split('\n');

  let envObject = {};
  envArr.forEach((el) => {
    const elSplitted = el.split('=');
    const key = elSplitted[0].trim();
    const value = (elSplitted[1] ?? '').trim();
    envObject[key] = value;
  });
  return envObject;
}

function readFileOrReturnEmptyObject(path) {
  if (!fs.existsSync(path)) {
    return {};
  }

  const env = fs.readFileSync(path, { encoding: 'utf-8' });

  return env;
}

function envRead(path) {
  const env = readFileOrReturnEmptyObject(path);

  return envParse(env);
}

module.exports = {
  envParse,
  readFileOrReturnEmptyObject,
  envRead,
};

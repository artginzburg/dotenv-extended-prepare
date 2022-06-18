import fs from 'fs';

export function envParse(envString) {
  const envArr = envString.trim().split('\n');

  const envObject = {};
  envArr.forEach((el) => {
    const elSplitted = el.split('=');
    const key = elSplitted[0].trim();
    const value = (elSplitted[1] ? elSplitted[1] : '').trim(); // ?: instead of ?? for older Node.JS versions support
    envObject[key] = value;
  });
  return envObject;
}

export function readFileOrReturnEmptyObject(path) {
  if (!fs.existsSync(path)) {
    return {};
  }

  const env = fs.readFileSync(path, { encoding: 'utf-8' });

  return env;
}

export function envRead(path: string) {
  const env = readFileOrReturnEmptyObject(path);

  return JSON.stringify(env) === '{}' ? undefined : envParse(env);
}

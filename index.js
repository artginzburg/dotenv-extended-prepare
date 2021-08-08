#!/usr/bin/env node

const fs = require('fs');

const paths = {
  env: '.env',
  schema: '.env.schema',
  defaults: '.env.defaults',
};

function upsertFile(name, dataIfNotFound) {
  const nameFromDirname = `${__dirname}/${name}`;

  fs.writeFile(nameFromDirname, dataIfNotFound, { flag: 'wx' }, (err) => {
    if (err) {
      return;
    }
    console.log(`Prepared ${name} file`);
  });
}

function envParse(path) {
  const fileToRead = `${__dirname}/${path}`;

  if (!fs.existsSync(fileToRead)) {
    return {};
  }
  const env = fs.readFileSync(fileToRead, { encoding: 'utf-8' }).trim();
  const envArr = env.split('\n');

  let envObject = {};
  envArr.forEach((el) => {
    const elSplitted = el.split('=');
    const key = elSplitted[0];
    const value = elSplitted[1] ?? '';
    envObject[key] = value;
  });
  return envObject;
}

function envStringifyInit(envObj) {
  let string = '';

  for (const key in envObj) {
    if (envObj[key]) {
      string += '# ';
    }

    string += `${key}=\n`;
  }

  return string.trim();
}

const setAll = (obj, val) => Object.keys(obj).forEach((k) => (obj[k] = val));

const envSchema = envParse(paths.envSchema);
setAll(envSchema, '');

const envDefaults = envParse(paths.envDefaults);

const stringifiedEnv = envStringifyInit({ ...envSchema, ...envDefaults });

upsertFile(paths.env, stringifiedEnv);

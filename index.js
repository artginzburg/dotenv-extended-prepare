#!/usr/bin/env node

const fs = require('fs');

const paths = {
  env: '.env',
  schema: '.env.schema',
  defaults: '.env.defaults',
};

function upsertFile(path, dataIfNotFound) {
  fs.writeFile(path, dataIfNotFound, { flag: 'wx' }, (err) => {
    if (err) {
      return;
    }
    console.log(`[${process.env.npm_package_name}] Prepared ${path} file`);
  });
}

function envParse(path) {
  if (!fs.existsSync(path)) {
    return {};
  }
  const env = fs.readFileSync(path, { encoding: 'utf-8' }).trim();
  const envArr = env.split('\n');

  let envObject = {};
  envArr.forEach((el) => {
    const elSplitted = el.split('=');
    const key = elSplitted[0].trim();
    const value = (elSplitted[1] ?? '').trim();
    envObject[key] = value;
  });
  return envObject;
}

function envStringifyInit(envObj) {
  let string = '';

  for (const key in envObj) {
    if (key) {
      if (envObj[key]) {
        string += '# ';
      }

      string += `${key}${key[0] === '#' ? '' : '='}\n`;
    }
  }

  return string.trim();
}

const setAll = (obj, val) => Object.keys(obj).forEach((k) => (obj[k] = val));

const envSchema = envParse(paths.schema);
setAll(envSchema, '');

const envDefaults = envParse(paths.defaults);

const stringifiedEnv = envStringifyInit({ ...envSchema, ...envDefaults });

upsertFile(paths.env, stringifiedEnv);

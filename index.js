#!/usr/bin/env node

const { paths } = require('./src/config');
const { envRead } = require('./src/envParseRead');
const { envStringifyInit } = require('./src/envStringifyInit');
const { setAll } = require('./src/setAll');
const { upsertFile } = require('./src/upsertFile');
const { findEnvVariables, generateSchema } = require('./src/generateSchema');

const lastArgument = process.argv[process.argv.length - 1];
if (lastArgument === 'generate') {
  const found = findEnvVariables();
  const schema = generateSchema(found);
  upsertFile(paths.schema, schema);
  return;
}

const envSchema = envRead(paths.schema);
setAll(envSchema, '');

const envDefaults = envRead(paths.defaults);

const stringifiedEnv = envStringifyInit({ ...envSchema, ...envDefaults });

upsertFile(paths.env, stringifiedEnv);

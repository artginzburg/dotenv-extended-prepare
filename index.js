#!/usr/bin/env node

const { paths } = require('./src/config');
const { envRead } = require('./src/envParseRead');
const { envStringifyInit } = require('./src/envStringifyInit');
const { setAll } = require('./src/setAll');
const { upsertFile } = require('./src/upsertFile');

const { findEnvVariables } = require('./src/generateSchema');

async function generateEnvSchema() {
  const found = await findEnvVariables();
  setAll(found, ''); // TODO remove when .env.defaults generation is implemented

  const schema = envStringifyInit(found);

  upsertFile(paths.schema, schema);
}

function generateEnv() {
  const envSchema = envRead(paths.schema);
  setAll(envSchema, '');
  
  const envDefaults = envRead(paths.defaults);
  
  const stringifiedEnv = envStringifyInit({ ...envSchema, ...envDefaults });
  
  upsertFile(paths.env, stringifiedEnv);
}

function outputVersion() {
  // This is for development purposes, so that we can quickly determine if the development version is `npm link`ed 
  console.log(`v${require('./package.json').version}`);
}

const lastArgument = process.argv[process.argv.length - 1];
if (lastArgument === 'version') {
  outputVersion()
} else if (lastArgument === 'generate') {
  generateEnvSchema();
} else {
  generateEnv();
}

#!/usr/bin/env node

import { paths } from './src/config';
import { envRead } from './src/envParseRead';
import { envStringifyInit } from './src/envStringifyInit';
import { setAll } from './src/setAll';
import { filterObject } from './src/filterObject';
import { upsertFile } from './src/upsertFile';

import { findEnvVariables } from './src/generateSchema';

async function generateEnvSchema() {
  const found = await findEnvVariables();

  const schemaForGeneration = { ...found };
  setAll(schemaForGeneration, '');
  const defaultsForGeneration = { ...found };
  filterObject(defaultsForGeneration, (value) => value !== '');

  const schema = envStringifyInit(schemaForGeneration);
  const defaults = envStringifyInit(defaultsForGeneration, true);

  upsertFile(paths.schema, schema);
  upsertFile(paths.defaults, defaults);
}

function generateEnv() {
  const envSchema = envRead(paths.schema);
  // @ts-expect-error todo
  setAll(envSchema, '');

  const envDefaults = envRead(paths.defaults);

  const stringifiedEnv = envStringifyInit({ ...envSchema, ...envDefaults });

  upsertFile(paths.env, stringifiedEnv);
}

async function outputVersion() {
  // This is for development purposes, so that we can quickly determine if the development version is `npm link`ed
  console.log(`v${(await import('./package.json')).version}`);
}

const lastArgument = process.argv[process.argv.length - 1];
if (lastArgument === 'version') {
  outputVersion();
} else if (lastArgument === 'generate') {
  generateEnvSchema();
} else {
  generateEnv();
}

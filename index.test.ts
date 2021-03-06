/* eslint-disable no-useless-escape */
// Idk how useless the escapes are here, need to check later.
import test from 'ava';

import fs from 'fs';

import { paths } from './src/config';
import { envParse, envRead, readFileOrReturnEmptyObject } from './src/envParseRead';
import { envStringifyInit } from './src/envStringifyInit';
import { setAll } from './src/setAll';
import { upsertFile } from './src/upsertFile';

const envTestData = {
  schema: `MAIL_USERNAME=^\S+$
MAIL_PASSWORD=^\S+$
  MAIL_HOST=^\S+$

MAIL_PORT=^\S+$
GOOGLE_API_KEY=^\S+$
BOT_TOKEN=^\S+$
 # testing for comments = lol
BOT_OWNER_ID=^[0-9]+$
MONGO=(ftp|http(s)|mongodb):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?

# Testing support for comments`,
  defaults: `MAIL_USERNAME=

MAIL_HOST=imap.gmail.com
MAIL_PORT=993


MONGO=mongodb://localhost:27017/$npm_package_name`,
  result: `MAIL_USERNAME=
MAIL_PASSWORD=
# MAIL_HOST=
# MAIL_PORT=
GOOGLE_API_KEY=
BOT_TOKEN=
# testing for comments
BOT_OWNER_ID=
# MONGO=
# Testing support for comments`,
};

test('parses schema and defaults', (t) => {
  const envSchema = envParse(envTestData.schema);
  setAll(envSchema, '');

  const envDefaults = envParse(envTestData.defaults);

  const stringifiedEnv = envStringifyInit({ ...envSchema, ...envDefaults });

  t.is(stringifiedEnv, envTestData.result);
});

test('reads/writes files', (t) => {
  if (fs.existsSync(paths.env)) {
    fs.rmSync(paths.env);
  }
  const envSchema = envRead(paths.schema);
  // @ts-expect-error todo
  setAll(envSchema, '');

  const envDefaults = envRead(paths.defaults);

  const stringifiedEnv = envStringifyInit({ ...envSchema, ...envDefaults });

  upsertFile(paths.env, stringifiedEnv);

  const result = readFileOrReturnEmptyObject(paths.env);

  t.is(
    result,
    `MAIL_USERNAME=
MAIL_PASSWORD=
# MAIL_HOST=
# MAIL_PORT=
GOOGLE_API_KEY=
BOT_TOKEN=
# testing for comments
BOT_OWNER_ID=
# MONGO=
# Testing support for comments`,
  );
});

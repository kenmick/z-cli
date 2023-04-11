#!/usr/bin/env node
import chalk from 'chalk';
import { cli } from 'cleye';

import { ENABLED_DEBUG_MODE } from './utils/common.js';
import { getChoiceOfList, getResultOfQuery } from './utils/prompt-util.js';

function checkConfig() {
  if (!process.env.OPENAI_API_KEY) {
    console.log(
      `😟 ${chalk.red(
        'Please set OPENAI_API_KEY in your environment variables.'
      )}`
    );
    process.exit(1);
  }
}

function parseArgs() {
  const argv = cli({
    name: 'z-cli',
    version: '0.2.2',
    parameters: ['<query>'],
    flags: {
      proxy: {
        type: String,
        alias: 'p',
        description: 'Proxy url. e.g. http://localhost:8080',
      },
      debug: {
        type: Boolean,
        description: 'Enable debug mode',
      },
    },
  });
  if (Object.keys(argv.unknownFlags).length > 0) {
    console.log(
      `😟 ${chalk.red(
        `Unknown flags: ${Object.keys(argv.unknownFlags).join(', ')}`
      )}`
    );
    process.exit(1);
  }
  if (argv.flags.proxy) {
    process.env.ZCLI_PROXY = argv.flags.proxy;
  }
  if (argv.flags.debug) {
    process.env.ZCLI_DEBUG_MODE = ENABLED_DEBUG_MODE;
  }
  return argv._.query;
}

async function run() {
  checkConfig();
  const query = parseArgs();
  await getResultOfQuery(false, query);
  await getChoiceOfList();
}

run();

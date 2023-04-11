import { createHash } from 'node:crypto';

import { spinner } from '@clack/prompts';
import { AxiosError, AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import httpsProxyAgent from 'https-proxy-agent';
import { Configuration, OpenAIApi } from 'openai';

import { cache } from '../store/cache.js';
import {
  ASK_ChatGPT,
  isDebugMode,
  printQueryAndCommand,
  promptData,
} from './common.js';
import { logger } from './log-util.js';
import { getOsAndShell } from './os-util.js';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const { osType, shellName } = getOsAndShell();
const { queryHistory } = promptData;

const messages: Message[] = [
  {
    role: 'system',
    content: `You act as a Shell(${shellName}) on ${osType}. All your answers are a single command. You do not write any explanations. If you fail to answer it, start your response with '#'`,
  },
];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const s = spinner();

export async function askChatGPT(query: string) {
  queryHistory.push(query);
  printQueryAndCommand();
  messages.push({
    role: 'user',
    content:
      messages.length === 1
        ? query
        : `Add one more requirement: ${query}. Please revise previous command.`,
  });

  // md5 a string
  const cacheKey = md5(JSON.stringify(messages));

  if (cache.get()) s.start('Hold on, asking ChatGPT...');
  try {
    let options: AxiosRequestConfig = {};
    if (process.env.ZCLI_PROXY) {
      options = {
        proxy: false,
        httpsAgent: httpsProxyAgent(process.env.ZCLI_PROXY),
      };
    }
    const completion = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0,
      },
      options
    );
    s.stop();
    if (isDebugMode()) {
      logger.info(
        ASK_ChatGPT,
        'Received response from openai API: statusCode=%i, request=%j, response=%j',
        completion.status,
        completion.config.data,
        completion.data
      );
    }
    messages.push(completion.data.choices[0].message as Message);
    return completion.data.choices[0].message?.content;
  } catch (error) {
    s.stop();
    if (isDebugMode()) {
      const axiosError = error as AxiosError;
      logger.error(
        ASK_ChatGPT,
        'Failed to request openai API: statusCode=%i, response=%j',
        axiosError.response?.status,
        axiosError.response?.data
      );
    }
    console.log(`😟 ${chalk.red(`Sorry, failed to connect to openai.`)}`);
    process.exit(1);
  }
}

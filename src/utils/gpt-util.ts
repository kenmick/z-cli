import { AxiosRequestConfig } from 'axios';
import chalk from 'chalk';
import httpsProxyAgent from 'https-proxy-agent';
import { Configuration, OpenAIApi } from 'openai';
import ora from 'ora';

import { getOsAndShell } from './os-util.js';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const { osType, shellName } = getOsAndShell();

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

export async function askGPT(question: string) {
  messages.push({
    role: 'user',
    content:
      messages.length === 1
        ? question
        : `Add one more requirement: ${question}. Please revise previous command.`,
  });
  const spinner = ora('Hold on, asking GPT-3.5...').start();
  try {
    let options: AxiosRequestConfig = {
      proxy: false,
    };
    if (process.env.proxy) {
      options.httpsAgent = httpsProxyAgent(process.env.proxy);
    }
    const completion = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0,
      },
      options
    );
    messages.push(completion.data.choices[0].message as Message);
    spinner.stop();
    return completion.data.choices[0].message?.content;
  } catch (error) {
    spinner.stop();
    console.log(`😟 ${chalk.red(`Sorry, failed to connect to openai.`)}`);
    process.exit(1);
  }
}

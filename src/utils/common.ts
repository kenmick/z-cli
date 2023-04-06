import { intro } from '@clack/prompts';
import chalk from 'chalk';

export interface PromptData {
  queryHistory: string[];
  command?: string;
  error?: string;
}

export const EXECUTE_COMMAND = 'executeCommand';
export const ASK_ChatGPT = 'askChatGPT';
export const ENABLED_DEBUG_MODE = 'enabled';
export const promptData: PromptData = {
  command: undefined,
  error: undefined,
  queryHistory: [],
};

export function isDebugMode() {
  return process.env.ZCLI_DEBUG_MODE === ENABLED_DEBUG_MODE;
}

export function clearScreen() {
  if (!isDebugMode()) {
    console.clear();
  }
}

export function printQueryAndCommand() {
  clearScreen();
  intro(
    `Query: ${chalk.yellow(
      promptData.queryHistory.length === 1
        ? promptData.queryHistory[0]
        : promptData.queryHistory
            .map((query, index) => `${index + 1}) ${query}`)
            .join(' ')
    )}`
  );
  if (promptData.command) {
    intro(`Command: ${chalk.blue(promptData.command)}`);
  }
  if (promptData.error) {
    intro(`Error: ${chalk.red(promptData.error)}`);
  }
}

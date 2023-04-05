import { confirm, isCancel, select, text } from '@clack/prompts';
import editor from '@inquirer/editor';
import chalk from 'chalk';
import { execSync } from 'child_process';

import {
  EXECUTE_COMMAND,
  clearScreen,
  isDebugMode,
  printQueryAndCommand,
  promptData,
} from './common.js';
import { askGPT } from './gpt-util.js';
import { logger } from './log-util.js';
import { getOsAndShell } from './os-util.js';

const { shellPath } = getOsAndShell();

export async function getResultOfQuery(
  isRevision: boolean,
  query?: string
): Promise<void> {
  if (isRevision) {
    clearScreen();
    query = (await text({
      message: chalk.green(
        `Please input your revision: ${chalk.yellow(
          '(Press Enter key directly to quit revision)'
        )}`
      ),
    })) as string;
    if (query === undefined) {
      await getChoiceOfList();
      return;
    }
    if (isCancel(query)) {
      clearScreen();
      process.exit(0);
    }
  }
  const answer = await askGPT(query as string);
  if (!answer || /^(#|Sorry|I'm sorry)/.test(answer)) {
    promptData.error = `Sorry, I don't understand your question.`;
  } else {
    promptData.command = answer;
    promptData.error = undefined;
  }
  if (promptData.error && !isRevision) {
    console.log(`😟 ${chalk.red(promptData.error)}`);
    process.exit(1);
  }
}

export async function getChoiceOfList(): Promise<void> {
  let reSelect;
  do {
    printQueryAndCommand();
    let confirm = true;
    const choice = await select({
      message: chalk.green('Please choose an option: '),
      options: [
        { value: 'run', label: '✅ Run command' },
        { value: 'revise', label: '🧭 Revise query' },
        { value: 'edit', label: '📝 Edit command' },
        { value: 'cancel', label: '❌ Cancel' },
      ],
    });

    if (isCancel(choice)) {
      clearScreen();
      process.exit(0);
    }

    if (choice === 'run') {
      confirm = await runCommand();
    } else if (choice === 'revise') {
      await getResultOfQuery(true);
    } else if (choice === 'edit') {
      await editCommand();
    } else if (choice === 'cancel') {
      clearScreen();
      process.exit(0);
    }
    // re-enter select mode if the user chooses to revise query, edit command, or run command but cancel it
    reSelect =
      choice === 'revise' ||
      choice === 'edit' ||
      (choice === 'run' && !confirm);
  } while (reSelect);
}

async function editCommand(): Promise<void> {
  clearScreen();
  const command = promptData.command || '';
  const edit = await editor({
    message: `${chalk.green(`Please edit following command: `)}\n${chalk.blue(
      command
    )}`,
    default: command,
  });
  const edited = edit.trim();
  promptData.error = undefined;
  promptData.command = edited;
}

async function runCommand(): Promise<boolean> {
  clearScreen();
  const command = promptData.command || '';
  const answer = await confirm({
    message: `${chalk.yellow(
      'Would you like to execute following command: '
    )}\n${chalk.blue(command)}`,
  });
  if (isCancel(answer)) {
    clearScreen();
    process.exit(0);
  }
  if (answer) {
    try {
      if (isDebugMode()) {
        logger.info(
          EXECUTE_COMMAND,
          `Executing command "%s" in [%s]`,
          command,
          shellPath
        );
      }
      execSync(command, {
        encoding: 'utf-8',
        shell: shellPath,
        stdio: 'inherit',
      });
      process.exit(0);
    } catch (err) {
      if (isDebugMode()) {
        logger.error(
          EXECUTE_COMMAND,
          'Failed to execute command: %s',
          command,
          (err as Error).message
        );
      }
      process.exit(1);
    }
  }
  return answer;
}

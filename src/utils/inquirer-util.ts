import chalk from 'chalk';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

import { askGPT } from './gpt-util.js';
import { getOsAndShell } from './os-util.js';

export interface ChoiceResult {
  reSelect: boolean;
  command: string;
  error?: string;
}

export interface QueryResult {
  command?: string;
  error?: string;
}

const { shellPath } = getOsAndShell();

export async function getResultOfQuery(
  isRevision: boolean,
  query?: string
): Promise<QueryResult> {
  if (isRevision) {
    console.clear();
    query = (
      await inquirer.prompt({
        type: 'input',
        name: 'query',
        message: chalk.green('Please input your revision: '),
        validate: (input) => {
          if (input.trim()) {
            return true;
          }
          return `😟 ${chalk.red(`Sorry, please input your query.`)}`;
        },
      })
    ).query;
  }
  const answer = await askGPT(query as string);
  let error;
  let command;
  if (!answer || answer.startsWith('#')) {
    error = `Sorry, I don't understand your question.`;
  } else if (answer.startsWith(`I'm sorry`)) {
    error = answer;
  } else {
    command = answer;
  }
  if (error && !isRevision) {
    console.log(`😟 ${chalk.red(error)}`);
    process.exit(1);
  }
  return { command, error };
}

export async function getChoiceOfList(
  command: string,
  error?: string
): Promise<ChoiceResult> {
  console.clear();
  let confirm = true;
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: `Command: ${chalk.blue(command)}\n${
      error ? `Error: ${chalk.red(error)}\n` : ''
    }${chalk.green('Please choose an option: ')}
    `,
    choices: [
      {
        name: '✅ Run command',
        value: 'run',
      },
      {
        name: '🧭 Revise query',
        value: 'revise',
      },
      {
        name: '📝 Edit command',
        value: 'edit',
      },
      {
        name: '❌ Cancel',
        value: 'cancel',
      },
    ],
  });
  if (choice === 'run') {
    confirm = await runCommand(command);
  } else if (choice === 'revise') {
    let result = await getResultOfQuery(true);
    if (result.error) {
      error = result.error;
    } else if (result.command) {
      command = result.command;
      error = undefined;
    }
  } else if (choice === 'edit') {
    command = await editCommand(command);
  } else if (choice === 'cancel') {
    console.clear();
    process.exit(0);
  }
  // re-enter select mode if the user chooses to revise query, edit command, or run command but cancel it
  const reSelect =
    choice === 'revise' || choice === 'edit' || (choice === 'run' && !confirm);
  return { reSelect, command, error };
}

async function editCommand(command: string) {
  console.clear();
  const { edit } = await inquirer.prompt({
    type: 'editor',
    name: 'edit',
    message: `${chalk.green(`Please edit following command: `)}\n${chalk.blue(
      command
    )}`,
    default: command,
  });
  const edited = edit.trim();
  return edited;
}

async function runCommand(command: string): Promise<boolean> {
  console.clear();
  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: `${chalk.yellow(
      'Would you like to execute following command: '
    )}\n${chalk.blue(command)}`,
    default: false,
  });
  if (confirm) {
    try {
      execSync(command, {
        encoding: 'utf-8',
        shell: shellPath,
        stdio: 'inherit',
      });
    } catch (err) {
      process.exit(1);
    }
  }
  return confirm;
}

import log from 'npmlog';

import { ENABLED_DEBUG_MODE } from './common.js';

log.style = {
  info: { fg: 'green', bg: '', bold: true },
  error: { fg: 'red', bg: '', bold: true },
  warn: { fg: 'yellow', bg: '', bold: true },
};

// add timestamp to log
Object.defineProperty(log, 'heading', {
  get: () => {
    return `[${new Date().toLocaleString()}]`;
  },
});
log.headingStyle = { fg: 'grey', bg: '' };

export const logger = log;

export function isDebugMode() {
  return process.env.ZCLI_DEBUG_MODE === ENABLED_DEBUG_MODE;
}

export function clearScreen() {
  if (!isDebugMode()) {
    console.clear();
  }
}

import fs from 'fs';
import os from 'os';

import { LOAD_CACHE, isDebugMode } from '../utils/common.js';
import { logger } from '../utils/log-util.js';

const DB_FILE = `${os.homedir()}/.config/z-cli/db.json`;

interface QueryCacheItem {
  query: string;
  command: string;
  createdAt: number;
}

interface QueryCache {
  [key: string]: QueryCacheItem;
}

class Cache {
  private cache: { query: QueryCache } = { query: {} };
  constructor() {
    if (fs.existsSync(DB_FILE)) {
      this.cache = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (isDebugMode()) {
        logger.info(LOAD_CACHE, `Cache [${DB_FILE}] is loaded`);
      }
    } else {
      fs.mkdirSync(`${os.homedir()}/.config/z-cli`, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache));
    }
  }

  public get(key: string) {
    return this.cache.query[key];
  }

  public set(key: string, item: QueryCacheItem) {
    this.cache.query[key] = item;
  }

  public save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.cache));
  }
}

export const cache = new Cache();

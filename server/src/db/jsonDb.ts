import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, '../data/db.json');

export interface DatabaseSchema {
  users: any[];
  sessions: any[];
  stories: any[];
  books: any[];
  participants: any[];
  roleplayScenarios: any[];
  roleplayLogs: any[];
  progressEntries: any[];
}

export class JsonDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Failed to read db.json, initializing empty schema:', err);
    }
    return {
      users: [],
      sessions: [],
      stories: [],
      books: [],
      participants: [],
      roleplayScenarios: [],
      roleplayLogs: [],
      progressEntries: []
    };
  }

  private saveDatabase(): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public getCollection<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.data[collection] || [];
  }

  public findById<K extends keyof DatabaseSchema>(collection: K, id: string): any | undefined {
    return (this.data[collection] || []).find((item: any) => item.id === id || item.draftId === id || item.scenarioId === id || item.logId === id);
  }

  public insert<K extends keyof DatabaseSchema>(collection: K, item: any): any {
    this.data[collection].unshift(item);
    this.saveDatabase();
    return item;
  }

  public update<K extends keyof DatabaseSchema>(collection: K, id: string, updateData: Partial<any>): any | undefined {
    const items = this.data[collection] || [];
    const index = items.findIndex((item: any) => item.id === id || item.draftId === id || item.scenarioId === id || item.logId === id);

    if (index !== -1) {
      this.data[collection][index] = {
        ...this.data[collection][index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveDatabase();
      return this.data[collection][index];
    }
    return undefined;
  }

  public delete<K extends keyof DatabaseSchema>(collection: K, id: string): boolean {
    const items = this.data[collection] || [];
    const index = items.findIndex((item: any) => item.id === id || item.draftId === id || item.scenarioId === id || item.logId === id);

    if (index !== -1) {
      this.data[collection].splice(index, 1);
      this.saveDatabase();
      return true;
    }
    return false;
  }
}

export const db = new JsonDatabase();

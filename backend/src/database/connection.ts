import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { MigrationRunner } from './migrations';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database;

  private constructor() {
    const dbPath = process.env.NODE_ENV === 'test'
      ? ':memory:'
      : path.join(__dirname, '../../data/tasks.db');

    // Ensure data directory exists
    if (dbPath !== ':memory:') {
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.runMigrations();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  private runMigrations(): void {
    const migrationRunner = new MigrationRunner(this.db);
    migrationRunner.runMigrations();
  }

  public close(): void {
    this.db.close();
  }
}

export default DatabaseConnection;

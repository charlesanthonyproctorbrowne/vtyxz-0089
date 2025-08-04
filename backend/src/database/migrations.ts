import Database from 'better-sqlite3';

export interface Migration {
  version: number;
  description: string;
  up: (db: Database.Database) => void;
  down: (db: Database.Database) => void;
}

export const migrations: Migration[] = [
  {
    version: 1,
    description: 'Create tasks table',
    up: (db: Database.Database) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          due_date TEXT,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);
    },
    down: (db: Database.Database) => {
      db.exec('DROP TABLE IF EXISTS tasks');
    }
  }
];

export class MigrationRunner {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
    this.initializeMigrationTable();
  }

  private initializeMigrationTable(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        description TEXT NOT NULL,
        applied_at TEXT NOT NULL
      )
    `);
  }

  public runMigrations(): void {
    const appliedMigrations = this.getAppliedMigrations();
    const pendingMigrations = migrations.filter(
      migration => !appliedMigrations.includes(migration.version)
    );

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Running ${pendingMigrations.length} pending migrations...`);

    for (const migration of pendingMigrations) {
      console.log(`Applying migration ${migration.version}: ${migration.description}`);

      const transaction = this.db.transaction(() => {
        migration.up(this.db);
        this.recordMigration(migration);
      });

      transaction();
    }

    console.log('All migrations completed successfully');
  }

  private getAppliedMigrations(): number[] {
    const stmt = this.db.prepare('SELECT version FROM migrations ORDER BY version');
    const rows = stmt.all() as { version: number }[];
    return rows.map(row => row.version);
  }

  private recordMigration(migration: Migration): void {
    const stmt = this.db.prepare(`
      INSERT INTO migrations (version, description, applied_at)
      VALUES (?, ?, ?)
    `);

    stmt.run(migration.version, migration.description, new Date().toISOString());
  }
}

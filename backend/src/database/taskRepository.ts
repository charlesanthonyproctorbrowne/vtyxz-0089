import Database from 'better-sqlite3';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../types/shared';
import DatabaseConnection from './connection';

export class TaskRepository {
  private db: Database.Database;

  constructor() {
    this.db = DatabaseConnection.getInstance().getDatabase();
  }

  async findAll(sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Promise<Task[]> {
    let query = 'SELECT * FROM tasks';

    if (sortBy === 'dueDate') {
      query += ` ORDER BY due_date ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
    } else if (sortBy === 'status') {
      // Custom ordering for status
      const statusOrder = sortOrder === 'asc'
        ? `CASE status WHEN '${TaskStatus.PENDING}' THEN 1 WHEN '${TaskStatus.IN_PROGRESS}' THEN 2 WHEN '${TaskStatus.COMPLETED}' THEN 3 END`
        : `CASE status WHEN '${TaskStatus.COMPLETED}' THEN 1 WHEN '${TaskStatus.IN_PROGRESS}' THEN 2 WHEN '${TaskStatus.PENDING}' THEN 3 END`;
      query += ` ORDER BY ${statusOrder}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const stmt = this.db.prepare(query);
    const rows = stmt.all() as any[];

    return rows.map(this.mapRowToTask);
  }

  async findById(id: string): Promise<Task | null> {
    const stmt = this.db.prepare('SELECT * FROM tasks WHERE id = ?');
    const row = stmt.get(id) as any;

    return row ? this.mapRowToTask(row) : null;
  }

  async create(taskData: CreateTaskRequest & { id: string; createdAt: string; updatedAt: string }): Promise<Task> {
    const stmt = this.db.prepare(`
      INSERT INTO tasks (id, title, description, due_date, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      taskData.id,
      taskData.title,
      taskData.description || null,
      taskData.dueDate || null,
      taskData.status,
      taskData.createdAt,
      taskData.updatedAt
    );

    const createdTask = await this.findById(taskData.id);
    if (!createdTask) {
      throw new Error('Failed to create task');
    }

    return createdTask;
  }

  async update(id: string, updateData: UpdateTaskRequest & { updatedAt: string }): Promise<Task | null> {
    const existingTask = await this.findById(id);
    if (!existingTask) {
      return null;
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description || null);
    }
    if (updateData.dueDate !== undefined) {
      fields.push('due_date = ?');
      values.push(updateData.dueDate || null);
    }
    if (updateData.status !== undefined) {
      fields.push('status = ?');
      values.push(updateData.status);
    }

    fields.push('updated_at = ?');
    values.push(updateData.updatedAt);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE tasks SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(id);

    return result.changes > 0;
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      dueDate: row.due_date || undefined,
      status: row.status as TaskStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

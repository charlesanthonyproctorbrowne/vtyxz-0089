// Test setup file for backend
import DatabaseConnection from '../database/connection';

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
});

// Clean up after each test
afterEach(async () => {
  // Clean up database after each test
  const db = DatabaseConnection.getInstance().getDatabase();
  db.exec('DELETE FROM tasks');
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  DatabaseConnection.getInstance().close();
});

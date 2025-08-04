import DatabaseConnection from '../database/connection';

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Initialize database connection (this will create tables)
    const dbConnection = DatabaseConnection.getInstance();

    console.log('Database initialized successfully!');
    console.log('Tables created and ready for use.');

    // Close the connection
    dbConnection.close();

  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initDatabase();

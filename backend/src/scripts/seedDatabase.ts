import { TaskService } from '../services/taskService';
import { TaskStatus } from '../../shared_types';

async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');

    const taskService = new TaskService();

    const sampleTasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the task management system',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: TaskStatus.IN_PROGRESS
      },
      {
        title: 'Review code changes',
        description: 'Review pull requests and provide feedback',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        status: TaskStatus.PENDING
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        status: TaskStatus.COMPLETED
      },
      {
        title: 'Database optimization',
        description: 'Optimize database queries and add proper indexing',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        status: TaskStatus.PENDING
      }
    ];

    for (const taskData of sampleTasks) {
      await taskService.createTask(taskData);
    }

    console.log(`Successfully seeded database with ${sampleTasks.length} sample tasks!`);

  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
}

seedDatabase();

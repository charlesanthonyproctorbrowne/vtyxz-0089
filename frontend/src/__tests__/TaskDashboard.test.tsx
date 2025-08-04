import { render, screen } from '@testing-library/react';
import { TaskDashboard } from '../components/TaskDashboard';
import { TaskProvider } from '../store';

// Mock the API
jest.mock('../api/taskApi', () => ({
  taskApi: {
    getAllTasks: jest.fn(() => Promise.resolve({ success: true, data: [] })),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

// Mock form validation
jest.mock('../components/useFormState', () => ({
  useFormState: () => ({
    errors: {},
    validateCreateTask: jest.fn(() => true),
    validateUpdateTask: jest.fn(() => true),
    validateField: jest.fn(() => null),
    clearErrors: jest.fn(),
    clearFieldError: jest.fn(),
    setErrors: jest.fn(),
  }),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <TaskProvider>
      {component}
    </TaskProvider>
  );
};

describe('TaskDashboard', () => {
  it('renders task management header', () => {
    renderWithProvider(<TaskDashboard />);

    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders task creation form', () => {
    renderWithProvider(<TaskDashboard />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('renders change history section', () => {
    renderWithProvider(<TaskDashboard />);

    expect(screen.getByText('Change History')).toBeInTheDocument();
  });

  it('renders all tasks section', () => {
    renderWithProvider(<TaskDashboard />);

    expect(screen.getByText('All Tasks')).toBeInTheDocument();
  });

  it('shows empty state when no tasks exist', () => {
    renderWithProvider(<TaskDashboard />);

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });
});

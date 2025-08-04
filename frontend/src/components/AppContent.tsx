import { useEffect } from 'react';
import { useTaskStore } from '../store';
import { useTaskActions } from '../hooks';
import { TaskDashboard } from './TaskDashboard';
import { TaskDetail } from './TaskDetail';
import { EditTaskModal } from './EditTaskModal';

export function AppContent() {
  const { state } = useTaskStore();
  const { loadTasks, cancelEditingTask } = useTaskActions();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskDashboard />

      {state.viewingTask && <TaskDetail />}

      {state.editingTask && (
        <EditTaskModal onClose={cancelEditingTask} />
      )}
    </div>
  );
}

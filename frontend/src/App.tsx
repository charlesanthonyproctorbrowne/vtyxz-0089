import { TaskProvider } from './store';
import { AppContent } from './components/AppContent';

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;

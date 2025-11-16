import { AppProvider } from './context';
import { Dashboard } from './pages';

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;

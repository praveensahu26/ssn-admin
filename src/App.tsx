import { Toaster } from 'sonner';
import AppRouter from './AppRouter';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider } from './hooks/useAuthData';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          richColors
          expand
          visibleToasts={4}
          toastOptions={{ duration: 4000 }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

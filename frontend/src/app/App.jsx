import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from '../features/auth/AuthProvider';
import { ThemeProvider } from '../contexts/ThemeContext';
import { startKeepAlive } from '../services/keepAlive';

function App() {
  useEffect(() => {
    const stopKeepAlive = startKeepAlive();
    return () => {
      stopKeepAlive();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

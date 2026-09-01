import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/Approutes';

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0a1f18',
                color: '#86efac',
                border: '1px solid rgba(22,101,52,0.4)',
                fontSize: '13px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#0a1f18' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#0a1f18' } },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
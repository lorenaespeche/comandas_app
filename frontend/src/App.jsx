import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/Router';
import { useAuth } from './context/AuthContext';

// Componente interno para acessar o contexto de auth
const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      {isAuthenticated ? (
        // Páginas protegidas: com container e margem
        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
          <AppRoutes />
        </Box>
      ) : (
        // Login: tela cheia, sem container
        <AppRoutes />
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
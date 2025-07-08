import Dashboard from '@/pages/dashboard.tsx';
import Login from '@/pages/login.tsx';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import { refresh, AuthTokens } from '@/services/auth.service';
import { ChapterPage } from '@/pages/chapter.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/app-layout';

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        setIsAuthenticated(true);
        setAuthChecked(true);
        return;
      }
      if (refreshToken) {
        try {
          const tokens: AuthTokens = await refresh(refreshToken);
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          if (isMounted) setIsAuthenticated(true);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (isMounted) setIsAuthenticated(false);
        } finally {
          if (isMounted) setAuthChecked(true);
        }
      } else {
        if (isMounted) {
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  if (!authChecked) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <RequireAuth>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </RequireAuth>
          } />
          <Route path="/chapters/:chapterId" element={
            <RequireAuth>
              <AppLayout>
                <ChapterPage />
              </AppLayout>
            </RequireAuth>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

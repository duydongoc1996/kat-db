import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BabyProvider } from './contexts/BabyContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import FormPage from './pages/FormPage';
import MetricsHistoryPage from './pages/MetricsHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BabyManagementPage from './pages/BabyManagementPage';
import './i18n/config';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BabyProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MetricsHistoryPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AnalyticsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/babies"
              element={
                <ProtectedRoute>
                  <Layout>
                    <BabyManagementPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BabyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

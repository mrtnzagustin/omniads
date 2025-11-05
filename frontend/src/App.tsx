import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Recommendations } from './pages/Recommendations';
import { Opportunities } from './pages/Opportunities';
import { BudgetRebalancer } from './pages/BudgetRebalancer';
import { AnomalyAlerts } from './pages/AnomalyAlerts';
import { CreativeWorkbench } from './pages/CreativeWorkbench';
import { WorkflowDashboard } from './pages/WorkflowDashboard';
import { WhatsAppCenter } from './pages/WhatsAppCenter';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget-rebalancer"
          element={
            <ProtectedRoute>
              <BudgetRebalancer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/anomaly-alerts"
          element={
            <ProtectedRoute>
              <AnomalyAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creative-workbench"
          element={
            <ProtectedRoute>
              <CreativeWorkbench />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow"
          element={
            <ProtectedRoute>
              <WorkflowDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/whatsapp"
          element={
            <ProtectedRoute>
              <WhatsAppCenter />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

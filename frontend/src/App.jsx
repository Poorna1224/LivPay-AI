import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ToastContainer from "./components/ToastContainer";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import WorkerDashboard from "./pages/WorkerDashboard";
import PolicyPage from "./pages/PolicyPage";
import ClaimsPage from "./pages/ClaimsPage";
import PaymentsPage from "./pages/PaymentsPage";
import AIRiskPage from "./pages/AIRiskPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTriggersPage from "./pages/AdminTriggersPage";
import AdminWorkersPage from "./pages/AdminWorkersPage";
import AdminAccessGate from "./components/AdminAccessGate";

function AdminRoute({ children }) {
  return <AdminAccessGate>{children}</AdminAccessGate>;
}

function AppRoutes() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/ai-risk" element={<AIRiskPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin-workers" element={<AdminRoute><AdminWorkersPage /></AdminRoute>} />
        <Route path="/admin-triggers" element={<AdminRoute><AdminTriggersPage /></AdminRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

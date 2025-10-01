import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { KioskLayout, AdminLayout } from './components/layouts';
import { ProtectedRoute, Login, Unauthorized } from './components/auth';
import {
  AdminDashboard,
  MISAdminDashboard,
  RegistrarAdminDashboard,
  AdmissionsAdminDashboard
} from './components/pages/admin';
import {
  Home,
  Bulletin,
  Map,
  Directory,
  Queue,
  FAQ,
  IdlePage,
  GridDemo,
  PortalQueue,
  SampleIdlePage
} from './components/pages';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Kiosk Routes - No Authentication Required */}
          <Route path="/" element={
            <KioskLayout>
              <Home />
            </KioskLayout>
          } />
          <Route path="/bulletin" element={
            <KioskLayout>
              <Bulletin />
            </KioskLayout>
          } />

          <Route path="/map" element={<Map />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/portalqueue" element={<PortalQueue />} />
          <Route path="/faq" element={
            <KioskLayout>
              <FAQ />
            </KioskLayout>
          } />
          <Route path="/grid-demo" element={<GridDemo />} />

          {/* Idle Page - No Layout Wrapper */}
          <Route path="/idle" element={<IdlePage />} />

          {/* Sample Idle Page - Experimental Design */}
          <Route path="/sample" element={<SampleIdlePage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes - Authentication Required */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['super_admin', 'registrar_admin', 'admissions_admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* MIS Super Admin Routes */}
          <Route path="/admin/mis" element={
            <ProtectedRoute requiredRoles={['super_admin']}>
              <AdminLayout>
                <MISAdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Registrar Admin Routes */}
          <Route path="/admin/registrar" element={
            <ProtectedRoute requiredRoles={['super_admin', 'registrar_admin']}>
              <AdminLayout>
                <RegistrarAdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Admissions Admin Routes */}
          <Route path="/admin/admissions" element={
            <ProtectedRoute requiredRoles={['super_admin', 'admissions_admin']}>
              <AdminLayout>
                <AdmissionsAdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Unauthorized Access */}
          <Route path="/admin/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

// HMR compatibility
if (import.meta.hot) {
  import.meta.hot.accept();
}
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner'; 
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NuevaCausaPage from './pages/NuevaCausaPage';
import DetalleCausaPage from './pages/DetalleCausaPage';
import AgendaPage from './pages/AgendaPage';
import PerfilPage from './pages/PerfilPage';
import Layout from './components/Layout';
import AyudaPage from './pages/AyudaPage'; 
import NotFoundPage from './pages/NotFoundPage';

// Componente de protección: Si hay token, deja pasar al "Outlet" (las rutas hijas)
const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      {/* Configuración global de Notificaciones Boutique 
          'richColors' les da el color según éxito/error
          'expand' permite ver varios mensajes apilados
      */}
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton 
        theme="light"
        expand={true}
      />

      <Routes>
        {/* Ruta Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas */}
        <Route element={<PrivateRoute />}>
          {/* El Layout envuelve a todas las páginas internas */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/causas/nueva" element={<NuevaCausaPage />} />
            <Route path="/causas/:id" element={<DetalleCausaPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/ayuda" element={<AyudaPage />} /> 
          </Route>
        </Route>

        {/* Captura de errores 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
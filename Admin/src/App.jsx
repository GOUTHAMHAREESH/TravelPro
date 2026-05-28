import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Country from './pages/Country';
import Brand from './pages/Brand';
import HotelType from './pages/HotelType';
import VehicleType from './pages/VehicleType';
import Destination from './pages/Destination';
import Customers from './pages/Customers';
import Journeys from './pages/Journeys';
import JourneyDetail from './pages/JourneyDetail';
import Driver from './pages/Driver';
import Vehicle from './pages/Vehicle';
import Hotel from './pages/Hotel';
import Agency from './pages/Agency';
import HotelBookings from './pages/HotelBookings';
import CabBookings from './pages/CabBookings';
import UserApprovals from './pages/UserApprovals';

function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Admin role required to access this panel.</p>
      </div>
    );
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/countries"
        element={
          <ProtectedRoute>
            <Layout><Country /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/brands"
        element={
          <ProtectedRoute>
            <Layout><Brand /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotel-types"
        element={
          <ProtectedRoute>
            <Layout><HotelType /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicle-types"
        element={
          <ProtectedRoute>
            <Layout><VehicleType /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/destinations"
        element={
          <ProtectedRoute>
            <Layout><Destination /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotels"
        element={
          <ProtectedRoute>
            <Layout><Hotel /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agencies"
        element={
          <ProtectedRoute>
            <Layout><Agency /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotel-bookings"
        element={
          <ProtectedRoute>
            <Layout><HotelBookings /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cab-bookings"
        element={
          <ProtectedRoute>
            <Layout><CabBookings /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-approvals"
        element={
          <ProtectedRoute>
            <Layout><UserApprovals /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Layout><Customers /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/journeys"
        element={
          <ProtectedRoute>
            <Layout><Journeys /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/journeys/:id"
        element={
          <ProtectedRoute>
            <Layout><JourneyDetail /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <Layout><Driver /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <Layout><Vehicle /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

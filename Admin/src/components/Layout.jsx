import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Travel Pro</h2>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="side-menu">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Home
          </NavLink>
          <NavLink to="/countries" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Countries
          </NavLink>
          <NavLink to="/brands" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Brands
          </NavLink>
          <NavLink to="/hotel-types" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Hotel Types
          </NavLink>
          <NavLink to="/vehicle-types" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Vehicle Types
          </NavLink>
          <NavLink to="/destinations" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Destinations
          </NavLink>
          <NavLink to="/hotels" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Hotels
          </NavLink>
          <NavLink to="/agencies" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Agencies
          </NavLink>
          <NavLink to="/hotel-bookings" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Hotel Bookings
          </NavLink>
          <NavLink to="/user-approvals" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            User Approvals
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Customers
          </NavLink>
          <NavLink to="/journeys" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Journeys
          </NavLink>
          <NavLink to="/drivers" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Drivers
          </NavLink>
          <NavLink to="/vehicles" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Vehicles
          </NavLink>
          <NavLink to="/cab-bookings" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            Cab Bookings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.UserName}</span>
            <span className="user-role">{user?.Role}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

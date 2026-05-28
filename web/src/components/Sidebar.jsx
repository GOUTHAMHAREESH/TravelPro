import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn, logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path
  const userRole = user?.Role || ''

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="toggle-icon">☰</span>
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>×</button>
        </div>
        <nav className="sidebar-menu">
          {/* Role-specific Dashboard Links */}
          {userRole === 'Customer' && (
            <Link 
              to="/customer-dashboard" 
              className={`sidebar-link ${isActive('/customer-dashboard') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-icon">🏠</span>
              <span>Dashboard</span>
            </Link>
          )}
          {userRole === 'Hotel' && (
            <Link 
              to="/hotel-dashboard" 
              className={`sidebar-link ${isActive('/hotel-dashboard') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-icon">🏠</span>
              <span>Dashboard</span>
            </Link>
          )}
          {userRole === 'Driver' && (
            <Link 
              to="/driver-dashboard" 
              className={`sidebar-link ${isActive('/driver-dashboard') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-icon">🏠</span>
              <span>Dashboard</span>
            </Link>
          )}

          {/* Customer-only menu items */}
          {userRole === 'Customer' && (
            <>
              <Link 
                to="/create-travel" 
                className={`sidebar-link ${isActive('/create-travel') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="sidebar-icon">✍️</span>
                <span>Create Travel</span>
              </Link>
              <Link 
                to="/my-travels" 
                className={`sidebar-link ${isActive('/my-travels') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="sidebar-icon">📖</span>
                <span>My Travels</span>
              </Link>
            </>
          )}

          {/* Profile - redirects to dashboard for Hotel/Driver */}
          {userRole === 'Customer' ? (
            <Link 
              to="/profile" 
              className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-icon">👤</span>
              <span>Profile</span>
            </Link>
          ) : (
            <div 
              className={`sidebar-link ${(userRole === 'Hotel' && isActive('/hotel-dashboard')) || (userRole === 'Driver' && isActive('/driver-dashboard')) ? 'active' : ''}`}
              onClick={() => {
                if (userRole === 'Hotel') {
                  navigate('/hotel-dashboard')
                } else if (userRole === 'Driver') {
                  navigate('/driver-dashboard')
                }
                setIsOpen(false)
              }}
            >
              <span className="sidebar-icon">👤</span>
              <span>Profile</span>
            </div>
          )}

          {/* Common menu items */}
          <Link 
            to="/find-travel" 
            className={`sidebar-link ${isActive('/find-travel') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="sidebar-icon">🔍</span>
            <span>Find Travel</span>
          </Link>

          {/* Hotels and Cabs - only for Customers */}
          {userRole === 'Customer' && (
            <>
              <div className="sidebar-divider"></div>
              <div 
                className={`sidebar-link ${isActive('/hotels') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/hotels', { state: { fromSidebar: true } })
                  setIsOpen(false)
                }}
              >
                <span className="sidebar-icon">🏨</span>
                <span>Hotels</span>
              </div>
              <div 
                className={`sidebar-link ${isActive('/cabs') ? 'active' : ''}`}
                onClick={() => {
                  navigate('/cabs', { state: { fromSidebar: true } })
                  setIsOpen(false)
                }}
              >
                <span className="sidebar-icon">🚗</span>
                <span>Cabs</span>
              </div>
            </>
          )}

          <div className="sidebar-divider"></div>
          <button 
            className="sidebar-link logout-btn" 
            onClick={handleLogout}
          >
            <span className="sidebar-icon">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}

export default Sidebar


import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user || user.Role !== 'Customer') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <h2>Access Denied</h2>
          <p>You need to be logged in as a Customer to access this page.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <p>Welcome back, {user.Name}!</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Profile Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{user.Name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.Email}</span>
            </div>
            <div className="info-item">
              <label>Mobile:</label>
              <span>{user.MobileNo}</span>
            </div>
            <div className="info-item">
              <label>Customer ID:</label>
              <span>{user.CustomerId}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/travels')} className="btn btn-secondary">
              Browse Travels
            </button>
            <button onClick={() => navigate('/hotels')} className="btn btn-secondary">
              Book Hotels
            </button>
            <button onClick={() => navigate('/cabs')} className="btn btn-secondary">
              Book Cabs
            </button>
            <button onClick={() => navigate('/profile')} className="btn btn-secondary">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard

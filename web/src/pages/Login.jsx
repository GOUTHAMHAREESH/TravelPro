import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const API_BASE_URL = 'http://localhost:61792'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        UserName: formData.userName,
        Password: formData.password
      }

      const response = await fetch(`${API_BASE_URL}/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const userData = await response.json()
        
        if (userData && userData.Role) {
          // Store user data and login
          login(userData)
          
          // Redirect based on role
          if (userData.Role === 'Customer') {
            navigate('/customer-dashboard')
          } else if (userData.Role === 'Hotel') {
            navigate('/hotel-dashboard')
          } else if (userData.Role === 'Driver') {
            navigate('/driver-dashboard')
          } else if (userData.Role === 'Agency') {
            navigate('/agency-dashboard')
          } else {
            // Default redirect if role doesn't match
            navigate('/')
          }
        } else {
          alert('Invalid credentials. Please try again.')
        }
      } else {
        const errData = await response.json().catch(() => ({}))
        const msg = errData?.Message || errData?.message
        if (response.status === 403 && msg) {
          alert(msg)
        } else {
          alert(msg || 'Login failed. Please check your credentials and try again.')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="page-header">
        <div className="container">
          <h1>Welcome Back</h1>
          <p>Sign in to your Travel Pro account</p>
        </div>
      </div>

      <div className="login-container">
        <div className="container">
          <div className="login-card">
            <div className="login-form-wrapper">
              <h2>Sign In</h2>
              <p className="login-subtitle">Enter your credentials to access your account</p>
              
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="userName">Username / Email</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username or email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <p className="signup-link">
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
              </form>
            </div>
            <div className="login-image">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" alt="Travel" />
              <div className="image-overlay">
                <h3>Start Your Journey</h3>
                <p>Explore amazing destinations and create unforgettable memories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


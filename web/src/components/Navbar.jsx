import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h1>Travel Pro</h1>
        </Link>
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/travels" 
            className={`nav-link ${isActive('/travels') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Travels
          </Link>
          <Link 
            to="/destinations" 
            className={`nav-link ${isActive('/destinations') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Destinations
          </Link>
          <Link 
            to="/hotels" 
            className={`nav-link ${isActive('/hotels') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Hotels
          </Link>
          <Link 
            to="/cabs" 
            className={`nav-link ${isActive('/cabs') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Cabs
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          {!isLoggedIn ? (
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          )}
        </div>
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

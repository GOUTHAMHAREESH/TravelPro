import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Travel Pro</h3>
          <p>Your journey begins here. Explore the world with us and create unforgettable memories.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/travels">Travels</Link></li>
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/cabs">Cabs</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: info@travelplus.com</p>
          <p>Phone: +1 234 567 8900</p>
          <p>Address: 123 Travel Street, Tourism City</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Travel Pro. All rights reserved. | Academic Project</p>
      </div>
    </footer>
  )
}

export default Footer

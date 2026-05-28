import React, { useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submittedData, setSubmittedData] = useState({ name: '', email: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Store submitted data before clearing
    setSubmittedData({
      name: formData.name,
      email: formData.email
    })
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Clear form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    
    // Show success message
    setShowSuccess(true)
    setSubmitting(false)
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 5000)
  }

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have a question or feedback? Fill out the form below and we'll get back to you 
                as soon as possible. We're here to help make your travel experience amazing!
              </p>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📧</div>
                  <h3>Email</h3>
                  <p>info@travelplus.com</p>
                  <p>support@travelplus.com</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <h3>Phone</h3>
                  <p>+1 234 567 8900</p>
                  <p>Mon-Fri: 9AM - 6PM</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <h3>Address</h3>
                  <p>123 Travel Street</p>
                  <p>Tourism City, TC 12345</p>
                </div>
              </div>

              <div className="social-links">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon">📘 Facebook</a>
                  <a href="#" className="social-icon">📷 Instagram</a>
                  <a href="#" className="social-icon">🐦 Twitter</a>
                  <a href="#" className="social-icon">💼 LinkedIn</a>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              {showSuccess && (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <div className="success-content">
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for contacting us, {submittedData.name}! We've received your message and will get back to you soon at {submittedData.email}.</p>
                  </div>
                  <button className="close-success" onClick={() => setShowSuccess(false)}>×</button>
                </div>
              )}
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send us a Message</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is your message about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Enter your message here..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact


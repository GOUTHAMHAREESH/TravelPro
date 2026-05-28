import React from 'react'
import { Link } from 'react-router-dom'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About Travel Plus</h1>
          <p>Your trusted travel companion</p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section intro-section">
          <div className="about-intro-content">
            <div className="about-intro-text">
              <h2>Welcome to Travel Pro</h2>
              <p>
                Travel Pro is a comprehensive travel platform designed to make your journey planning 
                and experiences seamless and memorable. We believe that every journey tells a story, 
                and we're here to help you create, document, and share those stories with the world.
              </p>
              <p>
                Our platform brings together everything you need for an amazing travel experience - 
                from discovering destinations and reading travel stories, to booking hotels and 
                transportation, all in one convenient place.
              </p>
            </div>
            <div className="about-intro-image">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" alt="Travel" />
            </div>
          </div>
        </section>

        <section className="about-section mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <div className="mission-content">
              <p>
                Our mission is to provide travelers with a one-stop solution for all their travel needs. 
                From discovering amazing destinations and reading travel stories, to booking hotels and 
                transportation, Travel Plus aims to simplify the entire travel experience.
              </p>
              <p>
                We strive to make travel accessible, enjoyable, and memorable for everyone, whether you're 
                a seasoned globetrotter or planning your first adventure.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-content">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">✈️</div>
                <h3>Travel Stories</h3>
                <p>
                  Read and share complete travel journeys documented from start to finish. 
                  Our platform allows travelers to record every moment of their adventure 
                  and publish it for others to discover and learn from.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h3>Destinations</h3>
                <p>
                  Explore the world's most beautiful and exciting destinations. Get detailed 
                  information about places, attractions, best times to visit, and more to 
                  help you plan your perfect trip.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏨</div>
                <h3>Hotels</h3>
                <p>
                  Find and book the perfect accommodation for your stay. Browse through a 
                  wide selection of hotels with detailed information, amenities, and easy 
                  booking options.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚗</div>
                <h3>Cab Services</h3>
                <p>
                  Book reliable transportation for your journey. Choose from a variety of 
                  vehicle options to suit your needs and budget, from economy cars to 
                  luxury SUVs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-content">
            <h2>Our Story</h2>
            <p>
              Travel Plus was born from a passion for travel and a desire to help people 
              experience the world more easily. We understand that planning a trip can be 
              overwhelming, and that's why we've created a platform that brings everything 
              you need together in one place.
            </p>
            <p>
              Whether you're a seasoned traveler or planning your first adventure, Travel Plus 
              is here to support you every step of the way. We're constantly working to improve 
              our platform and add new features to enhance your travel experience.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="section-content">
            <h2>Academic Project</h2>
            <p>
              Travel Plus is an academic project developed to demonstrate modern web development 
              practices and user experience design. This project showcases the use of React 
              framework for building dynamic and responsive web applications.
            </p>
            <p>
              Through this project, we aim to showcase how technology can be used to create 
              meaningful and user-friendly solutions for real-world problems in the travel industry.
            </p>
          </div>
        </section>

        <section className="contact-cta">
          <div className="section-content">
            <h2>Get in Touch</h2>
            <p>Have questions or suggestions? We'd love to hear from you!</p>
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About


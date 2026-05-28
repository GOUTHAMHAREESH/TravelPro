import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const API_BASE_URL = 'http://localhost:61792'

const Home = () => {
  const [latestTravels, setLatestTravels] = useState([])
  const [topDestinations, setTopDestinations] = useState([])
  const [loadingTravels, setLoadingTravels] = useState(true)
  const [loadingDestinations, setLoadingDestinations] = useState(true)

  useEffect(() => {
    fetchLatestTravels()
    fetchTopDestinations()
  }, [])

  const fetchLatestTravels = async () => {
    try {
      setLoadingTravels(true)
      const response = await fetch(`${API_BASE_URL}/JourneyList`)
      if (response.ok) {
        const data = await response.json()
        // Limit to max 3 travels
        setLatestTravels((data || []).slice(0, 3))
      } else {
        setLatestTravels([])
      }
    } catch (error) {
      console.error('Error fetching travels:', error)
      setLatestTravels([])
    } finally {
      setLoadingTravels(false)
    }
  }

  const fetchTopDestinations = async () => {
    try {
      setLoadingDestinations(true)
      const response = await fetch(`${API_BASE_URL}/DestinationList`)
      if (response.ok) {
        const data = await response.json()
        // Limit to max 4 destinations
        setTopDestinations((data || []).slice(0, 4))
      } else {
        setTopDestinations([])
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
      setTopDestinations([])
    } finally {
      setLoadingDestinations(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
    if (imagePath.startsWith('http')) return imagePath
    return `${API_BASE_URL}/${imagePath}`
  }

  return (
    <div className="home">
      {/* Banner Section */}
      <section className="banner">
        <div className="banner-content">
          <h1>Welcome to Travel Pro</h1>
          <p>Your Journey Begins Here</p>
          <p className="banner-subtitle">Explore the world, create memories, and share your adventures</p>
          <div className="banner-buttons">
            <Link to="/travels" className="btn btn-primary">Explore Travels</Link>
            <Link to="/destinations" className="btn btn-secondary">Discover Destinations</Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2>About Us</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Welcome to Travel Pro, your gateway to extraordinary journeys and unforgettable experiences. 
                We are passionate about travel and dedicated to helping you discover the world's most beautiful destinations.
              </p>
              <p>
                At Travel Pro, we believe that every journey tells a story. Our platform is designed to help travelers 
                share their adventures from start to finish - documenting every moment, every discovery, and every memory 
                along the way.
              </p>
              <p>
                Whether you're planning your next vacation, looking for the perfect hotel, or need reliable transportation, 
                Travel Pro has everything you need to make your travel dreams come true.
              </p>
              <Link to="/about" className="btn btn-primary">Learn More</Link>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" alt="Travel" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Travels Section */}
      <section className="latest-travels">
        <div className="container">
          <h2>Latest Travels</h2>
          <p className="section-subtitle">Discover amazing journeys documented from start to finish</p>
          {loadingTravels ? (
            <div className="loading-container">
              <p>Loading travels...</p>
            </div>
          ) : latestTravels.length === 0 ? (
            <div className="no-items">
              <p>No travels available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="travels-grid">
                {latestTravels.map(travel => (
                  <div key={travel.Id} className="travel-card">
                    <div className="travel-image">
                      <img 
                        src={getImageUrl(travel.Photo)} 
                        alt={travel.Title}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                        }}
                      />
                    </div>
                    <div className="travel-content">
                      <h3>{travel.Title}</h3>
                      {travel.Description && (
                        <p>{travel.Description.length > 100 ? travel.Description.substring(0, 100) + '...' : travel.Description}</p>
                      )}
                      <div className="travel-meta">
                        {travel.DateFrom && (
                          <span>📅 {formatDate(travel.DateFrom)}</span>
                        )}
                        {travel.NoOfDays && (
                          <span>⏱️ {travel.NoOfDays} {travel.NoOfDays === 1 ? 'day' : 'days'}</span>
                        )}
                        {travel.Customer && (
                          <span>✍️ By {travel.Customer.Name}</span>
                        )}
                      </div>
                      <Link to={`/travels/${travel.Id}`} className="btn btn-outline">Read More</Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="section-cta">
                <Link to="/travels" className="btn btn-primary">View All Travels</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Top Destinations Section */}
      <section className="top-destinations">
        <div className="container">
          <h2>Top Destinations</h2>
          <p className="section-subtitle">Explore the world's most popular travel destinations</p>
          {loadingDestinations ? (
            <div className="loading-container">
              <p>Loading destinations...</p>
            </div>
          ) : topDestinations.length === 0 ? (
            <div className="no-items">
              <p>No destinations available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="destinations-grid">
                {topDestinations.map(destination => (
                  <div key={destination.Id} className="destination-card">
                    <div className="destination-image">
                      <img 
                        src={getImageUrl(destination.Photo)} 
                        alt={destination.Name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                        }}
                      />
                      <div className="destination-overlay">
                        <h3>{destination.Name}</h3>
                        {destination.Description && (
                          <p>{destination.Description.length > 80 ? destination.Description.substring(0, 80) + '...' : destination.Description}</p>
                        )}
                        {destination.Country && (
                          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>📍 {destination.Country.Name}</p>
                        )}
                        <Link to="/destinations" className="btn btn-white">Explore</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="section-cta">
                <Link to="/destinations" className="btn btn-primary">View All Destinations</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick Options Section */}
      <section className="quick-options">
        <div className="container">
          <h2>Plan Your Trip</h2>
          <div className="options-grid">
            <Link to="/travels" className="option-card">
              <div className="option-icon">✈️</div>
              <h3>Travel Stories</h3>
              <p>Read amazing travel experiences from fellow travelers</p>
            </Link>
            <Link to="/destinations" className="option-card">
              <div className="option-icon">🌍</div>
              <h3>Destinations</h3>
              <p>Discover beautiful places around the world</p>
            </Link>
            <Link to="/hotels" className="option-card">
              <div className="option-icon">🏨</div>
              <h3>Hotels</h3>
              <p>Find and book the perfect accommodation</p>
            </Link>
            <Link to="/cabs" className="option-card">
              <div className="option-icon">🚗</div>
              <h3>Cabs</h3>
              <p>Book reliable transportation for your journey</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

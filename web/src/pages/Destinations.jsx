import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Destinations.css'

const API_BASE_URL = 'http://localhost:61792'

const Destinations = () => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/DestinationList`)
      if (response.ok) {
        const data = await response.json()
        setDestinations(data || [])
      } else {
        setError('Failed to load destinations')
      }
    } catch (err) {
      console.error('Error fetching destinations:', err)
      setError('An error occurred while loading destinations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="destinations-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading destinations...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="destinations-page">
        <div className="container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="destinations-page">
      <div className="page-header">
        <div className="container">
          <h1>Explore Destinations</h1>
          <p>Discover amazing places around the world</p>
        </div>
      </div>

      <div className="destinations-container">
        <div className="container">
          {destinations.length === 0 ? (
            <div className="no-destinations">
              <p>No destinations available at the moment.</p>
            </div>
          ) : (
            <div className="destinations-grid">
              {destinations.map(destination => (
                <div key={destination.Id} className="destination-card-full">
                  <div className="destination-image-container">
                    <img 
                      src={destination.Photo && destination.Photo.startsWith('http') 
                        ? destination.Photo 
                        : destination.Photo 
                          ? `${API_BASE_URL}/${destination.Photo}` 
                          : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} 
                      alt={destination.Name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                      }}
                    />
                    {destination.Country && (
                      <div className="destination-country-badge">
                        {destination.Country.Name}
                      </div>
                    )}
                  </div>
                  <div className="destination-content">
                    <h2>{destination.Name}</h2>
                    {destination.Description && (
                      <p className="destination-description">{destination.Description}</p>
                    )}
                    {destination.Country && (
                      <div className="destination-info">
                        <div className="info-item">
                          <strong>Country:</strong> {destination.Country.Name}
                        </div>
                      </div>
                    )}
                    <Link to={`/destinations/${destination.Id}`} className="btn btn-primary">
                      Explore More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Destinations

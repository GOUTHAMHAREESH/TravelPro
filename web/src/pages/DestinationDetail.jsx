import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './DestinationDetail.css'

const API_BASE_URL = 'http://localhost:61792'

const DestinationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [travels, setTravels] = useState([])
  const [loading, setLoading] = useState(true)
  const [travelsLoading, setTravelsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchDestinationDetails()
      fetchTravels()
    }
  }, [id])

  const fetchDestinationDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/GetDestinationById/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setDestination(data)
        } else {
          setError('Destination not found')
        }
      } else {
        setError('Failed to load destination')
      }
    } catch (err) {
      console.error('Error fetching destination detail:', err)
      setError('An error occurred while loading the destination')
    } finally {
      setLoading(false)
    }
  }

  const fetchTravels = async () => {
    try {
      setTravelsLoading(true)
      const response = await fetch(`${API_BASE_URL}/JourneyListByDestination/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTravels(data || [])
      } else {
        setTravels([])
      }
    } catch (err) {
      console.error('Error fetching travels:', err)
      setTravels([])
    } finally {
      setTravelsLoading(false)
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

  if (loading) {
    return (
      <div className="destination-detail-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading destination details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="destination-detail-page">
        <div className="container">
          <div className="error-container">
            <p>{error || 'Destination not found.'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/destinations')}>
              Back to Destinations
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="destination-detail-page">
      <div className="page-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/destinations')}>
            ← Back to Destinations
          </button>
          <h1>{destination.Name}</h1>
        </div>
      </div>

      <div className="destination-detail-container">
        <div className="container">
          {/* Destination Image and Info */}
          <div className="destination-hero-section">
            <div className="destination-hero-image">
              <img 
                src={getImageUrl(destination.Photo)} 
                alt={destination.Name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                }}
              />
            </div>
            <div className="destination-hero-info">
              <h2>{destination.Name}</h2>
              {destination.Description && (
                <p className="destination-description">{destination.Description}</p>
              )}
            </div>
          </div>

          {/* Travels Section */}
          <div className="travels-section">
            <h2>Travel Stories</h2>
            {travelsLoading ? (
              <div className="loading-container">
                <p>Loading travels...</p>
              </div>
            ) : travels.length === 0 ? (
              <div className="no-travels">
                <p>No travel stories available for this destination yet.</p>
              </div>
            ) : (
              <div className="travels-grid">
                {travels.map(travel => (
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
                      <Link to={`/travels/${travel.Id}`} className="btn btn-primary">
                        Read Full Story
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetail

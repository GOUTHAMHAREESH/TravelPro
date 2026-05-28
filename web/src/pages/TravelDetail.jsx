import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './TravelDetail.css'

const API_BASE_URL = 'http://localhost:61792'

const TravelDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [travel, setTravel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchTravelDetail()
    }
  }, [id])

  const fetchTravelDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/GetJourneyById/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setTravel(data)
        } else {
          setError('Travel story not found')
        }
      } else {
        setError('Failed to load travel story')
      }
    } catch (err) {
      console.error('Error fetching travel detail:', err)
      setError('An error occurred while loading the travel story')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="travel-detail-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading travel story...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !travel) {
    return (
      <div className="travel-detail-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error || 'Travel story not found'}</p>
            <Link to="/travels" className="btn btn-primary">Back to Travels</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="travel-detail-page">
      <div className="detail-header">
        <div className="detail-header-image">
          <img 
            src={travel.Photo && travel.Photo.startsWith('http') 
              ? travel.Photo 
              : travel.Photo 
                ? `${API_BASE_URL}/${travel.Photo}` 
                : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'} 
            alt={travel.Title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'
            }}
          />
          <div className="image-overlay-dark"></div>
          <div className="detail-header-content">
            <div className="container">
              <Link to="/travels" className="back-link">← Back to Travels</Link>
              <h1>{travel.Title}</h1>
              <div className="detail-meta">
                {travel.Customer && (
                  <div className="author-info">
                    <Link to={`/customer/${travel.Customer.Id}`} className="author-link">
                      ✍️ By {travel.Customer.Name}
                    </Link>
                  </div>
                )}
                <span>📅 {formatDate(travel.DateFrom)} - {formatDate(travel.DateTo)}</span>
                <span>⏱️ {travel.NoOfDays} {travel.NoOfDays === 1 ? 'day' : 'days'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="container">
          <div className="detail-main">
            {travel.Description && (
              <div className="detail-section">
                <h2>Description</h2>
                <p className="detail-description">{travel.Description}</p>
              </div>
            )}

            <div className="detail-section">
              <h2>Travel Information</h2>
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <strong>Start Date:</strong>
                  <span>{formatDate(travel.DateFrom)}</span>
                </div>
                <div className="info-item-detail">
                  <strong>End Date:</strong>
                  <span>{formatDate(travel.DateTo)}</span>
                </div>
                <div className="info-item-detail">
                  <strong>Duration:</strong>
                  <span>{travel.NoOfDays} {travel.NoOfDays === 1 ? 'day' : 'days'}</span>
                </div>
                {travel.Customer && (
                  <div className="info-item-detail">
                    <strong>Author:</strong>
                    <span>{travel.Customer.Name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <Link to={`/journey/${travel.Id}`} className="btn btn-primary">
                View Full Journey Details
              </Link>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="sidebar-card">
              <h3>Travel Information</h3>
              <div className="info-item">
                <strong>Duration:</strong>
                <span>{travel.NoOfDays} {travel.NoOfDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="info-item">
                <strong>Start Date:</strong>
                <span>{formatDate(travel.DateFrom)}</span>
              </div>
              <div className="info-item">
                <strong>End Date:</strong>
                <span>{formatDate(travel.DateTo)}</span>
              </div>
              {travel.Customer && (
                <div className="info-item">
                  <strong>Author:</strong>
                  <span>{travel.Customer.Name}</span>
                </div>
              )}
            </div>

            <div className="sidebar-card">
              <Link to="/hotels" className="btn btn-primary">Book Hotels</Link>
              <Link to="/cabs" className="btn btn-secondary">Book Transportation</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelDetail

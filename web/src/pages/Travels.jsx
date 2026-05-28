import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Travels.css'

const API_BASE_URL = 'http://localhost:61792'

const Travels = () => {
  const [travels, setTravels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTravels()
  }, [])

  const fetchTravels = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/JourneyList`)
      if (response.ok) {
        const data = await response.json()
        setTravels(data || [])
      } else {
        setError('Failed to load travels')
      }
    } catch (err) {
      console.error('Error fetching travels:', err)
      setError('An error occurred while loading travels')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="travels-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading travels...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="travels-page">
        <div className="container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="travels-page">
      <div className="page-header">
        <div className="container">
          <h1>Latest Travels</h1>
          <p>Explore amazing journeys documented from start to finish</p>
          <p className="header-description">
            Travels are personal journeys where travelers record their experiences from the beginning 
            to the end and share them with the world. Discover real adventures, tips, and stories from fellow travelers.
          </p>
        </div>
      </div>

      <div className="travels-container">
        <div className="container">
          {travels.length === 0 ? (
            <div className="no-travels">
              <p>No travels available at the moment.</p>
            </div>
          ) : (
            <div className="travels-grid">
              {travels.map(travel => (
                <div key={travel.Id} className="travel-card-full">
                  <div className="travel-card-image">
                    <img 
                      src={travel.Photo && travel.Photo.startsWith('http') 
                        ? travel.Photo 
                        : travel.Photo 
                          ? `${API_BASE_URL}/${travel.Photo}` 
                          : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} 
                      alt={travel.Title}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                      }}
                    />
                    <div className="travel-badge">Travel Story</div>
                  </div>
                  <div className="travel-card-body">
                    <div className="travel-header">
                      <h2>{travel.Title}</h2>
                    </div>
                    <div className="travel-meta-info">
                      <span>📅 {formatDate(travel.DateFrom)} - {formatDate(travel.DateTo)}</span>
                      <span>⏱️ {travel.NoOfDays} {travel.NoOfDays === 1 ? 'day' : 'days'}</span>
                      {travel.Customer && <span>✍️ By {travel.Customer.Name}</span>}
                    </div>
                    <Link to={`/travels/${travel.Id}`} className="btn btn-primary">Read Full Story</Link>
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

export default Travels

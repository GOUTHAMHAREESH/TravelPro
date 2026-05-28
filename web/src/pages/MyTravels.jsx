import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './MyTravels.css'

const API_BASE_URL = 'http://localhost:61792'

const MyTravels = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login')
      return
    }
    if (user.Role !== 'Customer') {
      alert('Only customers can view their journeys.')
      navigate('/')
      return
    }
  }, [isLoggedIn, user, navigate])

  useEffect(() => {
    if (user && user.CustomerId) {
      fetchJourneys()
    }
  }, [user])

  const fetchJourneys = async () => {
    if (!user || !user.CustomerId) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/JourneyListByCustomer/${user.CustomerId}`)
      
      if (response.ok) {
        const data = await response.json()
        setJourneys(data || [])
      } else {
        console.error('Failed to fetch journeys')
        setJourneys([])
      }
    } catch (error) {
      console.error('Error fetching journeys:', error)
      setJourneys([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="my-travels-page">
      <div className="page-header">
        <div className="container">
          <h1>My Travel Journeys</h1>
          <p>Manage and view all your travel experiences</p>
        </div>
      </div>

      <div className="my-travels-container">
        <div className="container">
          <div className="section-header">
            <h2>My Journeys</h2>
            {isLoggedIn && user?.Role === 'Customer' && (
              <Link to="/create-travel" className="btn btn-primary">
                + Create New Journey
              </Link>
            )}
          </div>

          {loading ? (
            <div className="loading-container">
              <p>Loading your journeys...</p>
            </div>
          ) : journeys.length > 0 ? (
            <div className="my-travels-grid">
              {journeys.map(journey => (
                <div key={journey.Id} className="my-travel-card">
                  <div className="travel-image">
                    {journey.Photo ? (
                      <img 
                        src={journey.Photo.startsWith('http') ? journey.Photo : `${API_BASE_URL}/${journey.Photo}`}
                        alt={journey.Title}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                        }}
                      />
                    ) : (
                      <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" alt={journey.Title} />
                    )}
                  </div>
                  <div className="travel-info">
                    <h3>{journey.Title}</h3>
                    <div className="travel-stats">
                      <span>📅 {formatDate(journey.DateFrom)}</span>
                      <span>⏱️ {journey.NoOfDays} day(s)</span>
                      {journey.DateTo && (
                        <span>➡️ {formatDate(journey.DateTo)}</span>
                      )}
                    </div>
                    <div className="travel-actions">
                      <Link to={`/journey/${journey.Id}`} className="btn btn-outline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-travels">
              <p>You haven't created any journeys yet.</p>
              {isLoggedIn && user?.Role === 'Customer' && (
                <Link to="/create-travel" className="btn btn-primary">
                  Create Your First Journey
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTravels

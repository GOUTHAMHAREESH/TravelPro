import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './CustomerProfile.css'

const API_BASE_URL = 'http://localhost:61792'

const CustomerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [hotelReviews, setHotelReviews] = useState([])
  const [cabReviews, setCabReviews] = useState([])
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchCustomer()
      fetchHotelReviews()
      fetchCabReviews()
      fetchJourneys()
    }
  }, [id])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/CustomerById/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCustomer(data)
      } else {
        setCustomer(null)
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchHotelReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/HotelBookingListByCustomer/${id}`)
      if (response.ok) {
        const data = await response.json()
        const withReview = (data || []).filter(x => (x.Rating || 0) > 0)
        setHotelReviews(withReview)
      }
    } catch (error) {
      console.error('Error fetching hotel reviews:', error)
    }
  }

  const fetchCabReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/CabBookingByCustomerId/${id}`)
      if (response.ok) {
        const data = await response.json()
        const withReview = (data || []).filter(x => (x.Rating || 0) > 0)
        setCabReviews(withReview)
      }
    } catch (error) {
      console.error('Error fetching cab reviews:', error)
    }
  }

  const fetchJourneys = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/JourneyListByCustomer/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJourneys(data || [])
      }
    } catch (error) {
      console.error('Error fetching journeys:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="customer-profile-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="customer-profile-page">
        <div className="container">
          <div className="error-container">
            <p>Customer not found.</p>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const allReviews = hotelReviews.length + cabReviews.length

  return (
    <div className="customer-profile-page">
      <div className="profile-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>

      <div className="profile-card-wrapper">
        <div className="profile-card">
          <div className="profile-card-inner">
            <div className="profile-avatar">
              {customer.Name ? customer.Name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="profile-info">
              <h1>{customer.Name || 'Traveler'}</h1>
              <div className="profile-contact">
                {customer.EmailId && (
                  <div className="contact-item">
                    <span className="contact-icon">✉</span>
                    <span>{customer.EmailId}</span>
                  </div>
                )}
                {customer.MobileNo && (
                  <div className="contact-item">
                    <span className="contact-icon">📱</span>
                    <span>{customer.MobileNo}</span>
                  </div>
                )}
                {customer.Location && (
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span>{customer.Location}</span>
                  </div>
                )}
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{journeys.length}</span>
                  <span className="stat-label">Journeys</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-value">{allReviews}</span>
                  <span className="stat-label">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content container">
        {/* Journeys Section */}
        {journeys.length > 0 && (
          <section className="profile-section">
            <h2>Journeys</h2>
            <div className="journeys-grid">
              {journeys.map(journey => (
                <div
                  key={journey.Id}
                  className="journey-card"
                  onClick={() => navigate(`/journey/${journey.Id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/journey/${journey.Id}`)}
                >
                  {journey.Photo && (
                    <img
                      src={journey.Photo.startsWith('http') ? journey.Photo : `${API_BASE_URL}/${journey.Photo}`}
                      alt={journey.Title}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
                      }}
                    />
                  )}
                  <div className="journey-info">
                    <h3>{journey.Title}</h3>
                    <p className="journey-dates">
                      {formatDate(journey.DateFrom)} – {formatDate(journey.DateTo)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hotel Reviews Section */}
        {hotelReviews.length > 0 && (
          <section className="profile-section">
            <h2>Hotel Reviews</h2>
            <div className="reviews-list">
              {hotelReviews.map(review => (
                <div
                  key={review.Id}
                  className="review-card"
                  onClick={() => review.Hotel?.Id && navigate(`/hotels/${review.Hotel.Id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && review.Hotel?.Id && navigate(`/hotels/${review.Hotel.Id}`)}
                >
                  <div className="review-header">
                    <span className="review-target">{review.Hotel?.Name || 'Hotel'}</span>
                    {review.Rating > 0 && (
                      <span className="review-rating">{'⭐'.repeat(review.Rating)}</span>
                    )}
                  </div>
                  {review.Review && <p className="review-text">{review.Review}</p>}
                  {(review.FromDate || review.ToDate) && (
                    <p className="review-date">
                      Stayed: {review.FromDate ? formatDate(review.FromDate) : ''}
                      {review.ToDate ? ` – ${formatDate(review.ToDate)}` : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cab Reviews Section */}
        {cabReviews.length > 0 && (
          <section className="profile-section">
            <h2>Cab Reviews</h2>
            <div className="reviews-list">
              {cabReviews.map(review => (
                <div key={review.Id} className="review-card">
                  <div className="review-header">
                    <span className="review-target">
                      {review.Vehicle?.Model || 'Cab'} {review.Driver && `• ${review.Driver.Name}`}
                    </span>
                    {review.Rating > 0 && (
                      <span className="review-rating">{'⭐'.repeat(review.Rating)}</span>
                    )}
                  </div>
                  {review.Review && <p className="review-text">{review.Review}</p>}
                  {review.Date && (
                    <p className="review-date">{formatDate(review.Date)}</p>
                  )}
                  {review.Destination && (
                    <p className="review-destination">📍 {review.Destination.Name}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {journeys.length === 0 && hotelReviews.length === 0 && cabReviews.length === 0 && (
          <section className="profile-section">
            <p className="no-content">No journeys or reviews yet.</p>
          </section>
        )}
      </div>
    </div>
  )
}

export default CustomerProfile

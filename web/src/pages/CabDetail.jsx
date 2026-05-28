import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Cabs.css'

const API_BASE_URL = 'http://localhost:61792'

const CabDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [vehicle, setVehicle] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchVehicle()
      fetchReviews()
    }
  }, [id])

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/VehicleList`)
      if (response.ok) {
        const data = await response.json()
        const veh = (data || []).find(v => String(v.Id) === String(id))
        setVehicle(veh || null)
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/CabBookingList`)
      if (response.ok) {
        const data = await response.json()
        const filtered = (data || []).filter(x => x.VehicleId === parseInt(id) && (x.Rating || 0) > 0)
        setReviews(filtered)
      }
    } catch (error) {
      console.error('Error fetching cab reviews:', error)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
    if (imagePath.startsWith('http')) return imagePath
    return `${API_BASE_URL}/${imagePath}`
  }

  const getVehicleFeatures = (veh) => {
    const features = []
    if (veh.AC) features.push('AC')
    if (veh.GPS) features.push('GPS')
    if (veh.Bluetooth) features.push('Bluetooth')
    if (veh.Wifi) features.push('Wi-Fi')
    if (veh.MusicSystem) features.push('Music System')
    if (veh.Camera) features.push('Camera')
    if (veh.Sensors) features.push('Sensors')
    if (veh.LCD) features.push('LCD')
    if (veh.Safety) features.push('Safety Features')
    if (veh.Luggage) features.push('Luggage Space')
    return features
  }

  if (loading) {
    return (
      <div className="cabs-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading cab details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="cabs-page">
        <div className="container">
          <div className="error-container">
            <p>Cab not found.</p>
            <button className="btn btn-primary" onClick={() => navigate('/cabs')}>
              Back to Cabs
            </button>
          </div>
        </div>
      </div>
    )
  }

  const features = getVehicleFeatures(vehicle)

  return (
    <div className="cabs-page">
      <div className="page-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/cabs')}>
            ← Back to Cabs
          </button>
          <h1>{vehicle.Model}</h1>
          {vehicle.Brand && (
            <p className="cab-driver">Brand: {vehicle.Brand.Name}</p>
          )}
        </div>
      </div>

      <div className="cabs-container">
        <div className="container">
          <div className="cab-detail-layout">
            <div className="cab-detail-main">
              <div className="cab-image large">
                <img
                  src={getImageUrl(vehicle.Image1)}
                  alt={vehicle.Model}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
                  }}
                />
              </div>
              <div className="cab-specs">
                {vehicle.NoOfSeat > 0 && (
                  <div className="spec-item">
                    <span className="spec-icon">👥</span>
                    <span>{vehicle.NoOfSeat} Seats</span>
                  </div>
                )}
                {vehicle.FuelType && (
                  <div className="spec-item">
                    <span className="spec-icon">⛽</span>
                    <span>{vehicle.FuelType}</span>
                  </div>
                )}
                {vehicle.Transmission && (
                  <div className="spec-item">
                    <span className="spec-icon">⚙️</span>
                    <span>{vehicle.Transmission}</span>
                  </div>
                )}
                {vehicle.Color && (
                  <div className="spec-item">
                    <span className="spec-icon">🎨</span>
                    <span>{vehicle.Color}</span>
                  </div>
                )}
                {vehicle.Milage && (
                  <div className="spec-item">
                    <span className="spec-icon">📏</span>
                    <span>Mileage: {vehicle.Milage}</span>
                  </div>
                )}
              </div>
              {features.length > 0 && (
                <div className="cab-features">
                  <h3>Features</h3>
                  <div className="feature-tags">
                    {features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="cab-detail-sidebar">
              <div className="cab-price-card">
                <h3>Fare Details</h3>
                <p className="price">
                  ₹{vehicle.Rate || 0}
                  <span className="price-label"> / km</span>
                </p>
                {vehicle.Driver && (
                  <p className="cab-driver">
                    Driver: {vehicle.Driver.Name} ({vehicle.Driver.MobileNo})
                  </p>
                )}
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => navigate('/cabs')}
                >
                  Book this Cab
                </button>
              </div>

              {reviews.length > 0 && (
                <div className="reviews-section">
                  <h3>Recent Reviews</h3>
                  <div className="reviews-list">
                    {reviews.map(review => (
                      <div key={review.Id} className="review-card">
                        <div className="review-header">
                          <span className="reviewer-name">{review.Customer?.Name || 'Passenger'}</span>
                          {review.Rating > 0 && (
                            <span className="review-rating">{'⭐'.repeat(review.Rating)}</span>
                          )}
                        </div>
                        {review.Review && (
                          <p className="review-text">{review.Review}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CabDetail


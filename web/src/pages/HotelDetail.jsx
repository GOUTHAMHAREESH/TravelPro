import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HotelDetail.css'

const API_BASE_URL = 'http://localhost:61792'

const HotelDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn } = useAuth()
  const filterDates = location.state?.fromDate && location.state?.toDate
    ? { fromDate: location.state.fromDate, toDate: location.state.toDate }
    : null
  const [hotel, setHotel] = useState(null)
  const [highlights, setHighlights] = useState([])
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [journeysAtHotel, setJourneysAtHotel] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    checkIn: '',
    checkOut: '',
    adults: 1,
    kids: 0,
    journeyId: '',
    journeyDetailId: ''
  })
  const [customerJourneys, setCustomerJourneys] = useState([])
  const [journeyDetails, setJourneyDetails] = useState([])

  useEffect(() => {
    if (id) {
      fetchHotelDetails()
      fetchHighlights()
      fetchRooms()
      fetchReviews()
      fetchJourneysAtHotel()
    }
  }, [id])

  const fetchHotelDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/HotelById?id=${id}`)
      if (response.ok) {
        const data = await response.json()
        setHotel(data)
      } else {
        console.error('Failed to fetch hotel details')
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHighlights = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/HotelHighlightList/${id}`)
      if (response.ok) {
        const data = await response.json()
        setHighlights(data || [])
      }
    } catch (error) {
      console.error('Error fetching highlights:', error)
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/HotelRoomList/${id}`)
      if (response.ok) {
        const data = await response.json()
        setRooms(data || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/HotelBookingListByHotel/${id}`)
      if (response.ok) {
        const data = await response.json()
        const withReview = (data || []).filter(x => (x.Rating || 0) > 0)
        setReviews(withReview)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchJourneysAtHotel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/JourneyHotelListByHotel/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJourneysAtHotel(data || [])
      }
    } catch (error) {
      console.error('Error fetching journeys at hotel:', error)
    }
  }

  const fetchCustomerJourneys = async () => {
    if (!user?.CustomerId) return
    try {
      const response = await fetch(`${API_BASE_URL}/JourneyListByCustomer/${user.CustomerId}`)
      if (response.ok) {
        const data = await response.json()
        setCustomerJourneys(data || [])
      }
    } catch (error) {
      console.error('Error fetching journeys:', error)
    }
  }

  const fetchJourneyDetails = async (journeyId) => {
    if (!journeyId) {
      setJourneyDetails([])
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/JourneyDetailList/${journeyId}`)
      if (response.ok) {
        const data = await response.json()
        setJourneyDetails(data || [])
      }
    } catch (error) {
      setJourneyDetails([])
    }
  }

  const handleBookRoom = (room) => {
    if (!isLoggedIn || user?.Role !== 'Customer') {
      alert('Please login as a Customer to book a hotel.')
      return
    }
    setSelectedRoom(room)
    setShowBookingForm(true)
    setBookingForm({
      checkIn: filterDates?.fromDate || '',
      checkOut: filterDates?.toDate || '',
      adults: room.Adults || 1,
      kids: 0,
      journeyId: '',
      journeyDetailId: ''
    })
    fetchCustomerJourneys()
    setJourneyDetails([])
  }

  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getTodayDate = () => new Date().toISOString().split('T')[0]

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    
    if (!isLoggedIn || user?.Role !== 'Customer' || !user?.CustomerId) {
      alert('Please login as a Customer to book a hotel.')
      return
    }

    if (!selectedRoom || !hotel) return

    const todayStr = getTodayDate()
    if (bookingForm.checkIn < todayStr || bookingForm.checkOut < todayStr) {
      alert('Past dates are not allowed. Please select current or future dates.')
      return
    }

    setSaving(true)
    try {
      const totalDays = calculateDays(bookingForm.checkIn, bookingForm.checkOut)
      if (totalDays === 0) {
        alert('Please select valid check-in and check-out dates.')
        setSaving(false)
        return
      }

      const totalAmount = totalDays * selectedRoom.Cost

      const payload = {
        Id: 0,
        HotelId: hotel.Id,
        HotelRoomId: selectedRoom.Id,
        CustomerId: user.CustomerId,
        FromDate: bookingForm.checkIn,
        ToDate: bookingForm.checkOut,
        Date: bookingForm.checkIn,
        TotalDays: totalDays,
        Adults: parseInt(bookingForm.adults),
        Kids: parseInt(bookingForm.kids) || 0,
        Total: totalAmount,
        Rating: 0,
        Review: '',
        Status: 'Pending',
        JourneyId: bookingForm.journeyId ? parseInt(bookingForm.journeyId) : null,
        JourneyDetailId: bookingForm.journeyDetailId ? parseInt(bookingForm.journeyDetailId) : null
      }

      const response = await fetch(`${API_BASE_URL}/AddHotelBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Hotel booking confirmed successfully!')
          setShowBookingForm(false)
          setSelectedRoom(null)
          navigate('/hotels')
        } else {
          alert('Failed to confirm booking. Please try again.')
        }
      } else {
        const errorText = await response.text()
        alert(errorText || 'Failed to confirm booking. Please try again.')
      }
    } catch (error) {
      console.error('Error booking hotel:', error)
      alert('An error occurred while booking. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    if (imagePath.startsWith('http')) return imagePath
    return `${API_BASE_URL}/${imagePath}`
  }

  const groupHighlightsByType = () => {
    const grouped = {
      Facility: [],
      Inclusion: [],
      Exclusion: []
    }
    highlights.forEach(highlight => {
      const type = highlight.Type || 'Facility'
      if (grouped[type]) {
        grouped[type].push(highlight)
      } else {
        grouped.Facility.push(highlight)
      }
    })
    return grouped
  }

  if (loading) {
    return (
      <div className="hotel-detail-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading hotel details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-page">
        <div className="container">
          <div className="error-container">
            <p>Hotel not found.</p>
            <button className="btn btn-primary" onClick={() => navigate('/hotels')}>
              Back to Hotels
            </button>
          </div>
        </div>
      </div>
    )
  }

  const groupedHighlights = groupHighlightsByType()

  return (
    <div className="hotel-detail-page">
      <div className="page-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/hotels')}>
            ← Back to Hotels
          </button>
          <h1>{hotel.Name}</h1>
          {hotel.Destination && (
            <p className="hotel-location-header">📍 {hotel.Destination.Name}</p>
          )}
        </div>
      </div>

      <div className="hotel-detail-container">
        <div className="container">
          {/* Hotel Images Gallery */}
          <div className="hotel-images-section">
            <div className="main-image">
              <img 
                src={getImageUrl(hotel.Image1)} 
                alt={hotel.Name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
                }}
              />
            </div>
            {hotel.Image2 && (
              <div className="thumbnail-images">
                {[hotel.Image2, hotel.Image3, hotel.Image4, hotel.Image5].filter(Boolean).map((img, idx) => (
                  <img 
                    key={idx}
                    src={getImageUrl(img)} 
                    alt={`${hotel.Name} ${idx + 2}`}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Hotel Info Section */}
          <div className="hotel-info-section">
            <div className="hotel-header-info">
              <div className="hotel-title-section">
                <h2>{hotel.Name}</h2>
                {hotel.StarRating > 0 && (
                  <div className="star-rating">
                    {'⭐'.repeat(hotel.StarRating)}
                  </div>
                )}
                {hotel.AvgRating > 0 && (
                  <div className="avg-rating">
                    Average Rating: ⭐ {hotel.AvgRating.toFixed(1)}
                  </div>
                )}
              </div>
              {hotel.HotelType && (
                <div className="hotel-type-badge">{hotel.HotelType.Name}</div>
              )}
            </div>

            <div className="hotel-details-grid">
              {hotel.Location && (
                <div className="detail-item">
                  <strong>Location:</strong> {hotel.Location}
                </div>
              )}
              {hotel.Address && (
                <div className="detail-item">
                  <strong>Address:</strong> {hotel.Address}
                </div>
              )}
              {hotel.Email && (
                <div className="detail-item">
                  <strong>Email:</strong> {hotel.Email}
                </div>
              )}
              {hotel.MobileNo && (
                <div className="detail-item">
                  <strong>Contact:</strong> {hotel.MobileNo}
                </div>
              )}
              {hotel.CostPerDay > 0 && (
                <div className="detail-item">
                  <strong>Starting from:</strong> ₹{hotel.CostPerDay} per day
                </div>
              )}
            </div>
          </div>

          {/* Highlights Section */}
          {(groupedHighlights.Facility.length > 0 || 
            groupedHighlights.Inclusion.length > 0 || 
            groupedHighlights.Exclusion.length > 0) && (
            <div className="highlights-section">
              <h3>Highlights</h3>
              
              {groupedHighlights.Facility.length > 0 && (
                <div className="highlight-group">
                  <h4>Facilities</h4>
                  <ul className="highlight-list">
                    {groupedHighlights.Facility.map(highlight => (
                      <li key={highlight.Id}>{highlight.Description}</li>
                    ))}
                  </ul>
                </div>
              )}

              {groupedHighlights.Inclusion.length > 0 && (
                <div className="highlight-group">
                  <h4>Inclusions</h4>
                  <ul className="highlight-list">
                    {groupedHighlights.Inclusion.map(highlight => (
                      <li key={highlight.Id}>{highlight.Description}</li>
                    ))}
                  </ul>
                </div>
              )}

              {groupedHighlights.Exclusion.length > 0 && (
                <div className="highlight-group">
                  <h4>Exclusions</h4>
                  <ul className="highlight-list">
                    {groupedHighlights.Exclusion.map(highlight => (
                      <li key={highlight.Id}>{highlight.Description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="reviews-section">
              <h3>Guest Reviews</h3>
              <div className="reviews-list">
                {reviews.map(review => (
                  <div
                    key={review.Id}
                    className="review-card"
                    onClick={() => review.Customer?.Id && navigate(`/customer/${review.Customer.Id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && review.Customer?.Id && navigate(`/customer/${review.Customer.Id}`)}
                  >
                    <div className="review-header">
                      <span className="reviewer-name">{review.Customer?.Name || 'Guest'}</span>
                      {review.Rating > 0 && (
                        <span className="review-rating">{'⭐'.repeat(review.Rating)}</span>
                      )}
                    </div>
                    {review.Review && <p className="review-text">{review.Review}</p>}
                    {(review.FromDate || review.ToDate) && (
                      <p className="review-date">
                        Stayed: {review.FromDate ? new Date(review.FromDate).toLocaleDateString() : ''}
                        {review.ToDate ? ` – ${new Date(review.ToDate).toLocaleDateString()}` : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Journeys Section */}
          {journeysAtHotel.length > 0 && (
            <div className="journeys-section">
              <h3>Journeys at this Hotel</h3>
              <p className="section-subtitle">Trips that included a stay at this hotel</p>
              <div className="journeys-list">
                {journeysAtHotel.map(jh => (
                  <div
                    key={jh.Id}
                    className="journey-card"
                    onClick={() => jh.Journey?.Id && navigate(`/journey/${jh.Journey.Id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && jh.Journey?.Id && navigate(`/journey/${jh.Journey.Id}`)}
                  >
                    <div className="journey-card-thumb">
                      <img
                        src={jh.Journey?.Photo ? getImageUrl(jh.Journey.Photo) : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                        alt={jh.Journey?.Title}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400' }}
                      />
                      <div className="journey-card-overlay" />
                    </div>
                    <div className="journey-card-body">
                      {jh.JourneyDetail && (
                        <span className="journey-day-badge">Day {jh.JourneyDetail.Day}</span>
                      )}
                      <h4>{jh.Journey?.Title || 'Journey'}</h4>
                      {jh.JourneyDetail?.Title && (
                        <p className="journey-day-title">{jh.JourneyDetail.Title}</p>
                      )}
                      {jh.Destination && (
                        <p className="journey-destination">📍 {jh.Destination.Name}</p>
                      )}
                      {jh.Journey?.Customer && (
                        <p className="journey-customer">by {jh.Journey.Customer.Name}</p>
                      )}
                      <span className="journey-card-link">View journey →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms Section */}
          <div className="rooms-section">
            <h3>Available Rooms</h3>
            {rooms.length === 0 ? (
              <p className="no-rooms">No rooms available at the moment.</p>
            ) : (
              <div className="rooms-grid">
                {rooms.map(room => (
                  <div key={room.Id} className="room-card">
                    <div className="room-images">
                      {room.Image1 && (
                        <img 
                          src={getImageUrl(room.Image1)} 
                          alt={room.Title}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
                          }}
                        />
                      )}
                    </div>
                    <div className="room-content">
                      <h4>{room.Title}</h4>
                      {room.Description && (
                        <p className="room-description">{room.Description}</p>
                      )}
                      <div className="room-specs">
                        <div className="spec-item">
                          <strong>Capacity:</strong> {room.Adults} Adult(s), {room.Kids} Kid(s)
                        </div>
                        <div className="spec-item">
                          <strong>Cost:</strong> ₹{room.Cost} per night
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleBookRoom(room)}
                        disabled={!isLoggedIn || user?.Role !== 'Customer'}
                        title={!isLoggedIn || user?.Role !== 'Customer' ? 'Please login as Customer to book' : ''}
                      >
                        {!isLoggedIn || user?.Role !== 'Customer' ? 'Login to Book' : 'Book This Room'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Modal */}
          {showBookingForm && selectedRoom && (
            <div className="booking-modal-overlay" onClick={() => setShowBookingForm(false)}>
              <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setShowBookingForm(false)}>×</button>
                <h2>Book {selectedRoom.Title}</h2>
                <form onSubmit={handleBookingSubmit} className="booking-form">
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input
                      type="date"
                      value={bookingForm.checkIn}
                      onChange={(e) => setBookingForm({...bookingForm, checkIn: e.target.value})}
                      min={getTodayDate()}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <input
                      type="date"
                      value={bookingForm.checkOut}
                      onChange={(e) => setBookingForm({...bookingForm, checkOut: e.target.value})}
                      min={bookingForm.checkIn || getTodayDate()}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Number of Adults *</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedRoom.Adults}
                      value={bookingForm.adults}
                      onChange={(e) => setBookingForm({...bookingForm, adults: parseInt(e.target.value) || 1})}
                      required
                    />
                    <small>Maximum: {selectedRoom.Adults} adult(s)</small>
                  </div>
                  <div className="form-group">
                    <label>Number of Kids</label>
                    <input
                      type="number"
                      min="0"
                      max={selectedRoom.Kids}
                      value={bookingForm.kids}
                      onChange={(e) => setBookingForm({...bookingForm, kids: parseInt(e.target.value) || 0})}
                    />
                    <small>Maximum: {selectedRoom.Kids} kid(s)</small>
                  </div>
                  {customerJourneys.length > 0 && (
                    <>
                      <div className="form-group">
                        <label>Attach to Journey (Optional)</label>
                        <select
                          value={bookingForm.journeyId}
                          onChange={(e) => {
                            const val = e.target.value
                            setBookingForm({...bookingForm, journeyId: val, journeyDetailId: ''})
                            fetchJourneyDetails(val || null)
                          }}
                        >
                          <option value="">None</option>
                          {customerJourneys.map(j => (
                            <option key={j.Id} value={j.Id}>{j.Title}</option>
                          ))}
                        </select>
                      </div>
                      {bookingForm.journeyId && journeyDetails.length > 0 && (
                        <div className="form-group">
                          <label>Journey Day</label>
                          <select
                            value={bookingForm.journeyDetailId}
                            onChange={(e) => setBookingForm({...bookingForm, journeyDetailId: e.target.value})}
                          >
                            <option value="">Select day</option>
                            {journeyDetails.map(d => (
                              <option key={d.Id} value={d.Id}>
                                Day {d.Day}: {d.Title}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </>
                  )}
                  <div className="booking-summary">
                    <p>Room: <strong>{selectedRoom.Title}</strong></p>
                    <p>Room Cost: <strong>₹{selectedRoom.Cost}</strong> per night</p>
                    {bookingForm.checkIn && bookingForm.checkOut && (() => {
                      const totalDays = calculateDays(bookingForm.checkIn, bookingForm.checkOut)
                      const totalAmount = totalDays * selectedRoom.Cost
                      return totalDays > 0 ? (
                        <>
                          <p>Duration: <strong>{totalDays} day(s)</strong></p>
                          <p className="total-price">
                            Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong>
                          </p>
                        </>
                      ) : null
                    })()}
                  </div>
                  <button type="submit" className="btn btn-primary btn-large" disabled={saving}>
                    {saving ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HotelDetail

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import './Hotels.css'

const API_BASE_URL = 'http://localhost:61792'

const Hotels = () => {
  const { user, isLoggedIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isFromSidebar = location.state?.fromSidebar === true
  const [hotels, setHotels] = useState([])
  const [hotelBookings, setHotelBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingReview, setSavingReview] = useState(false)
  const [hotelsLoading, setHotelsLoading] = useState(true)
  const [destinations, setDestinations] = useState([])
  const [hotelTypes, setHotelTypes] = useState([])
  const [filters, setFilters] = useState({
    destinationId: '',
    hotelTypeId: '',
    searchText: '',
    starRating: '',
    minCost: '',
    maxCost: '',
    fromDate: '',
    toDate: ''
  })
  const [showBookings, setShowBookings] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review: ''
  })

  useEffect(() => {
    fetchDestinations()
    fetchHotelTypes()
    if (isLoggedIn && user?.Role === 'Customer' && user?.CustomerId && isFromSidebar) {
      setShowBookings(true)
      fetchHotelBookings()
    } else if (!isFromSidebar) {
      setShowBookings(false)
      doSearch()
    }
  }, [isLoggedIn, user, isFromSidebar])

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/DestinationList`)
      if (res.ok) {
        const data = await res.json()
        setDestinations(data || [])
      }
    } catch (e) {
      console.error('Failed to fetch destinations', e)
    }
  }

  const fetchHotelTypes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/HotelTypeList`)
      if (res.ok) {
        const data = await res.json()
        setHotelTypes(data || [])
      }
    } catch (e) {
      console.error('Failed to fetch hotel types', e)
    }
  }

  const doSearch = async () => {
    try {
      setHotelsLoading(true)
      const params = new URLSearchParams()
      if (filters.destinationId) params.append('destinationId', filters.destinationId)
      if (filters.hotelTypeId) params.append('hotelTypeId', filters.hotelTypeId)
      if (filters.searchText) params.append('searchText', filters.searchText)
      if (filters.starRating) params.append('starRating', filters.starRating)
      if (filters.minCost) params.append('minCost', filters.minCost)
      if (filters.maxCost) params.append('maxCost', filters.maxCost)
      if (filters.fromDate) params.append('fromDate', filters.fromDate)
      if (filters.toDate) params.append('toDate', filters.toDate)
      const url = `${API_BASE_URL}/HotelSearch${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setHotels(data || [])
      } else {
        setHotels([])
      }
    } catch (error) {
      console.error('Error searching hotels:', error)
      setHotels([])
    } finally {
      setHotelsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    if (filters.fromDate && filters.toDate && new Date(filters.fromDate) > new Date(filters.toDate)) {
      alert('Check-out date must be after check-in date.')
      return
    }
    doSearch()
  }

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))

  const fetchHotelBookings = async () => {
    if (!user || !user.CustomerId) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/HotelBookingListByCustomer/${user.CustomerId}`)
      if (response.ok) {
        const data = await response.json()
        setHotelBookings(data || [])
      } else {
        console.error('Failed to fetch hotel bookings')
        setHotelBookings([])
      }
    } catch (error) {
      console.error('Error fetching hotel bookings:', error)
      setHotelBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const isDatePassed = (dateString) => {
    if (!dateString) return false
    const bookingDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    bookingDate.setHours(0, 0, 0, 0)
    return bookingDate < today
  }

  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking)
    setReviewForm({
      rating: booking.Rating || 0,
      review: booking.Review || ''
    })
    setShowReviewModal(true)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!selectedBookingForReview) return
    
    if (!reviewForm.rating || reviewForm.rating === 0) {
      alert('Please select a rating.')
      return
    }

    setSavingReview(true)
    try {
      const payload = {
        Id: selectedBookingForReview.Id,
        Rating: parseInt(reviewForm.rating),
        Review: reviewForm.review
      }

      const response = await fetch(`${API_BASE_URL}/AddHotelBookingReview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Review submitted successfully!')
          setShowReviewModal(false)
          setSelectedBookingForReview(null)
          setReviewForm({ rating: 0, review: '' })
          fetchHotelBookings()
        } else {
          alert('Failed to submit review. Please try again.')
        }
      } else {
        alert('Failed to submit review. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('An error occurred while submitting review.')
    } finally {
      setSavingReview(false)
    }
  }

  const handleCancelBooking = async (booking) => {
    if (!booking?.Id) return
    if ((booking.Status || '').toLowerCase() !== 'pending') return
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      const payload = {
        Id: booking.Id,
        Adults: booking.Adults,
        Kids: booking.Kids,
        TotalDays: booking.TotalDays,
        Total: booking.Total,
        Date: booking.Date,
        FromDate: booking.FromDate,
        ToDate: booking.ToDate,
        HotelId: booking.HotelId,
        HotelRoomId: booking.HotelRoomId,
        CustomerId: booking.CustomerId,
        Review: booking.Review || '',
        Rating: booking.Rating || 0,
        Status: 'Cancelled'
      }

      const response = await fetch(`${API_BASE_URL}/AddHotelBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Booking cancelled successfully.')
          fetchHotelBookings()
        } else {
          alert('Failed to cancel booking.')
        }
      } else {
        const errorText = await response.text()
        alert(errorText || 'Failed to cancel booking.')
      }
    } catch (error) {
      console.error('Error cancelling hotel booking:', error)
      alert('An error occurred while cancelling booking.')
    }
  }


  const handleBookNow = (hotel) => {
    navigate(`/hotels/${hotel.Id}`, {
      state: {
        fromDate: filters.fromDate || null,
        toDate: filters.toDate || null
      }
    })
  }

  // If showing bookings (customer from sidebar)
  if (showBookings) {
    return (
      <>
        <div className="hotels-page">
          <div className="page-header">
            <div className="container">
              <h1>My Hotel Bookings</h1>
              <p>View all your hotel reservations</p>
            </div>
          </div>

          <div className="hotels-container">
            <div className="container">
              {loading ? (
                <div className="loading-container">
                  <p>Loading your bookings...</p>
                </div>
              ) : hotelBookings.length > 0 ? (
                <div className="bookings-grid">
                  {hotelBookings.map(booking => (
                    <div key={booking.Id} className="booking-card">
                      <div className="booking-header">
                        <h2>{booking.Hotel?.Name || 'Hotel'}</h2>
                        {booking.Rating > 0 && (
                          <div className="booking-rating">⭐ {booking.Rating}</div>
                        )}
                      </div>
                      <div className="booking-details">
                        {booking.HotelRoom && (
                          <div className="detail-item">
                            <label>Room:</label>
                            <span>{booking.HotelRoom.Title}</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <label>Check-in:</label>
                          <span>{formatDate(booking.FromDate)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Check-out:</label>
                          <span>{formatDate(booking.ToDate)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Duration:</label>
                          <span>{booking.TotalDays} day(s)</span>
                        </div>
                        <div className="detail-item">
                          <label>Guests:</label>
                          <span>{booking.Adults} Adult(s), {booking.Kids} Kid(s)</span>
                        </div>
                        {booking.HotelRoom && (
                          <div className="detail-item">
                            <label>Room Cost:</label>
                            <span>₹{booking.HotelRoom.Cost} per night</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <label>Total Amount:</label>
                          <span className="total-amount">₹{booking.Total}</span>
                        </div>
                        {booking.Status && (
                          <div className="detail-item">
                            <label>Status:</label>
                            <span className={`status-badge status-${booking.Status.toLowerCase()}`}>
                              {booking.Status}
                            </span>
                          </div>
                        )}
                        {booking.Review && (
                          <div className="detail-item">
                            <label>Review:</label>
                            <p className="review-text">{booking.Review}</p>
                          </div>
                        )}
                      </div>
                      {((booking.Status || '').toLowerCase() === 'pending' || isDatePassed(booking.ToDate)) && (
                        <div className="booking-actions">
                          {(booking.Status || '').toLowerCase() === 'pending' && (
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleCancelBooking(booking)}
                            >
                              Cancel Booking
                            </button>
                          )}
                          {isDatePassed(booking.ToDate) && (
                            <button 
                              className="btn btn-secondary"
                              onClick={() => handleOpenReviewModal(booking)}
                            >
                              {booking.Review ? 'Edit Review' : 'Add Review'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bookings">
                  <p>You don't have any hotel bookings yet.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowBookings(false)}
                  >
                    Browse Hotels
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedBookingForReview && (
          <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
              <h2>Write a Review</h2>
              <p className="review-hotel-name">{selectedBookingForReview.Hotel?.Name}</p>
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label>Rating *</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Review</label>
                  <textarea
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                    rows="5"
                    placeholder="Share your experience..."
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingReview}>
                  {savingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  // Regular hotel listing (default view)
  return (
    <div className="hotels-page">
      <div className="page-header">
        <div className="container">
          <h1>Find Your Perfect Hotel</h1>
          <p>Book comfortable accommodations for your journey</p>
        </div>
      </div>

      <div className="hotels-container">
        <div className="container">
          {/* Hotel Search Filters */}
          <div className="hotel-filters">
            <h3>Search Hotels</h3>
            <form onSubmit={handleSearch} className="filters-form">
              <div className="filters-row">
                <div className="filter-group">
                  <label>Destination</label>
                  <select value={filters.destinationId} onChange={(e) => updateFilter('destinationId', e.target.value)}>
                    <option value="">All</option>
                    {destinations.map(d => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Hotel Type</label>
                  <select value={filters.hotelTypeId} onChange={(e) => updateFilter('hotelTypeId', e.target.value)}>
                    <option value="">All</option>
                    {hotelTypes.map(ht => <option key={ht.Id} value={ht.Id}>{ht.Name}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Search (name, location)</label>
                  <input type="text" placeholder="Search..." value={filters.searchText} onChange={(e) => updateFilter('searchText', e.target.value)} />
                </div>
                <div className="filter-group">
                  <label>Min Star Rating</label>
                  <select value={filters.starRating} onChange={(e) => updateFilter('starRating', e.target.value)}>
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Star+</option>)}
                  </select>
                </div>
              </div>
              <div className="filters-row filters-row-dates">
                <div className="filter-group">
                  <label>Check-in Date (required for availability)</label>
                  <input type="date" value={filters.fromDate} onChange={(e) => updateFilter('fromDate', e.target.value)} min={new Date().toISOString().slice(0, 10)} placeholder="Select date" />
                </div>
                <div className="filter-group">
                  <label>Check-out Date (required for availability)</label>
                  <input type="date" value={filters.toDate} onChange={(e) => updateFilter('toDate', e.target.value)} min={filters.fromDate || new Date().toISOString().slice(0, 10)} placeholder="Select date" />
                </div>
                <div className="filter-group">
                  <label>Min Price (₹/day)</label>
                  <input type="number" placeholder="Min" min="0" step="100" value={filters.minCost} onChange={(e) => updateFilter('minCost', e.target.value)} />
                </div>
                <div className="filter-group">
                  <label>Max Price (₹/day)</label>
                  <input type="number" placeholder="Max" min="0" step="100" value={filters.maxCost} onChange={(e) => updateFilter('maxCost', e.target.value)} />
                </div>
                <div className="filter-group filter-actions">
                  <button type="submit" className="btn btn-primary" disabled={hotelsLoading}>
                    {hotelsLoading ? 'Searching...' : 'Search'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setFilters({ destinationId: '', hotelTypeId: '', searchText: '', starRating: '', minCost: '', maxCost: '', fromDate: '', toDate: '' })
                  }}>
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </div>

          {isLoggedIn && user?.Role === 'Customer' && (
            <div className="view-toggle">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowBookings(true)
                  fetchHotelBookings()
                }}
              >
                View My Bookings
              </button>
            </div>
          )}
          {hotelsLoading ? (
            <div className="loading-container">
              <p>Loading hotels...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="no-hotels">
              <p>Select check-in and check-out dates above and click Search to find available hotels.</p>
              <p>No hotels match your criteria. Try adjusting your filters or dates.</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {hotels.map(hotel => (
                <div key={hotel.Id} className="hotel-card">
                  <div className="hotel-image">
                    <img 
                      src={hotel.Image1 && hotel.Image1.startsWith('http') 
                        ? hotel.Image1 
                        : hotel.Image1 
                          ? `${API_BASE_URL}/${hotel.Image1}` 
                          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} 
                      alt={hotel.Name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
                      }}
                    />
                    {hotel.StarRating > 0 && (
                      <div className="hotel-rating">⭐ {hotel.StarRating}</div>
                    )}
                    {hotel.HotelType && (
                      <div className="hotel-type-badge">{hotel.HotelType.Name}</div>
                    )}
                  </div>
                  <div className="hotel-content">
                    <h2>{hotel.Name}</h2>
                    {hotel.Destination && (
                      <p className="hotel-location">📍 {hotel.Destination.Name}</p>
                    )}
                    {hotel.Location && (
                      <p className="hotel-location-detail">📍 {hotel.Location}</p>
                    )}
                    {hotel.Address && (
                      <p className="hotel-address">{hotel.Address}</p>
                    )}
                    {hotel.AvgRating > 0 && (
                      <div className="hotel-avg-rating">
                        Average Rating: ⭐ {hotel.AvgRating.toFixed(1)}
                      </div>
                    )}
                    <div className="hotel-footer">
                      <div className="hotel-price">
                        <span className="price">₹{hotel.CostPerDay || 0}</span>
                        <span className="price-label">per day</span>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleBookNow(hotel)}
                      >
                        View Details & Book
                      </button>
                    </div>
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

export default Hotels


import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'
import './Cabs.css'

const API_BASE_URL = 'http://localhost:61792'

const Cabs = () => {
  const { user, isLoggedIn } = useAuth()
  const location = useLocation()
  const isFromSidebar = location.state?.fromSidebar === true
  const [vehicles, setVehicles] = useState([])
  const [destinations, setDestinations] = useState([])
  const [selectedCab, setSelectedCab] = useState(null)
  const [cabBookings, setCabBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingReview, setSavingReview] = useState(false)
  const [vehiclesLoading, setVehiclesLoading] = useState(true)
  const [showBookings, setShowBookings] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review: ''
  })
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    destinationId: '',
    distance: '',
    journeyId: '',
    journeyDetailId: ''
  })
  const [customerJourneys, setCustomerJourneys] = useState([])
  const [journeyDetails, setJourneyDetails] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    brand: '',
    vehicleType: '',
    fuelType: '',
    transmission: '',
    minSeats: '',
    maxSeats: '',
    minRate: '',
    maxRate: ''
  })

  useEffect(() => {
    fetchVehicles()
    fetchDestinations()
    // If customer is logged in and accessed from sidebar, show bookings
    if (isLoggedIn && user?.Role === 'Customer' && user?.CustomerId && isFromSidebar) {
      setShowBookings(true)
      fetchCabBookings()
    } else {
      setShowBookings(false)
    }
  }, [isLoggedIn, user, isFromSidebar])

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/DestinationList`)
      if (response.ok) {
        const data = await response.json()
        setDestinations(data || [])
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
    }
  }

  const fetchVehicles = async () => {
    try {
      setVehiclesLoading(true)
      const response = await fetch(`${API_BASE_URL}/VehicleList`)
      if (response.ok) {
        const data = await response.json()
        setVehicles(data || [])
      } else {
        console.error('Failed to fetch vehicles')
        setVehicles([])
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setVehicles([])
    } finally {
      setVehiclesLoading(false)
    }
  }

  const fetchCabBookings = async () => {
    if (!user || !user.CustomerId) return

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/CabBookingByCustomerId/${user.CustomerId}`)
      if (response.ok) {
        const data = await response.json()
        setCabBookings(data || [])
      } else {
        console.error('Failed to fetch cab bookings')
        setCabBookings([])
      }
    } catch (error) {
      console.error('Error fetching cab bookings:', error)
      setCabBookings([])
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

  const getTodayDate = () => new Date().toISOString().split('T')[0]

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

      const response = await fetch(`${API_BASE_URL}/AddCabBookingReview`, {
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
          fetchCabBookings()
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
        Date: booking.Date,
        Time: booking.Time,
        TotalKmS: booking.TotalKmS,
        TotalAmount: booking.TotalAmount,
        Rating: booking.Rating || 0,
        Review: booking.Review || '',
        Status: 'Cancelled',
        LocationFrom: booking.LocationFrom,
        LocationTo: booking.LocationTo,
        CustomerId: booking.CustomerId,
        VehicleId: booking.VehicleId,
        DriverId: booking.DriverId,
        DestinationId: booking.DestinationId || 0
      }

      const response = await fetch(`${API_BASE_URL}/AddCabBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Booking cancelled successfully.')
          fetchCabBookings()
        } else {
          alert('Failed to cancel booking.')
        }
      } else {
        const errorText = await response.text()
        alert(errorText || 'Failed to cancel booking.')
      }
    } catch (error) {
      console.error('Error cancelling cab booking:', error)
      alert('An error occurred while cancelling booking.')
    }
  }

  const getVehicleFeatures = (vehicle) => {
    const features = []
    if (vehicle.AC) features.push('AC')
    if (vehicle.GPS) features.push('GPS')
    if (vehicle.Bluetooth) features.push('Bluetooth')
    if (vehicle.Wifi) features.push('Wi-Fi')
    if (vehicle.MusicSystem) features.push('Music System')
    if (vehicle.Camera) features.push('Camera')
    if (vehicle.Sensors) features.push('Sensors')
    if (vehicle.LCD) features.push('LCD')
    if (vehicle.Safety) features.push('Safety Features')
    return features
  }

  const getAgencyProfile = (agency) => {
    if (!agency) return ''
    const parts = [agency.Location, agency.Address].filter(Boolean)
    if (parts.length === 0) return ''
    return parts.join(', ')
  }

  const uniqueBrands = [...new Set(vehicles.map(v => v.Brand?.Name).filter(Boolean))].sort()
  const uniqueVehicleTypes = [...new Set(vehicles.map(v => v.VehicleType?.Name).filter(Boolean))].sort()
  const uniqueFuelTypes = [...new Set(vehicles.map(v => v.FuelType).filter(Boolean))].sort()
  const uniqueTransmissions = [...new Set(vehicles.map(v => v.Transmission).filter(Boolean))].sort()

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = !searchQuery ||
      (vehicle.Model && vehicle.Model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vehicle.Brand?.Name && vehicle.Brand.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vehicle.Driver?.Name && vehicle.Driver.Name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesBrand = !filters.brand || vehicle.Brand?.Name === filters.brand
    const matchesVehicleType = !filters.vehicleType || vehicle.VehicleType?.Name === filters.vehicleType
    const matchesFuelType = !filters.fuelType || vehicle.FuelType === filters.fuelType
    const matchesTransmission = !filters.transmission || vehicle.Transmission === filters.transmission
    const seats = vehicle.NoOfSeat != null ? Number(vehicle.NoOfSeat) : 0
    const matchesMinSeats = !filters.minSeats || seats >= Number(filters.minSeats)
    const matchesMaxSeats = !filters.maxSeats || seats <= Number(filters.maxSeats)
    const rate = vehicle.Rate != null ? Number(vehicle.Rate) : 0
    const matchesMinRate = !filters.minRate || rate >= Number(filters.minRate)
    const matchesMaxRate = !filters.maxRate || rate <= Number(filters.maxRate)
    return matchesSearch && matchesBrand && matchesVehicleType && matchesFuelType &&
      matchesTransmission && matchesMinSeats && matchesMaxSeats && matchesMinRate && matchesMaxRate
  })

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      brand: '',
      vehicleType: '',
      fuelType: '',
      transmission: '',
      minSeats: '',
      maxSeats: '',
      minRate: '',
      maxRate: ''
    })
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

  const handleBookNow = (cab) => {
    // Check if user is logged in and is a Customer
    if (!isLoggedIn || user?.Role !== 'Customer') {
      alert('Please login as a Customer to book a cab.')
      return
    }
    setSelectedCab(cab)
    setBookingForm({
      pickupLocation: '',
      dropLocation: '',
      pickupDate: '',
      pickupTime: '',
      passengers: 1,
      destinationId: '',
      distance: '',
      journeyId: '',
      journeyDetailId: ''
    })
    fetchCustomerJourneys()
    setJourneyDetails([])
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is logged in and is a Customer
    if (!isLoggedIn || user?.Role !== 'Customer' || !user?.CustomerId) {
      alert('Please login as a Customer to book a cab.')
      return
    }

    if (!selectedCab) return

    const todayStr = getTodayDate()
    if (bookingForm.pickupDate < todayStr) {
      alert('Past dates are not allowed. Please select current or future date.')
      return
    }

    setSaving(true)
    try {
      // Calculate total amount based on distance and rate
      const distance = parseFloat(bookingForm.distance) || 0
      const rate = selectedCab.Rate || 0
      const totalAmount = distance * rate

      const payload = {
        Id: 0,
        Date: bookingForm.pickupDate,
        Time: bookingForm.pickupTime,
        TotalKmS: distance,
        TotalAmount: totalAmount,
        Rating: 0,
        Review: '',
        Status: 'Pending',
        LocationFrom: bookingForm.pickupLocation,
        LocationTo: bookingForm.dropLocation,
        CustomerId: user.CustomerId,
        VehicleId: selectedCab.Id,
        DriverId: selectedCab.DriverId || null,
        DestinationId: bookingForm.destinationId ? parseInt(bookingForm.destinationId) : null,
        JourneyId: bookingForm.journeyId ? parseInt(bookingForm.journeyId) : null,
        JourneyDetailId: bookingForm.journeyDetailId ? parseInt(bookingForm.journeyDetailId) : null
      }

      const response = await fetch(`${API_BASE_URL}/AddCabBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Cab booking confirmed successfully!')
          setSelectedCab(null)
          setBookingForm({
            pickupLocation: '',
            dropLocation: '',
            pickupDate: '',
            pickupTime: '',
            passengers: 1,
            destinationId: '',
            distance: ''
          })
          // Refresh bookings if showing bookings view
          if (showBookings) {
            fetchCabBookings()
          }
        } else {
          alert('Failed to confirm booking. Please try again.')
        }
      } else {
        const errorText = await response.text()
        alert(errorText || 'Failed to confirm booking. Please try again.')
      }
    } catch (error) {
      console.error('Error booking cab:', error)
      alert('An error occurred while booking. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const closeModal = () => {
    setSelectedCab(null)
  }

  // If showing bookings (customer from sidebar)
  if (showBookings) {
    return (
      <>
        <div className="cabs-page">
          <div className="page-header">
            <div className="container">
              <h1>My Cab Bookings</h1>
              <p>View all your cab reservations</p>
            </div>
          </div>

          <div className="cabs-container">
            <div className="container">
              {loading ? (
                <div className="loading-container">
                  <p>Loading your bookings...</p>
                </div>
              ) : cabBookings.length > 0 ? (
                <div className="bookings-grid">
                  {cabBookings.map(booking => (
                    <div key={booking.Id} className="booking-card">
                      <div className="booking-header">
                        <h2>{booking.Vehicle?.Model || 'Vehicle'}</h2>
                        {booking.Rating > 0 && (
                          <div className="booking-rating">⭐ {booking.Rating}</div>
                        )}
                      </div>
                      <div className="booking-details">
                        {booking.Vehicle?.Agency && (
                          <div className="cab-agency">
                            <h3>Agency: {booking.Vehicle.Agency.Name || 'Agency'}</h3>
                            {(booking.Vehicle.Agency.MobileNo || booking.Vehicle.Agency.EmailId) && (
                              <p>
                                Contact:
                                {booking.Vehicle.Agency.MobileNo ? ` ${booking.Vehicle.Agency.MobileNo}` : ''}
                                {booking.Vehicle.Agency.MobileNo && booking.Vehicle.Agency.EmailId ? ' |' : ''}
                                {booking.Vehicle.Agency.EmailId ? ` ${booking.Vehicle.Agency.EmailId}` : ''}
                              </p>
                            )}
                            {getAgencyProfile(booking.Vehicle.Agency) && (
                              <p>Profile: {getAgencyProfile(booking.Vehicle.Agency)}</p>
                            )}
                          </div>
                        )}
                        {booking.Driver && (
                          <div className="detail-item">
                            <label>Driver:</label>
                            <span>{booking.Driver.Name}</span>
                          </div>
                        )}
                        {(booking.Status || '').toLowerCase() === 'accepted' && booking.Driver && (
                          <>
                            {booking.Driver.MobileNo && (
                              <div className="detail-item">
                                <label>Driver Mobile:</label>
                                <span>{booking.Driver.MobileNo}</span>
                              </div>
                            )}
                            {booking.Driver.EmailId && (
                              <div className="detail-item">
                                <label>Driver Email:</label>
                                <span>{booking.Driver.EmailId}</span>
                              </div>
                            )}
                            {booking.Driver.Location && (
                              <div className="detail-item">
                                <label>Driver Location:</label>
                                <span>{booking.Driver.Location}</span>
                              </div>
                            )}
                          </>
                        )}
                        {booking.Destination && (
                          <div className="detail-item">
                            <label>Destination:</label>
                            <span>{booking.Destination.Name}</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <label>From:</label>
                          <span>{booking.LocationFrom}</span>
                        </div>
                        <div className="detail-item">
                          <label>To:</label>
                          <span>{booking.LocationTo}</span>
                        </div>
                        <div className="detail-item">
                          <label>Date:</label>
                          <span>{formatDate(booking.Date)}</span>
                        </div>
                        {booking.Time && (
                          <div className="detail-item">
                            <label>Time:</label>
                            <span>{booking.Time}</span>
                          </div>
                        )}
                        {booking.TotalKmS > 0 && (
                          <div className="detail-item">
                            <label>Distance:</label>
                            <span>{booking.TotalKmS} km</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <label>Total Amount:</label>
                          <span className="total-amount">₹{booking.TotalAmount}</span>
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
                      {((booking.Status || '').toLowerCase() === 'pending' || isDatePassed(booking.Date)) && (
                        <div className="booking-actions">
                          {(booking.Status || '').toLowerCase() === 'pending' && (
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleCancelBooking(booking)}
                            >
                              Cancel Booking
                            </button>
                          )}
                          {isDatePassed(booking.Date) && (
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
                  <p>You don't have any cab bookings yet.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowBookings(false)}
                  >
                    Browse Cabs
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
              <p className="review-vehicle-name">{selectedBookingForReview.Vehicle?.Model}</p>
              {selectedBookingForReview.Driver && (
                <p className="review-driver-name">Driver: {selectedBookingForReview.Driver.Name}</p>
              )}
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

  // Regular cab listing (default view)
  return (
    <div className="cabs-page">
      <div className="page-header">
        <div className="container">
          <h1>Book Your Cab</h1>
          <p>Reliable transportation for your journey</p>
        </div>
      </div>

      <div className="cabs-container">
        <div className="container">
          {isLoggedIn && user?.Role === 'Customer' && (
            <div className="view-toggle">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowBookings(true)
                  fetchCabBookings()
                }}
              >
                View My Bookings
              </button>
            </div>
          )}

          {!vehiclesLoading && vehicles.length > 0 && (
            <div className="cabs-filters-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by model, brand or driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filters-section">
                <h3>Filter Results</h3>
                <div className="filters-grid">
                  <div className="filter-group">
                    <label>Brand</label>
                    <select name="brand" value={filters.brand} onChange={handleFilterChange}>
                      <option value="">All brands</option>
                      {uniqueBrands.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Vehicle Type</label>
                    <select name="vehicleType" value={filters.vehicleType} onChange={handleFilterChange}>
                      <option value="">All types</option>
                      {uniqueVehicleTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Fuel Type</label>
                    <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
                      <option value="">All</option>
                      {uniqueFuelTypes.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Transmission</label>
                    <select name="transmission" value={filters.transmission} onChange={handleFilterChange}>
                      <option value="">All</option>
                      {uniqueTransmissions.map(tr => (
                        <option key={tr} value={tr}>{tr}</option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Min Seats</label>
                    <input
                      type="number"
                      name="minSeats"
                      value={filters.minSeats}
                      onChange={handleFilterChange}
                      placeholder="e.g. 2"
                      min="1"
                    />
                  </div>
                  <div className="filter-group">
                    <label>Max Seats</label>
                    <input
                      type="number"
                      name="maxSeats"
                      value={filters.maxSeats}
                      onChange={handleFilterChange}
                      placeholder="e.g. 7"
                      min="1"
                    />
                  </div>
                  <div className="filter-group">
                    <label>Min Rate (₹)</label>
                    <input
                      type="number"
                      name="minRate"
                      value={filters.minRate}
                      onChange={handleFilterChange}
                      placeholder="e.g. 10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="filter-group">
                    <label>Max Rate (₹)</label>
                    <input
                      type="number"
                      name="maxRate"
                      value={filters.maxRate}
                      onChange={handleFilterChange}
                      placeholder="e.g. 50"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {vehiclesLoading ? (
            <div className="loading-container">
              <p>Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="no-cabs">
              <p>No vehicles available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>Available Cabs</h2>
                <p>{filteredVehicles.length} cab{filteredVehicles.length !== 1 ? 's' : ''} found</p>
              </div>
              <div className="cabs-grid">
              {filteredVehicles.map(vehicle => {
                const features = getVehicleFeatures(vehicle)
                return (
                  <div key={vehicle.Id} className="cab-card">
                    <div className="cab-image">
                      <img 
                        src={vehicle.Image1 && vehicle.Image1.startsWith('http') 
                          ? vehicle.Image1 
                          : vehicle.Image1 
                            ? `${API_BASE_URL}/${vehicle.Image1}` 
                            : 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'} 
                        alt={vehicle.Model}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
                        }}
                      />
                      {vehicle.VehicleType && (
                        <div className="cab-type-badge">{vehicle.VehicleType.Name}</div>
                      )}
                      {vehicle.Brand && (
                        <div className="cab-brand-badge">{vehicle.Brand.Name}</div>
                      )}
                    </div>
                    <div className="cab-content">
                      <h2>{vehicle.Model}</h2>
                      {vehicle.Year && (
                        <p className="cab-year">Year: {vehicle.Year}</p>
                      )}
                      {vehicle.Driver && (
                        <p className="cab-driver">Driver: {vehicle.Driver.Name} ({vehicle.Driver.MobileNo})</p>
                      )}
                      {vehicle.Agency && (
                        <div className="cab-agency">
                          <h3>Provided by: {vehicle.Agency.Name || 'Agency'}</h3>
                          {(vehicle.Agency.MobileNo || vehicle.Agency.EmailId) && (
                            <p>
                              Contact:
                              {vehicle.Agency.MobileNo ? ` ${vehicle.Agency.MobileNo}` : ''}
                              {vehicle.Agency.MobileNo && vehicle.Agency.EmailId ? ' |' : ''}
                              {vehicle.Agency.EmailId ? ` ${vehicle.Agency.EmailId}` : ''}
                            </p>
                          )}
                          {getAgencyProfile(vehicle.Agency) && (
                            <p>Profile: {getAgencyProfile(vehicle.Agency)}</p>
                          )}
                        </div>
                      )}
                      {features.length > 0 && (
                        <div className="cab-features">
                          {features.map((feature, index) => (
                            <span key={index} className="feature-tag">{feature}</span>
                          ))}
                        </div>
                      )}
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
                      </div>
                      <div className="cab-footer">
                        <div className="cab-price">
                          <span className="price">₹{vehicle.Rate || 0}</span>
                          <span className="price-label">per ride</span>
                        </div>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleBookNow(vehicle)}
                          disabled={!isLoggedIn || user?.Role !== 'Customer'}
                          title={!isLoggedIn || user?.Role !== 'Customer' ? 'Please login as Customer to book' : ''}
                        >
                          {!isLoggedIn || user?.Role !== 'Customer' ? 'Login to Book' : 'Book Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCab && (
        <div className="booking-modal-overlay" onClick={closeModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <h2>Book {selectedCab.Model}</h2>
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={bookingForm.pickupLocation}
                  onChange={(e) => setBookingForm({...bookingForm, pickupLocation: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Drop Location</label>
                <input
                  type="text"
                  placeholder="Enter drop address"
                  value={bookingForm.dropLocation}
                  onChange={(e) => setBookingForm({...bookingForm, dropLocation: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <select
                  value={bookingForm.destinationId}
                  onChange={(e) => setBookingForm({...bookingForm, destinationId: e.target.value})}
                >
                  <option value="">Select Destination (Optional)</option>
                  {destinations.map(dest => (
                    <option key={dest.Id} value={dest.Id}>{dest.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Distance (km)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter distance in km"
                  value={bookingForm.distance}
                  onChange={(e) => setBookingForm({...bookingForm, distance: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pickup Date</label>
                <input
                  type="date"
                  value={bookingForm.pickupDate}
                  onChange={(e) => setBookingForm({...bookingForm, pickupDate: e.target.value})}
                  min={getTodayDate()}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pickup Time</label>
                <input
                  type="time"
                  value={bookingForm.pickupTime}
                  onChange={(e) => setBookingForm({...bookingForm, pickupTime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Passengers</label>
                <input
                  type="number"
                  min="1"
                  max={selectedCab.NoOfSeat || 10}
                  value={bookingForm.passengers}
                  onChange={(e) => setBookingForm({...bookingForm, passengers: parseInt(e.target.value)})}
                  required
                />
                <small>Maximum capacity: {selectedCab.NoOfSeat || 10} passengers</small>
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
                <p>Vehicle: <strong>{selectedCab.Model}</strong></p>
                {selectedCab.VehicleType && (
                  <p>Type: <strong>{selectedCab.VehicleType.Name}</strong></p>
                )}
                {selectedCab.NoOfSeat > 0 && (
                  <p>Capacity: <strong>{selectedCab.NoOfSeat} seats</strong></p>
                )}
                <p>Rate: <strong>₹{selectedCab.Rate || 0}</strong> per km</p>
                {selectedCab.Agency && (
                  <>
                    <p>Agency: <strong>{selectedCab.Agency.Name || 'Agency'}</strong></p>
                    {(selectedCab.Agency.MobileNo || selectedCab.Agency.EmailId) && (
                      <p>
                        Contact:
                        <strong>
                          {selectedCab.Agency.MobileNo ? ` ${selectedCab.Agency.MobileNo}` : ''}
                          {selectedCab.Agency.MobileNo && selectedCab.Agency.EmailId ? ' |' : ''}
                          {selectedCab.Agency.EmailId ? ` ${selectedCab.Agency.EmailId}` : ''}
                        </strong>
                      </p>
                    )}
                    {getAgencyProfile(selectedCab.Agency) && (
                      <p>Profile: <strong>{getAgencyProfile(selectedCab.Agency)}</strong></p>
                    )}
                  </>
                )}
                {bookingForm.distance && parseFloat(bookingForm.distance) > 0 && (
                  <p>Distance: <strong>{bookingForm.distance} km</strong></p>
                )}
                {bookingForm.distance && parseFloat(bookingForm.distance) > 0 && (
                  <p className="total-price">
                    Total Amount: <strong>₹{((selectedCab.Rate || 0) * parseFloat(bookingForm.distance)).toFixed(2)}</strong>
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-large" disabled={saving}>
                {saving ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cabs


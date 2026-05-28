import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import './HotelDashboard.css'

const API_BASE_URL = 'http://localhost:61792'

const HotelDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Hotel edit form
  const [showEditModal, setShowEditModal] = useState(false)
  const [hotelForm, setHotelForm] = useState({
    name: '',
    email: '',
    mobileNo: '',
    destinationId: '',
    costPerDay: '',
    location: '',
    address: '',
    hotelTypeId: '',
    starRating: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: ''
  })
  
  // Room form
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [roomForm, setRoomForm] = useState({
    title: '',
    description: '',
    cost: '',
    adults: '',
    kids: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: ''
  })
  
  // Highlight form
  const [showHighlightModal, setShowHighlightModal] = useState(false)
  const [editingHighlight, setEditingHighlight] = useState(null)
  const [highlightForm, setHighlightForm] = useState({
    description: '',
    type: ''
  })
  
  const [destinations, setDestinations] = useState([])
  const [hotelTypes, setHotelTypes] = useState([])

  useEffect(() => {
    if (user && user.Role === 'Hotel' && user.HotelId) {
      fetchBookings()
      fetchRooms()
      fetchHighlights()
      fetchDestinations()
      fetchHotelTypes()
      // Initialize hotel form with user data
      setHotelForm({
        name: user.Name || '',
        email: user.Email || '',
        mobileNo: user.MobileNo || '',
        destinationId: '',
        costPerDay: '',
        location: '',
        address: '',
        hotelTypeId: '',
        starRating: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: ''
      })
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user?.HotelId) return
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/HotelBookingListByHotel/${user.HotelId}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingStatusUpdate = async (booking, status) => {
    if (!booking?.Id) return
    if (!window.confirm(`Mark this booking as ${status}?`)) return

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
        Status: status
      }

      const response = await fetch(`${API_BASE_URL}/AddHotelBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          fetchBookings()
        } else {
          alert('Failed to update booking status')
        }
      } else {
        alert('Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating hotel booking status:', error)
      alert('Error updating booking status')
    }
  }

  const fetchRooms = async () => {
    if (!user?.HotelId) return
    try {
      const response = await fetch(`${API_BASE_URL}/HotelRoomList/${user.HotelId}`)
      if (response.ok) {
        const data = await response.json()
        setRooms(data || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const fetchHighlights = async () => {
    if (!user?.HotelId) return
    try {
      const response = await fetch(`${API_BASE_URL}/HotelHighlightList/${user.HotelId}`)
      if (response.ok) {
        const data = await response.json()
        setHighlights(data || [])
      }
    } catch (error) {
      console.error('Error fetching highlights:', error)
    }
  }

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

  const fetchHotelTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/HotelTypeList`)
      if (response.ok) {
        const data = await response.json()
        setHotelTypes(data || [])
      }
    } catch (error) {
      console.error('Error fetching hotel types:', error)
    }
  }

  const fetchHotelDetails = async () => {
    if (!user?.HotelId) return
    try {
      // Try query parameter first, then route parameter
      let response = await fetch(`${API_BASE_URL}/HotelById?id=${user.HotelId}`)
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/HotelById/${user.HotelId}`)
      }
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setHotelForm({
            name: data.Name || '',
            email: data.Email || '',
            mobileNo: data.MobileNo || '',
            destinationId: data.DestinationId ? data.DestinationId.toString() : '',
            costPerDay: data.CostPerDay ? data.CostPerDay.toString() : '',
            location: data.Location || '',
            address: data.Address || '',
            hotelTypeId: data.HotelTypeId ? data.HotelTypeId.toString() : '',
            starRating: data.StarRating ? data.StarRating.toString() : '',
            image1: data.Image1 || '',
            image2: data.Image2 || '',
            image3: data.Image3 || '',
            image4: data.Image4 || '',
            image5: data.Image5 || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error)
    }
  }

  const handleImageChange = (field, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setHotelForm(prev => ({ ...prev, [field]: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRoomImageChange = (field, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setRoomForm(prev => ({ ...prev, [field]: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveHotel = async (e) => {
    e.preventDefault()
    if (!user?.HotelId) return
    
    setSaving(true)
    try {
      // Only send base64 images if they're new (start with "data:"), otherwise keep existing paths
      const payload = {
        Id: user.HotelId,
        Name: hotelForm.name,
        Email: hotelForm.email,
        MobileNo: hotelForm.mobileNo,
        DestinationId: hotelForm.destinationId ? parseInt(hotelForm.destinationId) : null,
        CostPerDay: hotelForm.costPerDay ? parseFloat(hotelForm.costPerDay) : 0,
        Location: hotelForm.location,
        Address: hotelForm.address,
        HotelTypeId: hotelForm.hotelTypeId ? parseInt(hotelForm.hotelTypeId) : null,
        StarRating: hotelForm.starRating ? parseInt(hotelForm.starRating) : 0,
        Image1: hotelForm.image1 && hotelForm.image1.startsWith('data:') ? hotelForm.image1 : (hotelForm.image1 || ''),
        Image2: hotelForm.image2 && hotelForm.image2.startsWith('data:') ? hotelForm.image2 : (hotelForm.image2 || ''),
        Image3: hotelForm.image3 && hotelForm.image3.startsWith('data:') ? hotelForm.image3 : (hotelForm.image3 || ''),
        Image4: hotelForm.image4 && hotelForm.image4.startsWith('data:') ? hotelForm.image4 : (hotelForm.image4 || ''),
        Image5: hotelForm.image5 && hotelForm.image5.startsWith('data:') ? hotelForm.image5 : (hotelForm.image5 || '')
      }

      const response = await fetch(`${API_BASE_URL}/AddHotel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Hotel information updated successfully!')
          setShowEditModal(false)
        }
      }
    } catch (error) {
      console.error('Error updating hotel:', error)
      alert('Failed to update hotel information')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveRoom = async (e) => {
    e.preventDefault()
    if (!user?.HotelId) return
    
    setSaving(true)
    try {
      const payload = {
        Id: editingRoom ? editingRoom.Id : 0,
        HotelId: user.HotelId,
        Title: roomForm.title,
        Description: roomForm.description,
        Cost: roomForm.cost ? parseFloat(roomForm.cost) : 0,
        Adults: roomForm.adults ? parseInt(roomForm.adults) : 0,
        Kids: roomForm.kids ? parseInt(roomForm.kids) : 0,
        Image1: roomForm.image1 || '',
        Image2: roomForm.image2 || '',
        Image3: roomForm.image3 || '',
        Image4: roomForm.image4 || '',
        Image5: roomForm.image5 || ''
      }

      const response = await fetch(`${API_BASE_URL}/AddHotelRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert(editingRoom ? 'Room updated successfully!' : 'Room added successfully!')
          setShowRoomModal(false)
          setEditingRoom(null)
          setRoomForm({ title: '', description: '', cost: '', adults: '', kids: '', image1: '', image2: '', image3: '', image4: '', image5: '' })
          fetchRooms()
        }
      }
    } catch (error) {
      console.error('Error saving room:', error)
      alert('Failed to save room')
    } finally {
      setSaving(false)
    }
  }

  const handleEditRoom = async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetHotelRoomById/${roomId}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setEditingRoom(data)
          setRoomForm({
            title: data.Title || '',
            description: data.Description || '',
            cost: data.Cost || '',
            adults: data.Adults || '',
            kids: data.Kids || '',
            image1: data.Image1 || '',
            image2: data.Image2 || '',
            image3: data.Image3 || '',
            image4: data.Image4 || '',
            image5: data.Image5 || ''
          })
          setShowRoomModal(true)
        }
      }
    } catch (error) {
      console.error('Error fetching room:', error)
    }
  }

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/DeleteHotelRoom/${roomId}`, {
        method: 'GET'
      })
      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Room deleted successfully!')
          fetchRooms()
        }
      }
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room')
    }
  }

  const handleSaveHighlight = async (e) => {
    e.preventDefault()
    if (!user?.HotelId) return
    
    setSaving(true)
    try {
      const payload = {
        Id: editingHighlight ? editingHighlight.Id : 0,
        HotelId: user.HotelId,
        Description: highlightForm.description,
        Type: highlightForm.type
      }

      const response = await fetch(`${API_BASE_URL}/AddHotelHighlight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert(editingHighlight ? 'Highlight updated successfully!' : 'Highlight added successfully!')
          setShowHighlightModal(false)
          setEditingHighlight(null)
          setHighlightForm({ description: '', type: '' })
          fetchHighlights()
        }
      }
    } catch (error) {
      console.error('Error saving highlight:', error)
      alert('Failed to save highlight')
    } finally {
      setSaving(false)
    }
  }

  const handleEditHighlight = async (highlightId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetHotelHighlightById/${highlightId}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setEditingHighlight(data)
          setHighlightForm({
            description: data.Description || '',
            type: data.Type || ''
          })
          setShowHighlightModal(true)
        }
      }
    } catch (error) {
      console.error('Error fetching highlight:', error)
    }
  }

  const handleDeleteHighlight = async (highlightId) => {
    if (!window.confirm('Are you sure you want to delete this highlight?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/DeleteHotelHighlight/${highlightId}`, {
        method: 'GET'
      })
      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Highlight deleted successfully!')
          fetchHighlights()
        }
      }
    } catch (error) {
      console.error('Error deleting highlight:', error)
      alert('Failed to delete highlight')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (!user || user.Role !== 'Hotel') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <h2>Access Denied</h2>
          <p>You need to be logged in as a Hotel to access this page.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Hotel Dashboard</h1>
        <p>Welcome back, {user.Name}!</p>
      </div>

      <div className="hotel-dashboard-tabs">
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button 
          className={activeTab === 'edit' ? 'active' : ''}
          onClick={() => setActiveTab('edit')}
        >
          Edit Hotel Info
        </button>
        <button 
          className={activeTab === 'rooms' ? 'active' : ''}
          onClick={() => setActiveTab('rooms')}
        >
          Rooms
        </button>
        <button 
          className={activeTab === 'highlights' ? 'active' : ''}
          onClick={() => setActiveTab('highlights')}
        >
          Highlights
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'bookings' && (
          <div className="dashboard-card">
            <h2>Hotel Bookings</h2>
            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Adults</th>
                      <th>Kids</th>
                      <th>Total Days</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.Id}>
                        <td>
                          {booking.Customer?.Name || '-'}
                          {(booking.Status || '').toLowerCase() === 'accepted' && (
                            <>
                              {booking.Customer?.MobileNo && <><br />{booking.Customer.MobileNo}</>}
                              {booking.Customer?.EmailId && <><br />{booking.Customer.EmailId}</>}
                            </>
                          )}
                        </td>
                        <td>{booking.HotelRoom?.Title}<br/>₹{booking.HotelRoom?.Cost}</td>
                        <td>{formatDate(booking.FromDate)}</td>
                        <td>{formatDate(booking.ToDate)}</td>
                        <td>{booking.Adults}</td>
                        <td>{booking.Kids}</td>
                        <td>{booking.TotalDays}</td>
                        <td>₹{booking.Total}</td>
                        <td>
                          <span className={`status-badge status-${booking.Status?.toLowerCase() || 'pending'}`}>
                            {booking.Status || 'Pending'}
                          </span>
                        </td>
                        <td>{booking.Rating ? '⭐'.repeat(booking.Rating) : '-'}</td>
                        <td className="actions-cell">
                          <div className="status-actions">
                            <button
                              className="btn btn-primary btn-sm"
                              disabled={booking.Status === 'Accepted'}
                              onClick={() => handleBookingStatusUpdate(booking, 'Accepted')}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={booking.Status === 'Rejected'}
                              onClick={() => handleBookingStatusUpdate(booking, 'Rejected')}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Edit Hotel Information</h2>
              <button onClick={() => {
                fetchHotelDetails()
                setShowEditModal(true)
              }} className="btn btn-primary">
                Edit Hotel Details
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Hotel Name:</label>
                <span>{user.Name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.Email}</span>
              </div>
              <div className="info-item">
                <label>Mobile:</label>
                <span>{user.MobileNo}</span>
              </div>
              <div className="info-item">
                <label>Hotel ID:</label>
                <span>{user.HotelId}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Hotel Rooms</h2>
              <button 
                onClick={() => {
                  setEditingRoom(null)
                  setRoomForm({ title: '', description: '', cost: '', adults: '', kids: '', image1: '', image2: '', image3: '', image4: '', image5: '' })
                  setShowRoomModal(true)
                }} 
                className="btn btn-primary"
              >
                + Add Room
              </button>
            </div>
            {rooms.length === 0 ? (
              <p>No rooms added yet.</p>
            ) : (
              <div className="rooms-grid">
                {rooms.map(room => (
                  <div key={room.Id} className="room-card">
                    {room.Image1 && (
                      <img 
                        src={room.Image1.startsWith('http') ? room.Image1 : `${API_BASE_URL}/${room.Image1}`}
                        alt={room.Title}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div className="room-info">
                      <h3>{room.Title}</h3>
                      <p>Cost: ₹{room.Cost}</p>
                      <p>Adults: {room.Adults} | Kids: {room.Kids}</p>
                      <div className="room-actions">
                        <button onClick={() => handleEditRoom(room.Id)} className="btn btn-secondary">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteRoom(room.Id)} className="btn btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Hotel Highlights</h2>
              <button 
                onClick={() => {
                  setEditingHighlight(null)
                  setHighlightForm({ description: '', type: '' })
                  setShowHighlightModal(true)
                }} 
                className="btn btn-primary"
              >
                + Add Highlight
              </button>
            </div>
            {highlights.length === 0 ? (
              <p>No highlights added yet.</p>
            ) : (
              <div className="highlights-list">
                {highlights.map(highlight => (
                  <div key={highlight.Id} className="highlight-item">
                    <div className="highlight-content">
                      <span className="highlight-type">{highlight.Type}</span>
                      <p>{highlight.Description}</p>
                    </div>
                    <div className="highlight-actions">
                      <button onClick={() => handleEditHighlight(highlight.Id)} className="btn btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteHighlight(highlight.Id)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Hotel Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Hotel Information</h2>
            <form onSubmit={handleSaveHotel}>
              <div className="form-group">
                <label>Hotel Name *</label>
                <input
                  type="text"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={hotelForm.email}
                  onChange={(e) => setHotelForm({...hotelForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile No *</label>
                <input
                  type="text"
                  value={hotelForm.mobileNo}
                  onChange={(e) => setHotelForm({...hotelForm, mobileNo: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <select
                  value={hotelForm.destinationId}
                  onChange={(e) => setHotelForm({...hotelForm, destinationId: e.target.value})}
                >
                  <option value="">Select Destination</option>
                  {destinations.map(dest => (
                    <option key={dest.Id} value={dest.Id}>{dest.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Cost Per Day</label>
                <input
                  type="number"
                  value={hotelForm.costPerDay}
                  onChange={(e) => setHotelForm({...hotelForm, costPerDay: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={hotelForm.location}
                  onChange={(e) => setHotelForm({...hotelForm, location: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({...hotelForm, address: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Hotel Type</label>
                <select
                  value={hotelForm.hotelTypeId}
                  onChange={(e) => setHotelForm({...hotelForm, hotelTypeId: e.target.value})}
                >
                  <option value="">Select Hotel Type</option>
                  {hotelTypes.map(type => (
                    <option key={type.Id} value={type.Id}>{type.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Star Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={hotelForm.starRating}
                  onChange={(e) => setHotelForm({...hotelForm, starRating: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Image 1</label>
                {hotelForm.image1 && !hotelForm.image1.startsWith('data:') && (
                  <div className="image-preview">
                    <img 
                      src={hotelForm.image1.startsWith('http') ? hotelForm.image1 : `${API_BASE_URL}/${hotelForm.image1}`}
                      alt="Current Image 1"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <span className="image-label">Current Image</span>
                  </div>
                )}
                {hotelForm.image1 && hotelForm.image1.startsWith('data:') && (
                  <div className="image-preview">
                    <img src={hotelForm.image1} alt="New Image 1" />
                    <span className="image-label">New Image (will replace current)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('image1', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 2</label>
                {hotelForm.image2 && !hotelForm.image2.startsWith('data:') && (
                  <div className="image-preview">
                    <img 
                      src={hotelForm.image2.startsWith('http') ? hotelForm.image2 : `${API_BASE_URL}/${hotelForm.image2}`}
                      alt="Current Image 2"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <span className="image-label">Current Image</span>
                  </div>
                )}
                {hotelForm.image2 && hotelForm.image2.startsWith('data:') && (
                  <div className="image-preview">
                    <img src={hotelForm.image2} alt="New Image 2" />
                    <span className="image-label">New Image (will replace current)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('image2', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 3</label>
                {hotelForm.image3 && !hotelForm.image3.startsWith('data:') && (
                  <div className="image-preview">
                    <img 
                      src={hotelForm.image3.startsWith('http') ? hotelForm.image3 : `${API_BASE_URL}/${hotelForm.image3}`}
                      alt="Current Image 3"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <span className="image-label">Current Image</span>
                  </div>
                )}
                {hotelForm.image3 && hotelForm.image3.startsWith('data:') && (
                  <div className="image-preview">
                    <img src={hotelForm.image3} alt="New Image 3" />
                    <span className="image-label">New Image (will replace current)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('image3', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 4</label>
                {hotelForm.image4 && !hotelForm.image4.startsWith('data:') && (
                  <div className="image-preview">
                    <img 
                      src={hotelForm.image4.startsWith('http') ? hotelForm.image4 : `${API_BASE_URL}/${hotelForm.image4}`}
                      alt="Current Image 4"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <span className="image-label">Current Image</span>
                  </div>
                )}
                {hotelForm.image4 && hotelForm.image4.startsWith('data:') && (
                  <div className="image-preview">
                    <img src={hotelForm.image4} alt="New Image 4" />
                    <span className="image-label">New Image (will replace current)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('image4', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 5</label>
                {hotelForm.image5 && !hotelForm.image5.startsWith('data:') && (
                  <div className="image-preview">
                    <img 
                      src={hotelForm.image5.startsWith('http') ? hotelForm.image5 : `${API_BASE_URL}/${hotelForm.image5}`}
                      alt="Current Image 5"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <span className="image-label">Current Image</span>
                  </div>
                )}
                {hotelForm.image5 && hotelForm.image5.startsWith('data:') && (
                  <div className="image-preview">
                    <img src={hotelForm.image5} alt="New Image 5" />
                    <span className="image-label">New Image (will replace current)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('image5', e.target.files[0])}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => {
          setShowRoomModal(false)
          setEditingRoom(null)
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
            <form onSubmit={handleSaveRoom}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={roomForm.title}
                  onChange={(e) => setRoomForm({...roomForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Cost *</label>
                <input
                  type="number"
                  value={roomForm.cost}
                  onChange={(e) => setRoomForm({...roomForm, cost: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Adults</label>
                <input
                  type="number"
                  min="1"
                  value={roomForm.adults}
                  onChange={(e) => setRoomForm({...roomForm, adults: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Kids</label>
                <input
                  type="number"
                  min="0"
                  value={roomForm.kids}
                  onChange={(e) => setRoomForm({...roomForm, kids: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Image 1</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleRoomImageChange('image1', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 2</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleRoomImageChange('image2', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 3</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleRoomImageChange('image3', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 4</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleRoomImageChange('image4', e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>Image 5</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleRoomImageChange('image5', e.target.files[0])}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowRoomModal(false)
                  setEditingRoom(null)
                }} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Highlight Modal */}
      {showHighlightModal && (
        <div className="modal-overlay" onClick={() => {
          setShowHighlightModal(false)
          setEditingHighlight(null)
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingHighlight ? 'Edit Highlight' : 'Add Highlight'}</h2>
            <form onSubmit={handleSaveHighlight}>
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={highlightForm.type}
                  onChange={(e) => setHighlightForm({...highlightForm, type: e.target.value})}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Highlight">Highlight</option>
                  <option value="Facility">Facility</option>
                  <option value="Inclusion">Inclusion</option>
                  <option value="Exclusion">Exclusion</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={highlightForm.description}
                  onChange={(e) => setHighlightForm({...highlightForm, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowHighlightModal(false)
                  setEditingHighlight(null)
                }} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingHighlight ? 'Update Highlight' : 'Add Highlight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HotelDashboard

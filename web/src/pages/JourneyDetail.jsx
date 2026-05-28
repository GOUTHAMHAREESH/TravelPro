import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './JourneyDetail.css'

const API_BASE_URL = 'http://localhost:61792'

const JourneyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [journey, setJourney] = useState(null)
  const [itinerary, setItinerary] = useState([])
  const [journeyDestinations, setJourneyDestinations] = useState([])
  const [destinations, setDestinations] = useState([])
  const [hotels, setHotels] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  
  // Data for each itinerary item
  const [itineraryData, setItineraryData] = useState({}) // { itineraryId: { directories: [], hotels: [], galleries: [], cabs: [] } }
  
  // Expanded state for itinerary items
  const [expandedItems, setExpandedItems] = useState({}) // { itineraryId: true/false }
  
  // Modal states
  const [showItineraryModal, setShowItineraryModal] = useState(false)
  const [showDirectoryModal, setShowDirectoryModal] = useState(false)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [showCabModal, setShowCabModal] = useState(false)
  const [showDestinationModal, setShowDestinationModal] = useState(false)
  const [selectedItineraryId, setSelectedItineraryId] = useState(null)

  // Form states
  const [itineraryForm, setItineraryForm] = useState({
    day: '',
    title: '',
    description: '',
    date: '',
    time: '',
    destinationId: ''
  })
  const [directoryForm, setDirectoryForm] = useState({
    contactType: '',
    contactNo: '',
    contactPerson: '',
    cost: '',
    description: '',
    destinationId: '',
    photo: ''
  })
  const [hotelForm, setHotelForm] = useState({
    hotelId: '',
    destinationId: ''
  })
  const [galleryForm, setGalleryForm] = useState({
    photo: ''
  })
  const [cabForm, setCabForm] = useState({
    vehicleId: '',
    destinationId: ''
  })
  const [destinationForm, setDestinationForm] = useState({
    destinationId: ''
  })

  useEffect(() => {
    if (id) {
      fetchJourney()
      fetchItinerary()
      fetchJourneyDestinations()
      fetchDestinations()
      fetchHotels()
      fetchVehicles()
    }
  }, [id])

  useEffect(() => {
    // Fetch data for each itinerary item when itinerary changes
    if (itinerary.length > 0) {
      const itineraryIds = itinerary.map(item => item.Id).filter(Boolean)
      console.log('Fetching data for itinerary items:', itineraryIds)
      itineraryIds.forEach(itemId => {
        fetchItineraryItemData(itemId)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary.map(item => item.Id).join(',')]) // Fetch when itinerary item IDs change

  const fetchJourney = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/GetJourneyById/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setJourney(data)
        } else {
          setError('Journey not found')
        }
      } else {
        setError('Failed to load journey')
      }
    } catch (err) {
      console.error('Error fetching journey:', err)
      setError('An error occurred while loading the journey')
    } finally {
      setLoading(false)
    }
  }

  const fetchItinerary = async () => {
    try {
      const endpoints = [
        `JourneyDetailListByJourney/${id}`,
        `JourneyDetailList/${id}`,
        `GetJourneyDetailByJourneyId/${id}`
      ]
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}/${endpoint}`)
          if (response.ok) {
            const data = await response.json()
            const sorted = (data || []).sort((a, b) => a.Day - b.Day)
            setItinerary(sorted)
            return
          }
        } catch (e) {
          continue
        }
      }
      setItinerary([])
    } catch (err) {
      console.error('Error fetching itinerary:', err)
      setItinerary([])
    }
  }

  const fetchJourneyDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/JourneyDestinationList/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJourneyDestinations(data || [])
      }
    } catch (err) {
      console.error('Error fetching journey destinations:', err)
      setJourneyDestinations([])
    }
  }

  const fetchItineraryItemData = async (itineraryDetailId) => {
    if (!itineraryDetailId) return
    
    try {
      console.log(`Fetching data for itinerary item ${itineraryDetailId}`)
      
      // Fetch all data for this itinerary item
      const [directoriesRes, hotelsRes, galleriesRes, cabsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/JourneyDirectoryList/${itineraryDetailId}`).catch(e => ({ ok: false, error: e })),
        fetch(`${API_BASE_URL}/JourneyHotelList/${itineraryDetailId}`).catch(e => ({ ok: false, error: e })),
        fetch(`${API_BASE_URL}/JourneyGalleryList/${itineraryDetailId}`).catch(e => ({ ok: false, error: e })),
        fetch(`${API_BASE_URL}/JourneyCabList/${itineraryDetailId}`).catch(e => ({ ok: false, error: e }))
      ])

      let directories = []
      let hotels = []
      let galleries = []
      let cabs = []

      if (directoriesRes.ok) {
        try {
          directories = await directoriesRes.json() || []
        } catch (e) {
          console.error(`Error parsing directories for item ${itineraryDetailId}:`, e)
        }
      } else {
        console.warn(`Failed to fetch directories for item ${itineraryDetailId}:`, directoriesRes.status || directoriesRes.error)
      }

      if (hotelsRes.ok) {
        try {
          hotels = await hotelsRes.json() || []
        } catch (e) {
          console.error(`Error parsing hotels for item ${itineraryDetailId}:`, e)
        }
      } else {
        console.warn(`Failed to fetch hotels for item ${itineraryDetailId}:`, hotelsRes.status || hotelsRes.error)
      }

      if (galleriesRes.ok) {
        try {
          galleries = await galleriesRes.json() || []
        } catch (e) {
          console.error(`Error parsing galleries for item ${itineraryDetailId}:`, e)
        }
      } else {
        console.warn(`Failed to fetch galleries for item ${itineraryDetailId}:`, galleriesRes.status || galleriesRes.error)
      }

      if (cabsRes.ok) {
        try {
          cabs = await cabsRes.json() || []
        } catch (e) {
          console.error(`Error parsing cabs for item ${itineraryDetailId}:`, e)
        }
      } else {
        console.warn(`Failed to fetch cabs for item ${itineraryDetailId}:`, cabsRes.status || cabsRes.error)
      }

      console.log(`Fetched data for item ${itineraryDetailId}:`, { directories: directories.length, hotels: hotels.length, galleries: galleries.length, cabs: cabs.length })

      setItineraryData(prev => ({
        ...prev,
        [itineraryDetailId]: {
          directories: directories || [],
          hotels: hotels || [],
          galleries: galleries || [],
          cabs: cabs || []
        }
      }))
    } catch (err) {
      console.error(`Error fetching itinerary item data for ${itineraryDetailId}:`, err)
      // Set empty arrays on error to prevent undefined state
      setItineraryData(prev => ({
        ...prev,
        [itineraryDetailId]: {
          directories: [],
          hotels: [],
          galleries: [],
          cabs: []
        }
      }))
    }
  }

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/DestinationList`)
      if (response.ok) {
        const data = await response.json()
        setDestinations(data || [])
      }
    } catch (err) {
      console.error('Error fetching destinations:', err)
      setDestinations([])
    }
  }

  const fetchHotels = async () => {
    try {
      const endpoints = ['HotelList', 'GetHotelList', 'HotelListAll']
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}/${endpoint}`)
          if (response.ok) {
            const data = await response.json()
            setHotels(data || [])
            return
          }
        } catch (e) {
          continue
        }
      }
      setHotels([])
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setHotels([])
    }
  }

  const fetchVehicles = async () => {
    try {
      const endpoints = ['VehicleList', 'GetVehicleList', 'VehicleListAll']
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}/${endpoint}`)
          if (response.ok) {
            const data = await response.json()
            setVehicles(data || [])
            return
          }
        } catch (e) {
          continue
        }
      }
      setVehicles([])
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      setVehicles([])
    }
  }

  const handleAddItinerary = async (e) => {
    e.preventDefault()
    if (!journey) return
    if (!itineraryForm.destinationId) {
      alert('Please select a destination.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        Id: 0,
        Day: parseInt(itineraryForm.day),
        Title: itineraryForm.title,
        Description: itineraryForm.description,
        Date: itineraryForm.date,
        Time: itineraryForm.time,
        JourneyId: parseInt(id),
        DestinationId: parseInt(itineraryForm.destinationId)
      }

      const response = await fetch(`${API_BASE_URL}/AddJourneyDetail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Itinerary item added successfully!')
          setShowItineraryModal(false)
          setItineraryForm({ day: '', title: '', description: '', date: '', time: '', destinationId: '' })
          // Refresh itinerary list
          await fetchItinerary()
        }
      }
    } catch (error) {
      console.error('Error adding itinerary:', error)
      alert('Failed to add itinerary item')
    } finally {
      setSaving(false)
    }
  }

  const handleAddDirectory = async (e) => {
    e.preventDefault()
    if (!selectedItineraryId || !journey) return

    setSaving(true)
    try {
      const payload = {
        Id: 0,
        ContactType: directoryForm.contactType,
        ContactNo: directoryForm.contactNo,
        ContactPerson: directoryForm.contactPerson,
        Cost: directoryForm.cost ? parseFloat(directoryForm.cost) : 0,
        Description: directoryForm.description,
        DestinationId: directoryForm.destinationId ? parseInt(directoryForm.destinationId) : null,
        JourneyDetailId: parseInt(selectedItineraryId),
        JourneyId: parseInt(id),
        Photo: directoryForm.photo || ''
      }

      const response = await fetch(`${API_BASE_URL}/AddJourneyDirectory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Directory added successfully!')
          setShowDirectoryModal(false)
          const tempId = selectedItineraryId
          setDirectoryForm({ contactType: '', contactNo: '', contactPerson: '', cost: '', description: '', destinationId: '', photo: '' })
          setSelectedItineraryId(null)
          fetchItineraryItemData(tempId)
        }
      }
    } catch (error) {
      console.error('Error adding directory:', error)
      alert('Failed to add directory')
    } finally {
      setSaving(false)
    }
  }

  const handleAddHotel = async (e) => {
    e.preventDefault()
    if (!selectedItineraryId || !journey) return

    setSaving(true)
    try {
      const payload = {
        Id: 0,
        HotelId: parseInt(hotelForm.hotelId),
        DestinationId: hotelForm.destinationId ? parseInt(hotelForm.destinationId) : null,
        JourneyDetailId: parseInt(selectedItineraryId),
        JourneyId: parseInt(id)
      }

      const response = await fetch(`${API_BASE_URL}/AddJourneyHotel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Hotel added successfully!')
          setShowHotelModal(false)
          const tempId = selectedItineraryId
          setHotelForm({ hotelId: '', destinationId: '' })
          setSelectedItineraryId(null)
          fetchItineraryItemData(tempId)
        }
      }
    } catch (error) {
      console.error('Error adding hotel:', error)
      alert('Failed to add hotel')
    } finally {
      setSaving(false)
    }
  }

  const handleAddGallery = async (e) => {
    e.preventDefault()
    if (!selectedItineraryId || !journey) return

    setSaving(true)
    try {
      const payload = {
        Id: 0,
        JourneyDetailId: parseInt(selectedItineraryId),
        JourneyId: parseInt(id),
        Photo: galleryForm.photo || ''
      }

      const response = await fetch(`${API_BASE_URL}/AddJourneyGallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Gallery photo added successfully!')
          setShowGalleryModal(false)
          const tempId = selectedItineraryId
          setGalleryForm({ photo: '' })
          setSelectedItineraryId(null)
          fetchItineraryItemData(tempId)
        }
      }
    } catch (error) {
      console.error('Error adding gallery:', error)
      alert('Failed to add gallery photo')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCab = async (e) => {
    e.preventDefault()
    if (!selectedItineraryId || !journey) return

    setSaving(true)
    try {
      const payload = {
        Id: 0,
        VehicleId: parseInt(cabForm.vehicleId),
        DestinationId: cabForm.destinationId ? parseInt(cabForm.destinationId) : null,
        JourneyDetailId: parseInt(selectedItineraryId),
        JourneyId: parseInt(id)
      }

      const response = await fetch(`${API_BASE_URL}/AddJourneyCab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Cab added successfully!')
          setShowCabModal(false)
          const tempId = selectedItineraryId
          setCabForm({ vehicleId: '', destinationId: '' })
          setSelectedItineraryId(null)
          fetchItineraryItemData(tempId)
        }
      }
    } catch (error) {
      console.error('Error adding cab:', error)
      alert('Failed to add cab')
    } finally {
      setSaving(false)
    }
  }

  const handleAddDestination = async (e) => {
    e.preventDefault()
    if (!journey) return

    setSaving(true)
    try {
      const payload = {
        Id: 0,
        JourneyId: parseInt(id),
        DestinationId: parseInt(destinationForm.destinationId)
      }

      const response = await fetch(`${API_BASE_URL}/AddJourneyDestination`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Destination added successfully!')
          setShowDestinationModal(false)
          setDestinationForm({ destinationId: '' })
          fetchJourneyDestinations()
        }
      }
    } catch (error) {
      console.error('Error adding destination:', error)
      alert('Failed to add destination')
    } finally {
      setSaving(false)
    }
  }

  const toggleItineraryItem = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const handleDelete = async (type, itemId, itineraryDetailId = null) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return
    }

    try {
      const endpoints = {
        destination: `DeleteJourneyDestination/${itemId}`,
        directory: `DeleteJourneyDirectory/${itemId}`,
        gallery: `DeleteJourneyGallery/${itemId}`,
        hotel: `DeleteJourneyHotel/${itemId}`,
        cab: `DeleteJourneyCab/${itemId}`
      }

      const response = await fetch(`${API_BASE_URL}/${endpoints[type]}`, {
        method: 'GET'
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`)
          
          if (type === 'destination') {
            fetchJourneyDestinations()
          } else if (itineraryDetailId) {
            // Refresh data for the specific itinerary item
            fetchItineraryItemData(itineraryDetailId)
          } else {
            // Fallback: refresh all itinerary items
            itinerary.forEach(item => {
              fetchItineraryItemData(item.Id)
            })
          }
        }
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      alert(`Failed to delete ${type}`)
    }
  }

  const handlePhotoChange = (e, setForm) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
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

  if (loading) {
    return (
      <div className="journey-detail-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading journey details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !journey) {
    return (
      <div className="journey-detail-page">
        <div className="container">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error || 'Journey not found'}</p>
            <Link to="/my-travels" className="btn btn-primary">
              Back to My Travels
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = user?.Role === 'Customer' && user?.CustomerId === journey.CustomerId

  return (
    <div className="journey-detail-page">
      <div className="journey-header">
        <div className="container">
          <button onClick={() => navigate('/my-travels')} className="back-btn">
            ← Back to My Travels
          </button>
          <h1>{journey.Title}</h1>
          {journey.Customer && (
            <p className="journey-author">By {journey.Customer.Name}</p>
          )}
        </div>
      </div>

      <div className="journey-container">
        <div className="container">
          <div className="journey-content">
            {journey.Photo && (
              <div className="journey-image">
                <img 
                  src={journey.Photo.startsWith('http') ? journey.Photo : `${API_BASE_URL}/${journey.Photo}`}
                  alt={journey.Title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'
                  }}
                />
              </div>
            )}

            <div className="journey-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Start Date:</label>
                  <span>{formatDate(journey.DateFrom)}</span>
                </div>
                <div className="info-item">
                  <label>End Date:</label>
                  <span>{formatDate(journey.DateTo)}</span>
                </div>
                <div className="info-item">
                  <label>Duration:</label>
                  <span>{journey.NoOfDays} day(s)</span>
                </div>
              </div>
            </div>

            {journey.Description && (
              <div className="journey-description">
                <h2>Description</h2>
                <p>{journey.Description}</p>
              </div>
            )}

            {/* Journey Destinations Section */}
            <div className="destinations-section">
              <div className="section-header">
                <h2>Destinations</h2>
                {isOwner && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowDestinationModal(true)}
                  >
                    + Add Destination
                  </button>
                )}
              </div>

              {journeyDestinations.length === 0 ? (
                <div className="no-items">
                  <p>No destinations added yet.</p>
                </div>
              ) : (
                <div className="destinations-list">
                  {journeyDestinations.map(dest => (
                    <div key={dest.Id} className="destination-item">
                      <span>{dest.Destination?.Name}</span>
                      {isOwner && (
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete('destination', dest.Id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Itinerary Section */}
            <div className="itinerary-section">
              <div className="section-header">
                <h2>Travel Itinerary</h2>
                {isOwner && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowItineraryModal(true)}
                  >
                    + Add Itinerary Item
                  </button>
                )}
              </div>

              {itinerary.length === 0 ? (
                <div className="no-items">
                  <p>No itinerary items yet. Add your first item to get started!</p>
                </div>
              ) : (
                <div className="itinerary-list">
                  {itinerary.map((item) => {
                    const itemData = itineraryData[item.Id] || { directories: [], hotels: [], galleries: [], cabs: [] }
                    const isExpanded = expandedItems[item.Id] === true // Default to collapsed (false)
                    return (
                      <div key={item.Id} className="itinerary-item">
                        <div className="itinerary-header">
                          <div className="itinerary-title-section">
                            <button 
                              className="btn-collapse"
                              onClick={() => toggleItineraryItem(item.Id)}
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? '▼' : '▶'}
                            </button>
                            <h3>Day {item.Day}: {item.Title}</h3>
                          </div>
                          {isOwner && (
                            <div className="itinerary-actions">
                              <button 
                                className="btn-icon" 
                                onClick={() => {
                                  setSelectedItineraryId(item.Id)
                                  setShowDirectoryModal(true)
                                }}
                                title="Add Directory"
                              >
                                📞
                              </button>
                              <button 
                                className="btn-icon"
                                onClick={() => {
                                  setSelectedItineraryId(item.Id)
                                  setShowHotelModal(true)
                                }}
                                title="Add Hotel"
                              >
                                🏨
                              </button>
                              <button 
                                className="btn-icon"
                                onClick={() => {
                                  setSelectedItineraryId(item.Id)
                                  setShowGalleryModal(true)
                                }}
                                title="Add Gallery Photo"
                              >
                                📷
                              </button>
                              <button 
                                className="btn-icon"
                                onClick={() => {
                                  setSelectedItineraryId(item.Id)
                                  setShowCabModal(true)
                                }}
                                title="Add Cab"
                              >
                                🚗
                              </button>
                            </div>
                          )}
                        </div>
                        {item.Date && (
                          <p className="itinerary-date">📅 {formatDate(item.Date)} {item.Time && `at ${item.Time}`}</p>
                        )}
                        {item.Description && (
                          <p className="itinerary-description">{item.Description}</p>
                        )}

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="itinerary-content">
                            {/* Directories */}
                        <div className="item-subsection">
                          <h4>📞 Directories</h4>
                          {itemData.directories && itemData.directories.length > 0 ? (
                            <div className="sub-item-list">
                              {itemData.directories.map(dir => (
                                <div key={dir.Id} className="sub-item">
                                  <div className="sub-item-content">
                                    <strong>{dir.ContactType}</strong>
                                    {dir.ContactPerson && <span> - {dir.ContactPerson}</span>}
                                    {dir.ContactNo && <span> ({dir.ContactNo})</span>}
                                    {dir.Cost > 0 && <span> - ₹{dir.Cost}</span>}
                                    {dir.Description && <p>{dir.Description}</p>}
                                    {dir.Photo && (
                                      <img 
                                        src={dir.Photo.startsWith('http') ? dir.Photo : `${API_BASE_URL}/${dir.Photo}`}
                                        alt={dir.ContactType}
                                        className="sub-item-photo"
                                        onError={(e) => e.target.style.display = 'none'}
                                      />
                                    )}
                                  </div>
                                  {isOwner && (
                                    <button 
                                      className="btn-delete-small"
                                      onClick={() => handleDelete('directory', dir.Id, item.Id)}
                                    >
                                      🗑️
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-items">
                              <p>No directories added yet.</p>
                            </div>
                          )}
                        </div>

                        {/* Hotels */}
                        <div className="item-subsection">
                          <h4>🏨 Hotels</h4>
                          {itemData.hotels && itemData.hotels.length > 0 ? (
                            <div className="sub-item-list">
                              {itemData.hotels.map(hotel => (
                                <div key={hotel.Id} className="sub-item">
                                  <div className="sub-item-content">
                                    {hotel.Hotel?.Id ? (
                                      <Link to={`/hotels/${hotel.Hotel.Id}`}>
                                        <strong>{hotel.Hotel.Name}</strong>
                                      </Link>
                                    ) : (
                                      <strong>{hotel.Hotel?.Name}</strong>
                                    )}
                                    {hotel.Destination && <span> - {hotel.Destination.Name}</span>}
                                  </div>
                                  {isOwner && (
                                    <button 
                                      className="btn-delete-small"
                                      onClick={() => handleDelete('hotel', hotel.Id, item.Id)}
                                    >
                                      🗑️
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-items">
                              <p>No hotels added yet.</p>
                            </div>
                          )}
                        </div>

                        {/* Gallery */}
                        <div className="item-subsection">
                          <h4>📷 Gallery</h4>
                          {itemData.galleries && itemData.galleries.length > 0 ? (
                            <div className="gallery-grid">
                              {itemData.galleries.map(gallery => (
                                <div key={gallery.Id} className="gallery-item">
                                  <img 
                                    src={gallery.Photo.startsWith('http') ? gallery.Photo : `${API_BASE_URL}/${gallery.Photo}`}
                                    alt="Gallery"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
                                    }}
                                  />
                                  {isOwner && (
                                    <button 
                                      className="btn-delete-overlay"
                                      onClick={() => handleDelete('gallery', gallery.Id, item.Id)}
                                    >
                                      🗑️
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-items">
                              <p>No gallery photos added yet.</p>
                            </div>
                          )}
                        </div>

                        {/* Cabs */}
                        <div className="item-subsection">
                          <h4>🚗 Cabs</h4>
                          {itemData.cabs && itemData.cabs.length > 0 ? (
                            <div className="sub-item-list">
                              {itemData.cabs.map(cab => (
                                <div key={cab.Id} className="sub-item">
                                  <div className="sub-item-content">
                                    {cab.Vehicle?.Id ? (
                                      <Link to={`/cabs/${cab.Vehicle.Id}`}>
                                        <strong>{cab.Vehicle.Model}</strong>
                                      </Link>
                                    ) : (
                                      <strong>{cab.Vehicle?.Model}</strong>
                                    )}
                                    {cab.Vehicle?.Rate && <span> - ₹{cab.Vehicle.Rate}</span>}
                                    {cab.Destination && <span> - {cab.Destination.Name}</span>}
                                  </div>
                                  {isOwner && (
                                    <button 
                                      className="btn-delete-small"
                                      onClick={() => handleDelete('cab', cab.Id, item.Id)}
                                    >
                                      🗑️
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-items">
                              <p>No cabs added yet.</p>
                            </div>
                          )}
                        </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Itinerary Modal */}
      {showItineraryModal && (
        <div className="modal-overlay" onClick={() => setShowItineraryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowItineraryModal(false)}>×</button>
            <h2>Add Itinerary Item</h2>
            <form onSubmit={handleAddItinerary}>
              <div className="form-group">
                <label>Day *</label>
                <input
                  type="number"
                  value={itineraryForm.day}
                  onChange={(e) => setItineraryForm({...itineraryForm, day: e.target.value})}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={itineraryForm.title}
                  onChange={(e) => setItineraryForm({...itineraryForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={itineraryForm.description}
                  onChange={(e) => setItineraryForm({...itineraryForm, description: e.target.value})}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={itineraryForm.date}
                  onChange={(e) => setItineraryForm({...itineraryForm, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={itineraryForm.time}
                  onChange={(e) => setItineraryForm({...itineraryForm, time: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Destination *</label>
                <select
                  value={itineraryForm.destinationId}
                  onChange={(e) => setItineraryForm({...itineraryForm, destinationId: e.target.value})}
                  required
                >
                  <option value="">Select destination</option>
                  {journeyDestinations.map((jd) => (
                    <option key={jd.Id} value={jd.Destination?.Id || jd.DestinationId}>
                      {jd.Destination?.Name || `Destination ${jd.DestinationId}`}
                    </option>
                  ))}
                </select>
                {journeyDestinations.length === 0 && (
                  <small className="form-hint">Add destinations to this travel first to select one here.</small>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Item'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowItineraryModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Directory Modal */}
      {showDirectoryModal && (
        <div className="modal-overlay" onClick={() => setShowDirectoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDirectoryModal(false)}>×</button>
            <h2>Add Directory</h2>
            <form onSubmit={handleAddDirectory}>
              <div className="form-group">
                <label>Contact Type *</label>
                <input
                  type="text"
                  value={directoryForm.contactType}
                  onChange={(e) => setDirectoryForm({...directoryForm, contactType: e.target.value})}
                  required
                  placeholder="e.g., Restaurant, Guide, Shop"
                />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  value={directoryForm.contactPerson}
                  onChange={(e) => setDirectoryForm({...directoryForm, contactPerson: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={directoryForm.contactNo}
                  onChange={(e) => setDirectoryForm({...directoryForm, contactNo: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={directoryForm.cost}
                  onChange={(e) => setDirectoryForm({...directoryForm, cost: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={directoryForm.description}
                  onChange={(e) => setDirectoryForm({...directoryForm, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <select
                  value={directoryForm.destinationId}
                  onChange={(e) => setDirectoryForm({...directoryForm, destinationId: e.target.value})}
                >
                  <option value="">Select Destination</option>
                  {destinations.map(dest => (
                    <option key={dest.Id} value={dest.Id}>{dest.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e, setDirectoryForm)}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Directory'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDirectoryModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Hotel Modal */}
      {showHotelModal && (
        <div className="modal-overlay" onClick={() => setShowHotelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowHotelModal(false)}>×</button>
            <h2>Add Hotel</h2>
            <form onSubmit={handleAddHotel}>
              <div className="form-group">
                <label>Hotel *</label>
                <select
                  value={hotelForm.hotelId}
                  onChange={(e) => setHotelForm({...hotelForm, hotelId: e.target.value})}
                  required
                >
                  <option value="">Select Hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel.Id} value={hotel.Id}>{hotel.Name}</option>
                  ))}
                </select>
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
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Hotel'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowHotelModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Gallery Modal */}
      {showGalleryModal && (
        <div className="modal-overlay" onClick={() => setShowGalleryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowGalleryModal(false)}>×</button>
            <h2>Add Gallery Photo</h2>
            <form onSubmit={handleAddGallery}>
              <div className="form-group">
                <label>Photo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e, setGalleryForm)}
                  required
                />
                {galleryForm.photo && (
                  <img src={galleryForm.photo} alt="Preview" style={{maxWidth: '200px', marginTop: '10px', borderRadius: '5px'}} />
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Photo'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowGalleryModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cab Modal */}
      {showCabModal && (
        <div className="modal-overlay" onClick={() => setShowCabModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCabModal(false)}>×</button>
            <h2>Add Cab</h2>
            <form onSubmit={handleAddCab}>
              <div className="form-group">
                <label>Vehicle *</label>
                <select
                  value={cabForm.vehicleId}
                  onChange={(e) => setCabForm({...cabForm, vehicleId: e.target.value})}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.Id} value={vehicle.Id}>
                      {vehicle.Model} {vehicle.Rate && `- ₹${vehicle.Rate}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Destination</label>
                <select
                  value={cabForm.destinationId}
                  onChange={(e) => setCabForm({...cabForm, destinationId: e.target.value})}
                >
                  <option value="">Select Destination</option>
                  {destinations.map(dest => (
                    <option key={dest.Id} value={dest.Id}>{dest.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Cab'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCabModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      {showDestinationModal && (
        <div className="modal-overlay" onClick={() => setShowDestinationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDestinationModal(false)}>×</button>
            <h2>Add Destination</h2>
            <form onSubmit={handleAddDestination}>
              <div className="form-group">
                <label>Destination *</label>
                <select
                  value={destinationForm.destinationId}
                  onChange={(e) => setDestinationForm({...destinationForm, destinationId: e.target.value})}
                  required
                >
                  <option value="">Select Destination</option>
                  {destinations.map(dest => (
                    <option key={dest.Id} value={dest.Id}>{dest.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Destination'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDestinationModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JourneyDetail

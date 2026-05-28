import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import './DriverDashboard.css'

const API_BASE_URL = 'http://localhost:61792'

const DriverDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Driver edit form
  const [showEditModal, setShowEditModal] = useState(false)
  const [driverForm, setDriverForm] = useState({
    name: '',
    emailId: '',
    mobileNo: '',
    location: '',
    address: '',
    licenseNo: '',
    adharNo: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    countryId: '',
    destinationId: '',
    photo: ''
  })
  
  // Vehicle form
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [vehicleForm, setVehicleForm] = useState({
    model: '',
    year: '',
    fuelType: '',
    transmission: '',
    color: '',
    noOfSeat: '',
    rate: '',
    brandId: '',
    vehicleTypeId: '',
    milage: '',
    pollutionExpiry: '',
    pollutionDocNo: '',
    insuranceDocNo: '',
    insuranceExpiry: '',
    registrationNo: '',
    registrationExpiryDate: '',
    luggage: false,
    sensors: false,
    bluetooth: false,
    camera: false,
    lcd: false,
    safety: false,
    musicSystem: false,
    wifi: false,
    ac: false,
    gps: false,
    image1: ''
  })
  
  const [countries, setCountries] = useState([])
  const [destinations, setDestinations] = useState([])
  const [brands, setBrands] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])

  useEffect(() => {
    if (user && user.Role === 'Driver' && user.DriverId) {
      fetchBookings()
      fetchVehicles()
      fetchCountries()
      fetchDestinations()
      fetchBrands()
      fetchVehicleTypes()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user?.DriverId) return
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/CabBookingByDriverId/${user.DriverId}`)
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
        Date: booking.Date,
        Time: booking.Time,
        TotalKmS: booking.TotalKmS,
        TotalAmount: booking.TotalAmount,
        Rating: booking.Rating || 0,
        Review: booking.Review || '',
        Status: status,
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
          fetchBookings()
        } else {
          alert('Failed to update booking status')
        }
      } else {
        alert('Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Error updating booking status')
    }
  }

  const fetchVehicles = async () => {
    if (!user?.DriverId) return
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/VehicleListByDriverId/${user.DriverId}`)
      if (response.ok) {
        const data = await response.json()
        setVehicles(data || [])
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/CountryList`)
      if (response.ok) {
        const data = await response.json()
        setCountries(data || [])
      }
    } catch (error) {
      console.error('Error fetching countries:', error)
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

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/BrandList`)
      if (response.ok) {
        const data = await response.json()
        setBrands(data || [])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      // If BrandList doesn't exist, try alternative endpoints
      try {
        const altResponse = await fetch(`${API_BASE_URL}/GetBrandList`)
        if (altResponse.ok) {
          const data = await altResponse.json()
          setBrands(data || [])
        }
      } catch (e) {
        console.error('Brand list not available')
      }
    }
  }

  const fetchVehicleTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/VehicleTypeList`)
      if (response.ok) {
        const data = await response.json()
        setVehicleTypes(data || [])
      }
    } catch (error) {
      console.error('Error fetching vehicle types:', error)
      // If VehicleTypeList doesn't exist, try alternative endpoints
      try {
        const altResponse = await fetch(`${API_BASE_URL}/GetVehicleTypeList`)
        if (altResponse.ok) {
          const data = await altResponse.json()
          setVehicleTypes(data || [])
        }
      } catch (e) {
        console.error('Vehicle type list not available')
      }
    }
  }

  const fetchDriverDetails = async () => {
    if (!user?.DriverId) return
    try {
      const response = await fetch(`${API_BASE_URL}/DriverById/${user.DriverId}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setDriverForm({
            name: data.Name || '',
            emailId: data.EmailId || '',
            mobileNo: data.MobileNo || '',
            location: data.Location || '',
            address: data.Address || '',
            licenseNo: data.LicenseNo || '',
            adharNo: data.AdharNo || '',
            licenseIssueDate: data.LicenseIssueDate ? data.LicenseIssueDate.split('T')[0] : '',
            licenseExpiryDate: data.LicenseExpiryDate ? data.LicenseExpiryDate.split('T')[0] : '',
            countryId: data.CountryId ? data.CountryId.toString() : '',
            destinationId: data.DestinationId ? data.DestinationId.toString() : '',
            photo: data.Photo || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching driver details:', error)
    }
  }

  const handleImageChange = (field, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (field === 'photo') {
          setDriverForm({ ...driverForm, [field]: reader.result })
        } else {
          setVehicleForm({ ...vehicleForm, [field]: reader.result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveDriver = async (e) => {
    e.preventDefault()
    if (!user?.DriverId) return
    
    setSaving(true)
    try {
      const payload = {
        Id: user.DriverId,
        Name: driverForm.name,
        EmailId: driverForm.emailId,
        MobileNo: driverForm.mobileNo,
        Location: driverForm.location,
        Address: driverForm.address,
        LicenseNo: driverForm.licenseNo,
        AdharNo: driverForm.adharNo,
        LicenseIssueDate: driverForm.licenseIssueDate,
        LicenseExpiryDate: driverForm.licenseExpiryDate,
        CountryId: driverForm.countryId ? parseInt(driverForm.countryId) : null,
        DestinationId: driverForm.destinationId ? parseInt(driverForm.destinationId) : null,
        Photo: driverForm.photo || ''
      }

      const response = await fetch(`${API_BASE_URL}/AddDriver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Driver information updated successfully!')
          setShowEditModal(false)
        }
      }
    } catch (error) {
      console.error('Error updating driver:', error)
      alert('Failed to update driver information')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveVehicle = async (e) => {
    e.preventDefault()
    if (!user?.DriverId) return
    
    setSaving(true)
    try {
      const payload = {
        Id: editingVehicle ? editingVehicle.Id : 0,
        DriverId: user.DriverId,
        Model: vehicleForm.model,
        Year: vehicleForm.year ? parseInt(vehicleForm.year) : null,
        FuelType: vehicleForm.fuelType,
        Transmission: vehicleForm.transmission,
        Color: vehicleForm.color,
        NoOfSeat: vehicleForm.noOfSeat ? parseInt(vehicleForm.noOfSeat) : 0,
        Rate: vehicleForm.rate ? parseFloat(vehicleForm.rate) : 0,
        BrandId: vehicleForm.brandId ? parseInt(vehicleForm.brandId) : null,
        VehicleTypeId: vehicleForm.vehicleTypeId ? parseInt(vehicleForm.vehicleTypeId) : null,
        Milage: vehicleForm.milage || '',
        PollutionExpiry: vehicleForm.pollutionExpiry || '',
        PollutionDocNo: vehicleForm.pollutionDocNo || '',
        InsuranceDocNo: vehicleForm.insuranceDocNo || '',
        InsuranceExpiry: vehicleForm.insuranceExpiry || '',
        RegistrationNo: vehicleForm.registrationNo || '',
        RegistrationExpiryDate: vehicleForm.registrationExpiryDate || '',
        Luggage: vehicleForm.luggage,
        Sensors: vehicleForm.sensors,
        Bluetooth: vehicleForm.bluetooth,
        Camera: vehicleForm.camera,
        LCD: vehicleForm.lcd,
        Safety: vehicleForm.safety,
        MusicSystem: vehicleForm.musicSystem,
        Wifi: vehicleForm.wifi,
        AC: vehicleForm.ac,
        GPS: vehicleForm.gps,
        Image1: vehicleForm.image1 || ''
      }

      const response = await fetch(`${API_BASE_URL}/AddVehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert(editingVehicle ? 'Vehicle updated successfully!' : 'Vehicle added successfully!')
          setShowVehicleModal(false)
          setEditingVehicle(null)
          setVehicleForm({
            model: '',
            year: '',
            fuelType: '',
            transmission: '',
            color: '',
            noOfSeat: '',
            rate: '',
            brandId: '',
            vehicleTypeId: '',
            milage: '',
            pollutionExpiry: '',
            pollutionDocNo: '',
            insuranceDocNo: '',
            insuranceExpiry: '',
            registrationNo: '',
            registrationExpiryDate: '',
            luggage: false,
            sensors: false,
            bluetooth: false,
            camera: false,
            lcd: false,
            safety: false,
            musicSystem: false,
            wifi: false,
            ac: false,
            gps: false,
            image1: ''
          })
          fetchVehicles()
        }
      }
    } catch (error) {
      console.error('Error saving vehicle:', error)
      alert('Failed to save vehicle')
    } finally {
      setSaving(false)
    }
  }

  const handleEditVehicle = (vehicleId) => {
    const vehicle = vehicles.find(v => v.Id === vehicleId)
    if (vehicle) {
      setEditingVehicle(vehicle)
      setVehicleForm({
        model: vehicle.Model || '',
        year: vehicle.Year ? vehicle.Year.toString() : '',
        fuelType: vehicle.FuelType || '',
        transmission: vehicle.Transmission || '',
        color: vehicle.Color || '',
        noOfSeat: vehicle.NoOfSeat ? vehicle.NoOfSeat.toString() : '',
        rate: vehicle.Rate ? vehicle.Rate.toString() : '',
        brandId: vehicle.BrandId ? vehicle.BrandId.toString() : '',
        vehicleTypeId: vehicle.VehicleTypeId ? vehicle.VehicleTypeId.toString() : '',
        milage: vehicle.Milage || '',
        pollutionExpiry: vehicle.PollutionExpiry || '',
        pollutionDocNo: vehicle.PollutionDocNo || '',
        insuranceDocNo: vehicle.InsuranceDocNo || '',
        insuranceExpiry: vehicle.InsuranceExpiry || '',
        registrationNo: vehicle.RegistrationNo || '',
        registrationExpiryDate: vehicle.RegistrationExpiryDate || '',
        luggage: vehicle.Luggage || false,
        sensors: vehicle.Sensors || false,
        bluetooth: vehicle.Bluetooth || false,
        camera: vehicle.Camera || false,
        lcd: vehicle.LCD || false,
        safety: vehicle.Safety || false,
        musicSystem: vehicle.MusicSystem || false,
        wifi: vehicle.Wifi || false,
        ac: vehicle.AC || false,
        gps: vehicle.GPS || false,
        image1: vehicle.Image1 || ''
      })
      setShowVehicleModal(true)
    }
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/DeleteVehicle/${vehicleId}`, {
        method: 'GET'
      })
      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Vehicle deleted successfully!')
          fetchVehicles()
        }
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Failed to delete vehicle')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return ''
    const date = formatDate(dateString)
    return timeString ? `${date} at ${timeString}` : date
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''
    if (imagePath.startsWith('http')) return imagePath
    return `${API_BASE_URL}/${imagePath}`
  }

  if (!user || user.Role !== 'Driver') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <h2>Access Denied</h2>
          <p>You need to be logged in as a Driver to access this page.</p>
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
        <h1>Driver Dashboard</h1>
        <p>Welcome back, {user.Name}!</p>
      </div>

      <div className="driver-dashboard-tabs">
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
          Edit Profile
        </button>
        <button 
          className={activeTab === 'vehicles' ? 'active' : ''}
          onClick={() => setActiveTab('vehicles')}
        >
          Vehicles
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'bookings' && (
          <div className="dashboard-card">
            <h2>Cab Bookings</h2>
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
                      <th>Vehicle</th>
                      <th>Date & Time</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Distance</th>
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
                        <td>{booking.Vehicle?.Model}</td>
                        <td>{formatDateTime(booking.Date, booking.Time)}</td>
                        <td>{booking.LocationFrom}</td>
                        <td>{booking.LocationTo}</td>
                        <td>{booking.TotalKmS} km</td>
                        <td>₹{booking.TotalAmount}</td>
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
              <h2>Edit Driver Profile</h2>
              <button onClick={() => {
                fetchDriverDetails()
                setShowEditModal(true)
              }} className="btn btn-primary">
                Edit Profile
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
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
                <label>Driver ID:</label>
                <span>{user.DriverId}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>My Vehicles</h2>
              <button onClick={() => {
                setEditingVehicle(null)
                setVehicleForm({
                  model: '',
                  year: '',
                  fuelType: '',
                  transmission: '',
                  color: '',
                  noOfSeat: '',
                  rate: '',
                  brandId: '',
                  vehicleTypeId: '',
                  milage: '',
                  pollutionExpiry: '',
                  pollutionDocNo: '',
                  insuranceDocNo: '',
                  insuranceExpiry: '',
                  registrationNo: '',
                  registrationExpiryDate: '',
                  luggage: false,
                  sensors: false,
                  bluetooth: false,
                  camera: false,
                  lcd: false,
                  safety: false,
                  musicSystem: false,
                  wifi: false,
                  ac: false,
                  gps: false,
                  image1: ''
                })
                setShowVehicleModal(true)
              }} className="btn btn-primary">
                Add Vehicle
              </button>
            </div>
            {loading ? (
              <p>Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <p>No vehicles found. Add your first vehicle to get started.</p>
            ) : (
              <div className="vehicles-grid">
                {vehicles.map(vehicle => (
                  <div key={vehicle.Id} className="vehicle-card">
                    {vehicle.Image1 && (
                      <img 
                        src={getImageUrl(vehicle.Image1)}
                        alt={vehicle.Model}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div className="vehicle-info">
                      <h3>{vehicle.Model}</h3>
                      {vehicle.Brand && <p>Brand: {vehicle.Brand.Name}</p>}
                      {vehicle.VehicleType && <p>Type: {vehicle.VehicleType.Name}</p>}
                      <p>Rate: ₹{vehicle.Rate} per km</p>
                      <div className="vehicle-actions">
                        <button onClick={() => handleEditVehicle(vehicle.Id)} className="btn btn-secondary">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteVehicle(vehicle.Id)} className="btn btn-danger">
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
      </div>

      {/* Edit Driver Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            <h2>Edit Driver Profile</h2>
            <form onSubmit={handleSaveDriver}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({...driverForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={driverForm.emailId}
                  onChange={(e) => setDriverForm({...driverForm, emailId: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile No *</label>
                <input
                  type="text"
                  value={driverForm.mobileNo}
                  onChange={(e) => setDriverForm({...driverForm, mobileNo: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={driverForm.location}
                  onChange={(e) => setDriverForm({...driverForm, location: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={driverForm.address}
                  onChange={(e) => setDriverForm({...driverForm, address: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>License No *</label>
                <input
                  type="text"
                  value={driverForm.licenseNo}
                  onChange={(e) => setDriverForm({...driverForm, licenseNo: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Aadhar No *</label>
                <input
                  type="text"
                  value={driverForm.adharNo}
                  onChange={(e) => setDriverForm({...driverForm, adharNo: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>License Issue Date</label>
                  <input
                    type="date"
                    value={driverForm.licenseIssueDate}
                    onChange={(e) => setDriverForm({...driverForm, licenseIssueDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>License Expiry Date</label>
                  <input
                    type="date"
                    value={driverForm.licenseExpiryDate}
                    onChange={(e) => setDriverForm({...driverForm, licenseExpiryDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select
                    value={driverForm.countryId}
                    onChange={(e) => setDriverForm({...driverForm, countryId: e.target.value})}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.Id} value={country.Id}>{country.Name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <select
                    value={driverForm.destinationId}
                    onChange={(e) => setDriverForm({...driverForm, destinationId: e.target.value})}
                  >
                    <option value="">Select Destination</option>
                    {destinations.map(destination => (
                      <option key={destination.Id} value={destination.Id}>{destination.Name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('photo', e.target.files[0])}
                />
                {driverForm.photo && (
                  <img 
                    src={driverForm.photo.startsWith('http') ? driverForm.photo : getImageUrl(driverForm.photo)} 
                    alt="Driver"
                    className="preview-image"
                  />
                )}
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="modal-overlay" onClick={() => {
          setShowVehicleModal(false)
          setEditingVehicle(null)
        }}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => {
              setShowVehicleModal(false)
              setEditingVehicle(null)
            }}>×</button>
            <h2>{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
            <form onSubmit={handleSaveVehicle}>
              <div className="form-row">
                <div className="form-group">
                  <label>Model *</label>
                  <input
                    type="text"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({...vehicleForm, year: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Brand</label>
                  <select
                    value={vehicleForm.brandId}
                    onChange={(e) => setVehicleForm({...vehicleForm, brandId: e.target.value})}
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand.Id} value={brand.Id}>{brand.Name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select
                    value={vehicleForm.vehicleTypeId}
                    onChange={(e) => setVehicleForm({...vehicleForm, vehicleTypeId: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map(type => (
                      <option key={type.Id} value={type.Id}>{type.Name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fuel Type</label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={(e) => setVehicleForm({...vehicleForm, fuelType: e.target.value})}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Transmission</label>
                  <select
                    value={vehicleForm.transmission}
                    onChange={(e) => setVehicleForm({...vehicleForm, transmission: e.target.value})}
                  >
                    <option value="">Select Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({...vehicleForm, color: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>No. of Seats</label>
                  <input
                    type="number"
                    value={vehicleForm.noOfSeat}
                    onChange={(e) => setVehicleForm({...vehicleForm, noOfSeat: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Rate per km *</label>
                <input
                  type="number"
                  step="0.01"
                  value={vehicleForm.rate}
                  onChange={(e) => setVehicleForm({...vehicleForm, rate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mileage</label>
                <input
                  type="text"
                  value={vehicleForm.milage}
                  onChange={(e) => setVehicleForm({...vehicleForm, milage: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Registration No</label>
                  <input
                    type="text"
                    value={vehicleForm.registrationNo}
                    onChange={(e) => setVehicleForm({...vehicleForm, registrationNo: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Registration Expiry</label>
                  <input
                    type="date"
                    value={vehicleForm.registrationExpiryDate}
                    onChange={(e) => setVehicleForm({...vehicleForm, registrationExpiryDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Pollution Doc No</label>
                  <input
                    type="text"
                    value={vehicleForm.pollutionDocNo}
                    onChange={(e) => setVehicleForm({...vehicleForm, pollutionDocNo: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Pollution Expiry</label>
                  <input
                    type="date"
                    value={vehicleForm.pollutionExpiry}
                    onChange={(e) => setVehicleForm({...vehicleForm, pollutionExpiry: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Insurance Doc No</label>
                  <input
                    type="text"
                    value={vehicleForm.insuranceDocNo}
                    onChange={(e) => setVehicleForm({...vehicleForm, insuranceDocNo: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Insurance Expiry</label>
                  <input
                    type="date"
                    value={vehicleForm.insuranceExpiry}
                    onChange={(e) => setVehicleForm({...vehicleForm, insuranceExpiry: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Features</label>
                <div className="checkbox-group">
                  <label><input type="checkbox" checked={vehicleForm.ac} onChange={(e) => setVehicleForm({...vehicleForm, ac: e.target.checked})} /> AC</label>
                  <label><input type="checkbox" checked={vehicleForm.gps} onChange={(e) => setVehicleForm({...vehicleForm, gps: e.target.checked})} /> GPS</label>
                  <label><input type="checkbox" checked={vehicleForm.bluetooth} onChange={(e) => setVehicleForm({...vehicleForm, bluetooth: e.target.checked})} /> Bluetooth</label>
                  <label><input type="checkbox" checked={vehicleForm.wifi} onChange={(e) => setVehicleForm({...vehicleForm, wifi: e.target.checked})} /> Wi-Fi</label>
                  <label><input type="checkbox" checked={vehicleForm.musicSystem} onChange={(e) => setVehicleForm({...vehicleForm, musicSystem: e.target.checked})} /> Music System</label>
                  <label><input type="checkbox" checked={vehicleForm.camera} onChange={(e) => setVehicleForm({...vehicleForm, camera: e.target.checked})} /> Camera</label>
                  <label><input type="checkbox" checked={vehicleForm.sensors} onChange={(e) => setVehicleForm({...vehicleForm, sensors: e.target.checked})} /> Sensors</label>
                  <label><input type="checkbox" checked={vehicleForm.lcd} onChange={(e) => setVehicleForm({...vehicleForm, lcd: e.target.checked})} /> LCD</label>
                  <label><input type="checkbox" checked={vehicleForm.safety} onChange={(e) => setVehicleForm({...vehicleForm, safety: e.target.checked})} /> Safety</label>
                  <label><input type="checkbox" checked={vehicleForm.luggage} onChange={(e) => setVehicleForm({...vehicleForm, luggage: e.target.checked})} /> Luggage</label>
                </div>
              </div>
              <div className="form-group">
                <label>Vehicle Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('image1', e.target.files[0])}
                />
                {vehicleForm.image1 && (
                  <img 
                    src={vehicleForm.image1.startsWith('http') ? vehicleForm.image1 : getImageUrl(vehicleForm.image1)} 
                    alt="Vehicle"
                    className="preview-image"
                  />
                )}
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DriverDashboard

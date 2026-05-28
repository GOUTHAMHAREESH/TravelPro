import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const API_BASE_URL = 'http://localhost:61792'

const AgencyDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('drivers') // 'drivers' | 'cabs' | 'bookings'
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  // Dropdown data
  const [countries, setCountries] = useState([])
  const [destinations, setDestinations] = useState([])
  const [brands, setBrands] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])

  // Add Driver modal
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [driverSaving, setDriverSaving] = useState(false)
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
    destinationId: ''
  })

  // Add Cab modal
  const [showCabModal, setShowCabModal] = useState(false)
  const [cabSaving, setCabSaving] = useState(false)
  const [cabForm, setCabForm] = useState({
    model: '',
    year: '',
    fuelType: '',
    transmission: '',
    color: '',
    noOfSeat: '',
    rate: '',
    brandId: '',
    vehicleTypeId: '',
    registrationNo: ''
  })
  const [driverOptions, setDriverOptions] = useState([])
  const [cabDriverId, setCabDriverId] = useState('')

  useEffect(() => {
    if (!user || user.Role !== 'Agency' || !user.AgencyId) return
    fetchDrivers()
    fetchVehicles()
    fetchBookings()
    fetchLookups()
  }, [user])

  const fetchLookups = async () => {
    try {
      const [countryRes, destRes, brandRes, typeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/CountryList`),
        fetch(`${API_BASE_URL}/DestinationList`),
        fetch(`${API_BASE_URL}/BrandList`).catch(() => null),
        fetch(`${API_BASE_URL}/VehicleTypeList`).catch(() => null)
      ])

      if (countryRes?.ok) {
        const data = await countryRes.json()
        setCountries(data || [])
      }
      if (destRes?.ok) {
        const data = await destRes.json()
        setDestinations(data || [])
      }
      if (brandRes?.ok) {
        const data = await brandRes.json()
        setBrands(data || [])
      }
      if (typeRes?.ok) {
        const data = await typeRes.json()
        setVehicleTypes(data || [])
      }
    } catch (e) {
      console.error('Error fetching lookups for agency:', e)
    }
  }

  const fetchDrivers = async () => {
    if (!user?.AgencyId) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/DriverList`)
      if (res.ok) {
        const data = await res.json()
        const list = (data || []).filter(d => d.AgencyId === user.AgencyId)
        setDrivers(list)
        setDriverOptions(list)
      }
    } catch (e) {
      console.error('Error fetching drivers for agency:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicles = async () => {
    if (!user?.AgencyId) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/VehicleList`)
      if (res.ok) {
        const data = await res.json()
        const list = (data || []).filter(v => v.AgencyId === user.AgencyId)
        setVehicles(list)
      }
    } catch (e) {
      console.error('Error fetching vehicles for agency:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    if (!user?.AgencyId) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/CabBookingList`)
      if (res.ok) {
        const data = await res.json()
        const agencyId = Number(user.AgencyId)
        const list = (data || []).filter(b => Number(b.Vehicle?.AgencyId || b.Vehicle?.Agency?.Id) === agencyId)
        setBookings(list)
      }
    } catch (e) {
      console.error('Error fetching bookings for agency:', e)
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

      const res = await fetch(`${API_BASE_URL}/AddCabBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const result = await res.json()
        if (result) {
          fetchBookings()
        } else {
          alert('Failed to update booking status')
        }
      } else {
        alert('Failed to update booking status')
      }
    } catch (e) {
      console.error('Error updating agency booking status:', e)
      alert('Error updating booking status')
    }
  }

  const handleDriverInputChange = (e) => {
    const { name, value } = e.target
    setDriverForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCabInputChange = (e) => {
    const { name, value } = e.target
    setCabForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddDriver = async (e) => {
    e.preventDefault()
    if (!user?.AgencyId) return

    setDriverSaving(true)
    try {
      const payload = {
        Id: 0,
        Name: driverForm.name,
        EmailId: driverForm.emailId,
        MobileNo: driverForm.mobileNo,
        Location: driverForm.location,
        Address: driverForm.address,
        LicenseNo: driverForm.licenseNo,
        AdharNo: driverForm.adharNo,
        LicenseIssueDate: driverForm.licenseIssueDate,
        LicenseExpiryDate: driverForm.licenseExpiryDate,
        CountryId: driverForm.countryId ? parseInt(driverForm.countryId) : 0,
        DestinationId: driverForm.destinationId ? parseInt(driverForm.destinationId) : 0,
        Password: `${driverForm.mobileNo || 'driver'}@123`,
        Photo: '',
        LicenseDocument: '',
        AdminCreated: true,
        AgencyId: user.AgencyId
      }

      const res = await fetch(`${API_BASE_URL}/AddDriver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const result = await res.json()
        if (result) {
          alert('Driver added successfully!')
          setShowDriverModal(false)
          setDriverForm({
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
            destinationId: ''
          })
          fetchDrivers()
        }
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err?.Message || err?.message || 'Failed to add driver')
      }
    } catch (e) {
      console.error('Error adding driver from agency:', e)
      alert('Error adding driver')
    } finally {
      setDriverSaving(false)
    }
  }

  const handleAddCab = async (e) => {
    e.preventDefault()
    if (!user?.AgencyId || !cabDriverId) {
      alert('Please select a driver for this cab.')
      return
    }

    setCabSaving(true)
    try {
      const payload = {
        Id: 0,
        Model: cabForm.model,
        Year: parseInt(cabForm.year) || 0,
        FuelType: cabForm.fuelType,
        Transmission: cabForm.transmission,
        Color: cabForm.color,
        NoOfSeat: parseInt(cabForm.noOfSeat) || 0,
        Rate: parseFloat(cabForm.rate) || 0,
        BrandId: cabForm.brandId ? parseInt(cabForm.brandId) : 0,
        VehicleTypeId: cabForm.vehicleTypeId ? parseInt(cabForm.vehicleTypeId) : 0,
        DriverId: parseInt(cabDriverId),
        RegistrationNo: cabForm.registrationNo,
        Milage: 0,
        Luggage: 0,
        Sensors: false,
        Bluetooth: false,
        Camera: false,
        LCD: false,
        Safety: false,
        MusicSystem: false,
        Wifi: false,
        AC: false,
        GPS: false,
        PollutionExpiry: null,
        PollutionDocNo: '',
        InsuranceDocNo: '',
        InsuranceExpiry: null,
        RegistrationExpiryDate: null,
        Image1: '',
        Image2: '',
        Image3: '',
        Image4: '',
        Image5: '',
        AgencyId: user.AgencyId
      }

      const res = await fetch(`${API_BASE_URL}/AddVehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const result = await res.json()
        if (result) {
          alert('Cab added successfully!')
          setShowCabModal(false)
          setCabForm({
            model: '',
            year: '',
            fuelType: '',
            transmission: '',
            color: '',
            noOfSeat: '',
            rate: '',
            brandId: '',
            vehicleTypeId: '',
            registrationNo: ''
          })
          setCabDriverId('')
          fetchVehicles()
        }
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err?.Message || err?.message || 'Failed to add cab')
      }
    } catch (e) {
      console.error('Error adding cab from agency:', e)
      alert('Error adding cab')
    } finally {
      setCabSaving(false)
    }
  }

  if (!user || user.Role !== 'Agency') {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-card">
            <h1>Agency Dashboard</h1>
            <p>You need to be logged in as an Agency to access this page.</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="container">
          <h1>Agency Dashboard</h1>
          <p>Manage your drivers, cabs and view bookings</p>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-card">
            <div className="dashboard-tabs">
              <button
                className={activeTab === 'drivers' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('drivers')}
              >
                Drivers
              </button>
              <button
                className={activeTab === 'cabs' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('cabs')}
              >
                Cabs
              </button>
              <button
                className={activeTab === 'bookings' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
            </div>

            {activeTab === 'drivers' && (
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Your Drivers</h2>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowDriverModal(true)}
                  >
                    + Add Driver
                  </button>
                </div>
                {loading ? (
                  <p>Loading drivers...</p>
                ) : drivers.length === 0 ? (
                  <p>No drivers linked to this agency yet.</p>
                ) : (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map(d => (
                        <tr key={d.Id}>
                          <td>{d.Name}</td>
                          <td>{d.MobileNo}</td>
                          <td>{d.EmailId}</td>
                          <td>{d.Location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'cabs' && (
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Your Cabs</h2>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCabModal(true)}
                  >
                    + Add Cab
                  </button>
                </div>
                {loading ? (
                  <p>Loading cabs...</p>
                ) : vehicles.length === 0 ? (
                  <p>No cabs linked to this agency yet.</p>
                ) : (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Model</th>
                        <th>Driver</th>
                        <th>Seats</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map(v => (
                        <tr key={v.Id}>
                          <td>{v.Model}</td>
                          <td>{v.Driver?.Name || '-'}</td>
                          <td>{v.NoOfSeat}</td>
                          <td>₹{v.Rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Cab Bookings</h2>
                </div>
                {loading ? (
                  <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                  <p>No bookings for your cabs yet.</p>
                ) : (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Cab</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.Id}>
                          <td>{b.Date ? new Date(b.Date).toLocaleDateString() : ''}</td>
                          <td>{b.Vehicle?.Model || 'Cab'}</td>
                          <td>{b.LocationFrom}</td>
                          <td>{b.LocationTo}</td>
                          <td>
                            {b.Customer?.Name || 'Customer'}
                            {(b.Status || '').toLowerCase() === 'accepted' && (
                              <>
                                {b.Customer?.MobileNo && <><br />{b.Customer.MobileNo}</>}
                                {b.Customer?.EmailId && <><br />{b.Customer.EmailId}</>}
                              </>
                            )}
                          </td>
                          <td>₹{b.TotalAmount}</td>
                          <td>
                            <span className={`status-badge status-${(b.Status || 'Pending').toLowerCase()}`}>
                              {b.Status || 'Pending'}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <div className="status-actions">
                              <button
                                className="btn btn-primary btn-sm"
                                disabled={b.Status === 'Accepted'}
                                onClick={() => handleBookingStatusUpdate(b, 'Accepted')}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                disabled={b.Status === 'Rejected'}
                                onClick={() => handleBookingStatusUpdate(b, 'Rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Add Driver Modal */}
      {showDriverModal && (
        <div className="modal-overlay" onClick={() => setShowDriverModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDriverModal(false)}>×</button>
            <h2>Add Driver</h2>
            <form onSubmit={handleAddDriver} className="dashboard-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" value={driverForm.name} onChange={handleDriverInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="emailId" value={driverForm.emailId} onChange={handleDriverInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mobile</label>
                  <input name="mobileNo" value={driverForm.mobileNo} onChange={handleDriverInputChange} required />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={driverForm.location} onChange={handleDriverInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" value={driverForm.address} onChange={handleDriverInputChange} rows="2" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select name="countryId" value={driverForm.countryId} onChange={handleDriverInputChange} required>
                    <option value="">Select country</option>
                    {countries.map(c => (
                      <option key={c.Id} value={c.Id}>{c.Name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Base Destination</label>
                  <select name="destinationId" value={driverForm.destinationId} onChange={handleDriverInputChange} required>
                    <option value="">Select destination</option>
                    {destinations.map(d => (
                      <option key={d.Id} value={d.Id}>{d.Name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>License No</label>
                  <input name="licenseNo" value={driverForm.licenseNo} onChange={handleDriverInputChange} required />
                </div>
                <div className="form-group">
                  <label>Aadhar No</label>
                  <input name="adharNo" value={driverForm.adharNo} onChange={handleDriverInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>License Issue Date</label>
                  <input type="date" name="licenseIssueDate" value={driverForm.licenseIssueDate} onChange={handleDriverInputChange} required />
                </div>
                <div className="form-group">
                  <label>License Expiry Date</label>
                  <input type="date" name="licenseExpiryDate" value={driverForm.licenseExpiryDate} onChange={handleDriverInputChange} required />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={driverSaving}>
                  {driverSaving ? 'Saving...' : 'Save Driver'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDriverModal(false)}>
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
            <form onSubmit={handleAddCab} className="dashboard-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Model</label>
                  <input name="model" value={cabForm.model} onChange={handleCabInputChange} required />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="number" name="year" value={cabForm.year} onChange={handleCabInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fuel Type</label>
                  <input name="fuelType" value={cabForm.fuelType} onChange={handleCabInputChange} />
                </div>
                <div className="form-group">
                  <label>Transmission</label>
                  <input name="transmission" value={cabForm.transmission} onChange={handleCabInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input name="color" value={cabForm.color} onChange={handleCabInputChange} />
                </div>
                <div className="form-group">
                  <label>Seats</label>
                  <input type="number" name="noOfSeat" value={cabForm.noOfSeat} onChange={handleCabInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rate (₹ per km)</label>
                  <input type="number" name="rate" value={cabForm.rate} onChange={handleCabInputChange} required />
                </div>
                <div className="form-group">
                  <label>Registration No</label>
                  <input name="registrationNo" value={cabForm.registrationNo} onChange={handleCabInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Brand</label>
                  <select name="brandId" value={cabForm.brandId} onChange={handleCabInputChange}>
                    <option value="">Select brand</option>
                    {brands.map(b => (
                      <option key={b.Id} value={b.Id}>{b.Name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select name="vehicleTypeId" value={cabForm.vehicleTypeId} onChange={handleCabInputChange}>
                    <option value="">Select type</option>
                    {vehicleTypes.map(t => (
                      <option key={t.Id} value={t.Id}>{t.Name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Assign Driver</label>
                <select value={cabDriverId} onChange={(e) => setCabDriverId(e.target.value)} required>
                  <option value="">Select driver</option>
                  {driverOptions.map(d => (
                    <option key={d.Id} value={d.Id}>{d.Name}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={cabSaving}>
                  {cabSaving ? 'Saving...' : 'Save Cab'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCabModal(false)}>
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

export default AgencyDashboard


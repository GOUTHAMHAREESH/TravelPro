import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

const API_BASE_URL = 'http://localhost:61792'

const Register = () => {
  const navigate = useNavigate()
  const [registrationType, setRegistrationType] = useState('regular') // 'regular', 'hotel', 'driver', 'agency'
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState([])
  const [hotelTypes, setHotelTypes] = useState([])
  const [destinations, setDestinations] = useState([])

  // Agency Form Data
  const [agencyFormData, setAgencyFormData] = useState({
    name: '',
    emailId: '',
    mobileNo: '',
    location: '',
    address: '',
    countryId: 1,
    password: '',
    confirmPassword: '',
    registrationDocument: ''
  })
  
  // Regular User Form Data
  const [regularFormData, setRegularFormData] = useState({
    name: '',
    emailId: '',
    mobileNo: '',
    location: '',
    address: '',
    countryId: 1,
    password: '',
    confirmPassword: ''
  })

  // Hotel Form Data
  const [hotelFormData, setHotelFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    destinationId: 1,
    costPerDay: '',
    location: '',
    address: '',
    hotelTypeId: 1,
    starRating: '',
    password: '',
    confirmPassword: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    registrationCertificate: ''
  })

  // Driver Form Data
  const [driverFormData, setDriverFormData] = useState({
    name: '',
    emailId: '',
    mobileNo: '',
    location: '',
    address: '',
    licenseNo: '',
    adharNo: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    countryId: 1,
    destinationId: 1,
    password: '',
    confirmPassword: '',
    photo: '',
    licenseDocument: ''
  })

  const handleRegularChange = (e) => {
    const value = e.target.name === 'countryId' ? parseInt(e.target.value) : e.target.value
    setRegularFormData({
      ...regularFormData,
      [e.target.name]: value
    })
  }

  const handleHotelChange = (e) => {
    const value = e.target.name === 'hotelTypeId' || e.target.name === 'destinationId' 
      ? parseInt(e.target.value) 
      : e.target.value
    setHotelFormData({
      ...hotelFormData,
      [e.target.name]: value
    })
  }

  const handleDriverChange = (e) => {
    const value = e.target.name === 'countryId' || e.target.name === 'destinationId'
      ? parseInt(e.target.value)
      : e.target.value
    setDriverFormData({
      ...driverFormData,
      [e.target.name]: value
    })
  }

  const handleAgencyChange = (e) => {
    const value = e.target.name === 'countryId' ? parseInt(e.target.value) : e.target.value
    setAgencyFormData({
      ...agencyFormData,
      [e.target.name]: value
    })
  }

  const handleAgencyRegDocChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAgencyFormData({
          ...agencyFormData,
          registrationDocument: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageChange = (e, imageField) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setHotelFormData({
          ...hotelFormData,
          [imageField]: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDriverPhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDriverFormData({
          ...driverFormData,
          photo: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDriverLicenseDocChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDriverFormData({
          ...driverFormData,
          licenseDocument: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHotelRegCertChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setHotelFormData({
          ...hotelFormData,
          registrationCertificate: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Fetch countries and hotel types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesResponse = await fetch(`${API_BASE_URL}/CountryList`)
        if (countriesResponse.ok) {
          const countriesData = await countriesResponse.json()
          setCountries(countriesData)
          // Set default country if available
          if (countriesData.length > 0) {
            const defaultCountryId = parseInt(countriesData[0].Id)
            setRegularFormData(prev => ({ ...prev, countryId: defaultCountryId }))
            setDriverFormData(prev => ({ ...prev, countryId: defaultCountryId }))
            setAgencyFormData(prev => ({ ...prev, countryId: defaultCountryId }))
          }
        }

        // Fetch hotel types
        const hotelTypesResponse = await fetch(`${API_BASE_URL}/HotelTypeList`)
        if (hotelTypesResponse.ok) {
          const hotelTypesData = await hotelTypesResponse.json()
          setHotelTypes(hotelTypesData)
          // Set default hotel type if available
          if (hotelTypesData.length > 0) {
            const defaultHotelTypeId = parseInt(hotelTypesData[0].Id)
            setHotelFormData(prev => ({ ...prev, hotelTypeId: defaultHotelTypeId }))
          }
        }

        // Fetch destinations
        const destinationsResponse = await fetch(`${API_BASE_URL}/DestinationList`)
        if (destinationsResponse.ok) {
          const destinationsData = await destinationsResponse.json()
          setDestinations(destinationsData)
          // Set default destination if available
          if (destinationsData.length > 0) {
            const defaultDestinationId = parseInt(destinationsData[0].Id)
            setHotelFormData(prev => ({ ...prev, destinationId: defaultDestinationId }))
            setDriverFormData(prev => ({ ...prev, destinationId: defaultDestinationId }))
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleRegularSubmit = async (e) => {
    e.preventDefault()
    
    if (!regularFormData.password || regularFormData.password.trim() === '') {
      alert('Password is required!')
      return
    }

    if (regularFormData.password !== regularFormData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    setLoading(true)
    try {
      const payload = {
        Id: 0,
        Name: regularFormData.name,
        EmailId: regularFormData.emailId,
        MobileNo: regularFormData.mobileNo,
        Location: regularFormData.location,
        Address: regularFormData.address,
        CountryId: parseInt(regularFormData.countryId),
        Password: regularFormData.password.trim() || regularFormData.password
      }

      // Ensure Password is included
      if (!payload.Password) {
        alert('Password is required!')
        setLoading(false)
        return
      }

      console.log('Customer Registration Payload:', { ...payload, Password: '***' }) // Debug log

      const response = await fetch(`${API_BASE_URL}/AddCustomer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Registration successful! Your account is pending admin verification. You will be able to login once an admin approves your account.')
          navigate('/login')
        } else {
          alert('Registration failed. Please try again.')
        }
      } else {
        const errData = await response.json().catch(() => ({}))
        const msg = errData?.Message || errData?.message || (typeof errData === 'string' ? errData : 'Registration failed. Please try again.')
        alert(msg)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleHotelSubmit = async (e) => {
    e.preventDefault()
    
    if (!hotelFormData.password || hotelFormData.password.trim() === '') {
      alert('Password is required!')
      return
    }

    if (hotelFormData.password !== hotelFormData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (!hotelFormData.registrationCertificate) {
      alert('Registration certificate document is required.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        Id: 0,
        Name: hotelFormData.name,
        Email: hotelFormData.email,
        MobileNo: hotelFormData.mobileNo,
        DestinationId: parseInt(hotelFormData.destinationId),
        CostPerDay: parseFloat(hotelFormData.costPerDay),
        Location: hotelFormData.location,
        Address: hotelFormData.address,
        HotelTypeId: parseInt(hotelFormData.hotelTypeId),
        StarRating: parseInt(hotelFormData.starRating),
        Password: hotelFormData.password.trim() || hotelFormData.password,
        Image1: hotelFormData.image1 || '',
        Image2: hotelFormData.image2 || '',
        Image3: hotelFormData.image3 || '',
        Image4: hotelFormData.image4 || '',
        Image5: hotelFormData.image5 || '',
        RegistrationCertificate: hotelFormData.registrationCertificate || ''
      }

      // Ensure Password is included
      if (!payload.Password) {
        alert('Password is required!')
        setLoading(false)
        return
      }

      console.log('Hotel Registration Payload:', { ...payload, Password: '***' }) // Debug log

      const response = await fetch(`${API_BASE_URL}/AddHotel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Hotel registration successful! Your account is pending admin verification. You will be able to login once an admin approves your account.')
          navigate('/login')
        } else {
          alert('Registration failed. Please try again.')
        }
      } else {
        const errData = await response.json().catch(() => ({}))
        const msg = errData?.Message || errData?.message || (typeof errData === 'string' ? errData : 'Registration failed. Please try again.')
        alert(msg)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDriverSubmit = async (e) => {
    e.preventDefault()
    
    if (!driverFormData.password || driverFormData.password.trim() === '') {
      alert('Password is required!')
      return
    }

    if (driverFormData.password !== driverFormData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (!driverFormData.licenseDocument) {
      alert('License document is required.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        Id: 0,
        Name: driverFormData.name,
        EmailId: driverFormData.emailId,
        MobileNo: driverFormData.mobileNo,
        Location: driverFormData.location,
        Address: driverFormData.address,
        LicenseNo: driverFormData.licenseNo,
        AdharNo: driverFormData.adharNo,
        LicenseIssueDate: driverFormData.licenseIssueDate,
        LicenseExpiryDate: driverFormData.licenseExpiryDate,
        CountryId: parseInt(driverFormData.countryId),
        DestinationId: parseInt(driverFormData.destinationId),
        Password: driverFormData.password.trim() || driverFormData.password,
        Photo: driverFormData.photo || '',
        LicenseDocument: driverFormData.licenseDocument || ''
      }

      // Ensure Password is included
      if (!payload.Password) {
        alert('Password is required!')
        setLoading(false)
        return
      }

      console.log('Driver Registration Payload:', { ...payload, Password: '***' }) // Debug log

      const response = await fetch(`${API_BASE_URL}/AddDriver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Driver registration successful! Your account is pending admin verification. You will be able to login once an admin approves your account.')
          navigate('/login')
        } else {
          alert('Registration failed. Please try again.')
        }
      } else {
        const errData = await response.json().catch(() => ({}))
        const msg = errData?.Message || errData?.message || (typeof errData === 'string' ? errData : 'Registration failed. Please try again.')
        alert(msg)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAgencySubmit = async (e) => {
    e.preventDefault()

    if (!agencyFormData.password || agencyFormData.password.trim() === '') {
      alert('Password is required!')
      return
    }

    if (agencyFormData.password !== agencyFormData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    setLoading(true)
    try {
      const payload = {
        Id: 0,
        Name: agencyFormData.name,
        EmailId: agencyFormData.emailId,
        MobileNo: agencyFormData.mobileNo,
        Location: agencyFormData.location,
        Address: agencyFormData.address,
        CountryId: parseInt(agencyFormData.countryId),
        Password: agencyFormData.password.trim() || agencyFormData.password,
        RegistrationDocument: agencyFormData.registrationDocument || ''
      }

      const response = await fetch(`${API_BASE_URL}/AddAgency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Agency registration successful! Your account is pending admin verification. You will be able to login once an admin approves your account.')
          navigate('/login')
        } else {
          alert('Registration failed. Please try again.')
        }
      } else {
        const errData = await response.json().catch(() => ({}))
        const msg = errData?.Message || errData?.message || (typeof errData === 'string' ? errData : 'Registration failed. Please try again.')
        alert(msg)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="page-header">
        <div className="container">
          <h1>Create Account</h1>
          <p>Join Travel Pro and start your journey</p>
        </div>
      </div>

      <div className="register-container">
        <div className="container">
          <div className="register-card">
            <div className="register-form-wrapper">
              <h2>Sign Up</h2>
              <p className="register-subtitle">Choose your registration type</p>
              
              {/* Registration Type Selector */}
              <div className="registration-type-selector">
                <button
                  type="button"
                  className={`type-btn ${registrationType === 'regular' ? 'active' : ''}`}
                  onClick={() => setRegistrationType('regular')}
                >
                  Register as Regular User
                </button>
                <button
                  type="button"
                  className={`type-btn ${registrationType === 'hotel' ? 'active' : ''}`}
                  onClick={() => setRegistrationType('hotel')}
                >
                  Hotel Register
                </button>
                <button
                  type="button"
                  className={`type-btn ${registrationType === 'driver' ? 'active' : ''}`}
                  onClick={() => setRegistrationType('driver')}
                >
                  Driver Registration
                </button>
                <button
                  type="button"
                  className={`type-btn ${registrationType === 'agency' ? 'active' : ''}`}
                  onClick={() => setRegistrationType('agency')}
                >
                  Agency Registration
                </button>
              </div>

              {/* Regular User Form */}
              {registrationType === 'regular' && (
                <form className="register-form" onSubmit={handleRegularSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={regularFormData.name}
                      onChange={handleRegularChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="emailId">Email Address</label>
                    <input
                      type="email"
                      id="emailId"
                      name="emailId"
                      value={regularFormData.emailId}
                      onChange={handleRegularChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobileNo">Phone Number</label>
                    <input
                      type="tel"
                      id="mobileNo"
                      name="mobileNo"
                      value={regularFormData.mobileNo}
                      onChange={handleRegularChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={regularFormData.location}
                      onChange={handleRegularChange}
                      required
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={regularFormData.address}
                      onChange={handleRegularChange}
                      required
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="countryId">Country</label>
                    <select
                      id="countryId"
                      name="countryId"
                      value={regularFormData.countryId}
                      onChange={handleRegularChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.Id} value={country.Id}>
                          {country.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={regularFormData.password}
                      onChange={handleRegularChange}
                      required
                      placeholder="Create a password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={regularFormData.confirmPassword}
                      onChange={handleRegularChange}
                      required
                      placeholder="Confirm your password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-options">
                    <label className="terms-checkbox">
                      <input type="checkbox" required />
                      <span>I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Hotel Form */}
              {registrationType === 'hotel' && (
                <form className="register-form" onSubmit={handleHotelSubmit}>
                  <div className="form-group">
                    <label htmlFor="hotelName">Hotel Name</label>
                    <input
                      type="text"
                      id="hotelName"
                      name="name"
                      value={hotelFormData.name}
                      onChange={handleHotelChange}
                      required
                      placeholder="Enter hotel name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hotelEmail">Email Address</label>
                    <input
                      type="email"
                      id="hotelEmail"
                      name="email"
                      value={hotelFormData.email}
                      onChange={handleHotelChange}
                      required
                      placeholder="Enter hotel email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hotelMobileNo">Phone Number</label>
                    <input
                      type="tel"
                      id="hotelMobileNo"
                      name="mobileNo"
                      value={hotelFormData.mobileNo}
                      onChange={handleHotelChange}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hotelLocation">Location</label>
                    <input
                      type="text"
                      id="hotelLocation"
                      name="location"
                      value={hotelFormData.location}
                      onChange={handleHotelChange}
                      required
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hotelAddress">Address</label>
                    <textarea
                      id="hotelAddress"
                      name="address"
                      value={hotelFormData.address}
                      onChange={handleHotelChange}
                      required
                      placeholder="Enter address"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="destinationId">Destination</label>
                    <select
                      id="destinationId"
                      name="destinationId"
                      value={hotelFormData.destinationId}
                      onChange={handleHotelChange}
                      required
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((destination) => (
                        <option key={destination.Id} value={destination.Id}>
                          {destination.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="costPerDay">Cost Per Day</label>
                    <input
                      type="number"
                      id="costPerDay"
                      name="costPerDay"
                      value={hotelFormData.costPerDay}
                      onChange={handleHotelChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Enter cost per day"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hotelTypeId">Hotel Type</label>
                    <select
                      id="hotelTypeId"
                      name="hotelTypeId"
                      value={hotelFormData.hotelTypeId}
                      onChange={handleHotelChange}
                      required
                    >
                      <option value="">Select Hotel Type</option>
                      {hotelTypes.map((hotelType) => (
                        <option key={hotelType.Id} value={hotelType.Id}>
                          {hotelType.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="starRating">Star Rating</label>
                    <input
                      type="number"
                      id="starRating"
                      name="starRating"
                      value={hotelFormData.starRating}
                      onChange={handleHotelChange}
                      required
                      min="1"
                      max="5"
                      placeholder="Enter star rating (1-5)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="registrationCertificate">Registration Certificate (Required) *</label>
                    <input
                      type="file"
                      id="registrationCertificate"
                      accept=".pdf,image/*"
                      onChange={handleHotelRegCertChange}
                      required
                    />
                    <small>Upload hotel registration certificate (PDF or image)</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="hotelPassword">Password</label>
                    <input
                      type="password"
                      id="hotelPassword"
                      name="password"
                      value={hotelFormData.password}
                      onChange={handleHotelChange}
                      required
                      placeholder="Create a password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hotelConfirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="hotelConfirmPassword"
                      name="confirmPassword"
                      value={hotelFormData.confirmPassword}
                      onChange={handleHotelChange}
                      required
                      placeholder="Confirm your password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label>Hotel Images (Optional)</label>
                    <div className="image-upload-grid">
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image1')} />
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image2')} />
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image3')} />
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image4')} />
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'image5')} />
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="terms-checkbox">
                      <input type="checkbox" required />
                      <span>I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Hotel'}
                  </button>
                </form>
              )}

              {/* Driver Form */}
              {registrationType === 'driver' && (
                <form className="register-form" onSubmit={handleDriverSubmit}>
                  <div className="form-group">
                    <label htmlFor="driverName">Full Name</label>
                    <input
                      type="text"
                      id="driverName"
                      name="name"
                      value={driverFormData.name}
                      onChange={handleDriverChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverEmailId">Email Address</label>
                    <input
                      type="email"
                      id="driverEmailId"
                      name="emailId"
                      value={driverFormData.emailId}
                      onChange={handleDriverChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverMobileNo">Phone Number</label>
                    <input
                      type="tel"
                      id="driverMobileNo"
                      name="mobileNo"
                      value={driverFormData.mobileNo}
                      onChange={handleDriverChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverLocation">Location</label>
                    <input
                      type="text"
                      id="driverLocation"
                      name="location"
                      value={driverFormData.location}
                      onChange={handleDriverChange}
                      required
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverAddress">Address</label>
                    <textarea
                      id="driverAddress"
                      name="address"
                      value={driverFormData.address}
                      onChange={handleDriverChange}
                      required
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="licenseNo">License Number</label>
                    <input
                      type="text"
                      id="licenseNo"
                      name="licenseNo"
                      value={driverFormData.licenseNo}
                      onChange={handleDriverChange}
                      required
                      placeholder="Enter license number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adharNo">Aadhar Number</label>
                    <input
                      type="text"
                      id="adharNo"
                      name="adharNo"
                      value={driverFormData.adharNo}
                      onChange={handleDriverChange}
                      required
                      placeholder="Enter Aadhar number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="licenseIssueDate">License Issue Date</label>
                    <input
                      type="date"
                      id="licenseIssueDate"
                      name="licenseIssueDate"
                      value={driverFormData.licenseIssueDate}
                      onChange={handleDriverChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="licenseExpiryDate">License Expiry Date</label>
                    <input
                      type="date"
                      id="licenseExpiryDate"
                      name="licenseExpiryDate"
                      value={driverFormData.licenseExpiryDate}
                      onChange={handleDriverChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverCountryId">Country</label>
                    <select
                      id="driverCountryId"
                      name="countryId"
                      value={driverFormData.countryId}
                      onChange={handleDriverChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.Id} value={country.Id}>
                          {country.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverDestinationId">Destination</label>
                    <select
                      id="driverDestinationId"
                      name="destinationId"
                      value={driverFormData.destinationId}
                      onChange={handleDriverChange}
                      required
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((destination) => (
                        <option key={destination.Id} value={destination.Id}>
                          {destination.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="licenseDocument">License Document (Required) *</label>
                    <input
                      type="file"
                      id="licenseDocument"
                      accept=".pdf,image/*"
                      onChange={handleDriverLicenseDocChange}
                      required
                    />
                    <small>Upload driving license (PDF or image)</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverPhoto">Photo</label>
                    <input
                      type="file"
                      id="driverPhoto"
                      accept="image/*"
                      onChange={handleDriverPhotoChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverPassword">Password</label>
                    <input
                      type="password"
                      id="driverPassword"
                      name="password"
                      value={driverFormData.password}
                      onChange={handleDriverChange}
                      required
                      placeholder="Create a password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="driverConfirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="driverConfirmPassword"
                      name="confirmPassword"
                      value={driverFormData.confirmPassword}
                      onChange={handleDriverChange}
                      required
                      placeholder="Confirm your password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-options">
                    <label className="terms-checkbox">
                      <input type="checkbox" required />
                      <span>I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Driver'}
                  </button>
                </form>
              )}

              {/* Agency Form */}
              {registrationType === 'agency' && (
                <form className="register-form" onSubmit={handleAgencySubmit}>
                  <div className="form-group">
                    <label htmlFor="agencyName">Agency Name</label>
                    <input
                      type="text"
                      id="agencyName"
                      name="name"
                      value={agencyFormData.name}
                      onChange={handleAgencyChange}
                      required
                      placeholder="Enter agency name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyEmailId">Email Address</label>
                    <input
                      type="email"
                      id="agencyEmailId"
                      name="emailId"
                      value={agencyFormData.emailId}
                      onChange={handleAgencyChange}
                      required
                      placeholder="Enter agency email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyMobileNo">Phone Number</label>
                    <input
                      type="tel"
                      id="agencyMobileNo"
                      name="mobileNo"
                      value={agencyFormData.mobileNo}
                      onChange={handleAgencyChange}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyLocation">Location</label>
                    <input
                      type="text"
                      id="agencyLocation"
                      name="location"
                      value={agencyFormData.location}
                      onChange={handleAgencyChange}
                      required
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyAddress">Address</label>
                    <textarea
                      id="agencyAddress"
                      name="address"
                      value={agencyFormData.address}
                      onChange={handleAgencyChange}
                      required
                      placeholder="Enter address"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyCountryId">Country</label>
                    <select
                      id="agencyCountryId"
                      name="countryId"
                      value={agencyFormData.countryId}
                      onChange={handleAgencyChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.Id} value={country.Id}>
                          {country.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyRegDoc">Registration Document (Optional)</label>
                    <input
                      type="file"
                      id="agencyRegDoc"
                      accept=".pdf,image/*"
                      onChange={handleAgencyRegDocChange}
                    />
                    <small>Upload agency registration document (PDF or image)</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyPassword">Password</label>
                    <input
                      type="password"
                      id="agencyPassword"
                      name="password"
                      value={agencyFormData.password}
                      onChange={handleAgencyChange}
                      required
                      placeholder="Create a password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="agencyConfirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="agencyConfirmPassword"
                      name="confirmPassword"
                      value={agencyFormData.confirmPassword}
                      onChange={handleAgencyChange}
                      required
                      placeholder="Confirm your password"
                      minLength="6"
                    />
                  </div>

                  <div className="form-options">
                    <label className="terms-checkbox">
                      <input type="checkbox" required />
                      <span>I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Agency'}
                  </button>
                </form>
              )}

              <p className="login-link">
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>
            <div className="register-image">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800" alt="Travel" />
              <div className="image-overlay">
                <h3>Join Travel Pro</h3>
                <p>Discover amazing destinations, share your adventures, and connect with fellow travelers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

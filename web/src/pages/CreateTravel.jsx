import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './CreateTravel.css'

const API_BASE_URL = 'http://localhost:61792'

const CreateTravel = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateFrom: '',
    dateTo: ''
  })

  // Redirect if not logged in or not a customer
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login')
      return
    }
    if (user.Role !== 'Customer') {
      alert('Only customers can create travel journeys.')
      navigate('/')
      return
    }
  }, [isLoggedIn, user, navigate])

  // Show loading or access denied if not a customer
  if (!isLoggedIn || !user || user.Role !== 'Customer') {
    return (
      <div className="create-travel-page">
        <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You must be logged in as a customer to create a journey.</p>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateDays = (dateFrom, dateTo) => {
    if (!dateFrom || !dateTo) return 0
    const start = new Date(dateFrom)
    const end = new Date(dateTo)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1 // Include both start and end days
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user || user.Role !== 'Customer') {
      alert('You must be logged in as a customer to create a journey.')
      navigate('/login')
      return
    }

    if (!user.CustomerId) {
      alert('Customer ID not found. Please login again.')
      navigate('/login')
      return
    }

    const noOfDays = calculateDays(formData.dateFrom, formData.dateTo)
    if (noOfDays <= 0) {
      alert('End date must be after start date.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        Id: 0,
        Title: formData.title,
        Description: formData.description,
        DateFrom: formData.dateFrom,
        DateTo: formData.dateTo,
        NoOfDays: noOfDays,
        CustomerId: user.CustomerId,
        Photo: photo || ''
      }

      console.log('Journey Registration Payload:', { ...payload, Photo: photo ? '***' : '' }) // Debug log

      const response = await fetch(`${API_BASE_URL}/AddJourney`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        if (result) {
          alert('Travel journey created successfully!')
          navigate('/travels')
        } else {
          alert('Failed to create journey. Please try again.')
        }
      } else {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        alert('Failed to create journey. Please try again.')
      }
    } catch (error) {
      console.error('Journey creation error:', error)
      alert('An error occurred while creating the journey. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-travel-page">
      <div className="page-header">
        <div className="container">
          <h1>Create Your Travel Story</h1>
          <p>Share your journey with the world</p>
        </div>
      </div>

      <div className="create-travel-container">
        <div className="container">
          <div className="create-travel-card">
            <form className="create-travel-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Journey Information</h2>
                <div className="form-group">
                  <label htmlFor="title">Journey Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Amazing Journey Through Paris"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateFrom">Start Date *</label>
                    <input
                      type="date"
                      id="dateFrom"
                      name="dateFrom"
                      value={formData.dateFrom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateTo">End Date *</label>
                    <input
                      type="date"
                      id="dateTo"
                      name="dateTo"
                      value={formData.dateTo}
                      onChange={handleChange}
                      required
                      min={formData.dateFrom}
                    />
                  </div>
                </div>

                {formData.dateFrom && formData.dateTo && (
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={`${calculateDays(formData.dateFrom, formData.dateTo)} day(s)`}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                )}
              </div>

              <div className="form-section">
                <h2>Description</h2>
                <div className="form-group">
                  <label htmlFor="description">Journey Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="8"
                    placeholder="Describe your travel journey, experiences, memorable moments, and details..."
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h2>Journey Photo</h2>
                <div className="form-group">
                  <label htmlFor="photo">Upload Photo</label>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {photo && (
                    <div className="photo-preview">
                      <img src={photo} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '5px' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/travels')} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating Journey...' : 'Create Journey'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTravel


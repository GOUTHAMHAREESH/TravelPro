import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

const API_BASE_URL = 'http://localhost:61792'

const Profile = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fetchingCustomer, setFetchingCustomer] = useState(false)
  const [countries, setCountries] = useState([])
  const [profileData, setProfileData] = useState({
    name: user?.Name || 'User',
    emailId: user?.Email || '',
    mobileNo: user?.MobileNo || '',
    location: '',
    address: '',
    countryId: 1
  })

  const [editData, setEditData] = useState(profileData)

  // Redirect if not logged in or not a customer
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login')
      return
    }
    if (user.Role === 'Hotel') {
      navigate('/hotel-dashboard')
      return
    }
    if (user.Role === 'Driver') {
      navigate('/driver-dashboard')
      return
    }
    // Only Customer role can access profile page
  }, [isLoggedIn, user, navigate])

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/CountryList`)
        if (response.ok) {
          const data = await response.json()
          setCountries(data)
          if (data.length > 0 && !profileData.countryId) {
            setProfileData(prev => ({ ...prev, countryId: data[0].Id }))
            setEditData(prev => ({ ...prev, countryId: data[0].Id }))
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }
    fetchCountries()
  }, [])

  // Fetch customer details when editing
  const fetchCustomerDetails = async () => {
    if (!user || !user.CustomerId) {
      return
    }

    setFetchingCustomer(true)
    try {
      const response = await fetch(`${API_BASE_URL}/CustomerById/${user.CustomerId}`)
      
      if (response.ok) {
        const customerData = await response.json()
        if (customerData) {
          const updatedData = {
            name: customerData.Name || '',
            emailId: customerData.EmailId || '',
            mobileNo: customerData.MobileNo || '',
            location: customerData.Location || '',
            address: customerData.Address || '',
            countryId: customerData.CountryId || 1
          }
          setProfileData(updatedData)
          setEditData(updatedData)
        }
      } else {
        console.error('Failed to fetch customer details')
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
    } finally {
      setFetchingCustomer(false)
    }
  }

  // Update profile data when user changes (initial load)
  useEffect(() => {
    if (user && user.Name) {
      setProfileData(prev => ({
        ...prev,
        name: user.Name || prev.name,
        emailId: user.Email || prev.emailId,
        mobileNo: user.MobileNo || prev.mobileNo
      }))
    }
  }, [user])


  const handleInputChange = (e) => {
    const value = e.target.name === 'countryId' ? parseInt(e.target.value) : e.target.value
    setEditData({
      ...editData,
      [e.target.name]: value
    })
  }

  const handleSave = async () => {
    if (!user || user.Role !== 'Customer' || !user.CustomerId) {
      alert('Only customers can edit their profile.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        Id: user.CustomerId,
        Name: editData.name,
        EmailId: editData.emailId,
        MobileNo: editData.mobileNo,
        Location: editData.location,
        Address: editData.address,
        CountryId: parseInt(editData.countryId)
      }

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
          setProfileData(editData)
          setIsEditing(false)
          alert('Profile updated successfully!')
          // Optionally refresh user data by logging in again
          // For now, just update local state
        } else {
          alert('Failed to update profile. Please try again.')
        }
      } else {
        alert('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred while updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    fetchCustomerDetails() // Fetch latest customer data when editing
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  // Get user avatar/icon
  const getUserAvatar = () => {
    // Use user icon/avatar - you can customize this
    const initials = (user?.Name || 'U').substring(0, 2).toUpperCase()
    return (
      <div className="user-avatar-icon">
        {initials}
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account and view your travel stories</p>
        </div>
      </div>

      <div className="profile-container">
        <div className="container">
          <div className="profile-layout">
            <div className="profile-sidebar">
              <div className="profile-card">
                <div className="profile-avatar">
                  {getUserAvatar()}
                </div>
                {isEditing && user?.Role === 'Customer' ? (
                  <div className="profile-edit-form">
                    {fetchingCustomer ? (
                      <div className="loading-message">
                        <p>Loading customer details...</p>
                      </div>
                    ) : (
                      <>
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="emailId"
                        value={editData.emailId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobileNo"
                        value={editData.mobileNo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleInputChange}
                        placeholder="Enter your location"
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        name="address"
                        value={editData.address}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter your address"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <select
                        name="countryId"
                        value={editData.countryId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.Id} value={country.Id}>
                            {country.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                        <div className="form-actions">
                          <button 
                            className="btn btn-primary" 
                            onClick={handleSave}
                            disabled={saving}
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <h2>{profileData.name}</h2>
                    {profileData.emailId && (
                      <p className="profile-email">📧 {profileData.emailId}</p>
                    )}
                    {profileData.mobileNo && (
                      <p className="profile-phone">📱 {profileData.mobileNo}</p>
                    )}
                    {profileData.location && (
                      <p className="profile-location">📍 {profileData.location}</p>
                    )}
                    {profileData.address && (
                      <p className="profile-address">🏠 {profileData.address}</p>
                    )}
                    {user?.Role === 'Customer' && (
                      <button className="btn btn-primary" onClick={handleEditClick} disabled={fetchingCustomer}>
                        {fetchingCustomer ? 'Loading...' : 'Edit Profile'}
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="stats-card">
                <h3>Account Information</h3>
                {user?.CustomerId && (
                  <div className="stat-item">
                    <span className="stat-value">#{user.CustomerId}</span>
                    <span className="stat-label">Customer ID</span>
                  </div>
                )}
                <div className="stat-item">
                  <span className="stat-value">{user?.Role || 'Customer'}</span>
                  <span className="stat-label">Account Type</span>
                </div>
              </div>
            </div>

            <div className="profile-main">
              <div className="profile-actions-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons-grid">
                  <Link to="/my-travels" className="action-card">
                    <span className="action-icon">✈️</span>
                    <h3>My Journeys</h3>
                    <p>View and manage your travel journeys</p>
                  </Link>
                  <Link to="/create-travel" className="action-card">
                    <span className="action-icon">➕</span>
                    <h3>Create Journey</h3>
                    <p>Start documenting a new travel experience</p>
                  </Link>
                  <Link to="/hotels" className="action-card">
                    <span className="action-icon">🏨</span>
                    <h3>Hotels</h3>
                    <p>Browse and book hotels</p>
                  </Link>
                  <Link to="/cabs" className="action-card">
                    <span className="action-icon">🚗</span>
                    <h3>Cabs</h3>
                    <p>Book transportation</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile


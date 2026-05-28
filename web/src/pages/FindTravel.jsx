import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './FindTravel.css'

const API_BASE_URL = 'http://localhost:61792'

const FindTravel = () => {
  const [travels, setTravels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    author: '',
    minDays: '',
    maxDays: '',
    dateFrom: ''
  })

  useEffect(() => {
    fetchTravels()
  }, [])

  const fetchTravels = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/JourneyList`)
      if (response.ok) {
        const data = await response.json()
        setTravels(data || [])
      } else {
        setError('Failed to load travels')
      }
    } catch (err) {
      console.error('Error fetching travels:', err)
      setError('An error occurred while loading travels')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const filteredTravels = travels.filter(travel => {
    // Search filter - by title or author name
    const matchesSearch = !searchQuery || 
      travel.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (travel.Customer && travel.Customer.Name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Author filter
    const matchesAuthor = !filters.author || 
      (travel.Customer && travel.Customer.Name.toLowerCase().includes(filters.author.toLowerCase()))

    // Duration filters
    const matchesMinDays = !filters.minDays || travel.NoOfDays >= parseInt(filters.minDays)
    const matchesMaxDays = !filters.maxDays || travel.NoOfDays <= parseInt(filters.maxDays)

    // Date filter
    const matchesDateFrom = !filters.dateFrom || 
      (travel.DateFrom && travel.DateFrom >= filters.dateFrom)

    return matchesSearch && matchesAuthor && matchesMinDays && matchesMaxDays && matchesDateFrom
  })

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      author: '',
      minDays: '',
      maxDays: '',
      dateFrom: ''
    })
  }

  if (loading) {
    return (
      <div className="find-travel-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading travels...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="find-travel-page">
        <div className="container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="find-travel-page">
      <div className="page-header">
        <div className="container">
          <h1>Find Travel Stories</h1>
          <p>Discover amazing journeys from fellow travelers</p>
        </div>
      </div>

      <div className="find-travel-container">
        <div className="container">
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">🔍 Search</button>
            </div>

            <div className="filters-section">
              <h3>Filter Results</h3>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Author</label>
                  <input
                    type="text"
                    name="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="filter-group">
                  <label>Min Duration (days)</label>
                  <input
                    type="number"
                    name="minDays"
                    value={filters.minDays}
                    onChange={handleFilterChange}
                    placeholder="e.g., 3"
                    min="1"
                  />
                </div>
                <div className="filter-group">
                  <label>Max Duration (days)</label>
                  <input
                    type="number"
                    name="maxDays"
                    value={filters.maxDays}
                    onChange={handleFilterChange}
                    placeholder="e.g., 10"
                    min="1"
                  />
                </div>
                <div className="filter-group">
                  <label>Start Date From</label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>

          <div className="results-section">
            <div className="results-header">
              <h2>Search Results</h2>
              <p>{filteredTravels.length} travel {filteredTravels.length === 1 ? 'story' : 'stories'} found</p>
            </div>

            {filteredTravels.length > 0 ? (
              <div className="travels-grid">
                {filteredTravels.map(travel => (
                  <div key={travel.Id} className="travel-card">
                    <div className="travel-image">
                      <img 
                        src={travel.Photo && travel.Photo.startsWith('http') 
                          ? travel.Photo 
                          : travel.Photo 
                            ? `${API_BASE_URL}/${travel.Photo}` 
                            : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} 
                        alt={travel.Title}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
                        }}
                      />
                    </div>
                    <div className="travel-content">
                      <h3>{travel.Title}</h3>
                      <div className="travel-meta">
                        <span>⏱️ {travel.NoOfDays} {travel.NoOfDays === 1 ? 'day' : 'days'}</span>
                        <span>📅 {formatDate(travel.DateFrom)}</span>
                        {travel.Customer && <span>✍️ {travel.Customer.Name}</span>}
                      </div>
                      <Link to={`/travels/${travel.Id}`} className="btn btn-primary">
                        Read Story
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No travel stories found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindTravel

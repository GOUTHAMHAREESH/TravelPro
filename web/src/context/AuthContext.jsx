import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage for existing login state
    return localStorage.getItem('isLoggedIn') === 'true'
  })
  const [user, setUser] = useState(() => {
    // Load user data from localStorage if available
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
    localStorage.setItem('isLoggedIn', 'true')
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', userData.Token || '')
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


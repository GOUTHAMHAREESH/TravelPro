import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Travels from './pages/Travels'
import TravelDetail from './pages/TravelDetail'
import Destinations from './pages/Destinations'
import DestinationDetail from './pages/DestinationDetail'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import Cabs from './pages/Cabs'
import CabDetail from './pages/CabDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateTravel from './pages/CreateTravel'
import FindTravel from './pages/FindTravel'
import Profile from './pages/Profile'
import MyTravels from './pages/MyTravels'
import JourneyDetail from './pages/JourneyDetail'
import CustomerProfile from './pages/CustomerProfile'
import CustomerDashboard from './pages/CustomerDashboard'
import HotelDashboard from './pages/HotelDashboard'
import DriverDashboard from './pages/DriverDashboard'
import AgencyDashboard from './pages/AgencyDashboard'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Navbar />
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/travels" element={<Travels />} />
            <Route path="/travels/:id" element={<TravelDetail />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/cabs" element={<Cabs />} />
            <Route path="/cabs/:id" element={<CabDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-travel" element={<CreateTravel />} />
            <Route path="/find-travel" element={<FindTravel />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-travels" element={<MyTravels />} />
            <Route path="/journey/:id" element={<JourneyDetail />} />
            <Route path="/customer/:id" element={<CustomerProfile />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/hotel-dashboard" element={<HotelDashboard />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/agency-dashboard" element={<AgencyDashboard />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

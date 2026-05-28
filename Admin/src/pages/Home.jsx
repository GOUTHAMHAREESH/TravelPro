import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  countryList,
  brandList,
  hotelTypeList,
  vehicleTypeList,
  destinationList,
  customerList,
  driverList,
  vehicleList,
  hotelList,
  journeyList,
  hotelBookingList,
  cabBookingList,
} from '../api';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [
          countries,
          brands,
          hotelTypes,
          vehicleTypes,
          destinations,
          customers,
          drivers,
          vehicles,
          hotels,
          journeys,
          hotelBookings,
          cabBookings,
        ] = await Promise.all([
          countryList(),
          brandList(),
          hotelTypeList(),
          vehicleTypeList(),
          destinationList(),
          customerList(),
          driverList(),
          vehicleList(),
          hotelList(),
          journeyList(),
          hotelBookingList(),
          cabBookingList(),
        ]);
        if (!cancelled) {
          setStats({
            countries: countries?.length ?? 0,
            brands: brands?.length ?? 0,
            hotelTypes: hotelTypes?.length ?? 0,
            vehicleTypes: vehicleTypes?.length ?? 0,
            destinations: destinations?.length ?? 0,
            customers: customers?.length ?? 0,
            drivers: drivers?.length ?? 0,
            vehicles: vehicles?.length ?? 0,
            hotels: hotels?.length ?? 0,
            journeys: journeys?.length ?? 0,
            hotelBookings: hotelBookings?.length ?? 0,
            cabBookings: cabBookings?.length ?? 0,
            totalBookings: (hotelBookings?.length ?? 0) + (cabBookings?.length ?? 0),
            hotelRevenue: hotelBookings?.reduce((sum, b) => sum + (b.Total || 0), 0) ?? 0,
            cabRevenue: cabBookings?.reduce((sum, b) => sum + (b.TotalAmount || 0), 0) ?? 0,
          });
        }
      } catch (e) {
        if (!cancelled) setStats({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Travel Pro Admin</h1>
      <div className="welcome-card">
        <p className="welcome-text">Hello, <strong>{user?.Name || user?.UserName}</strong>!</p>
        <p className="role-badge">Role: {user?.Role}</p>
        {user?.Email && <p>Email: {user.Email}</p>}
        {user?.MobileNo && <p>Mobile: {user.MobileNo}</p>}
      </div>

      {loading ? (
        <p className="loading-msg">Loading dashboard...</p>
      ) : stats ? (
        <>
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Bookings Overview</h2>
            <div className="dashboard-stats">
              <Link to="/hotel-bookings" className="stat-card stat-card-link">
                <span className="stat-label">Hotel Bookings</span>
                <span className="stat-value">{stats.hotelBookings}</span>
                {stats.hotelRevenue > 0 && (
                  <span className="stat-sub">Revenue: {stats.hotelRevenue.toLocaleString()}</span>
                )}
              </Link>
              <Link to="/cab-bookings" className="stat-card stat-card-link">
                <span className="stat-label">Cab Bookings</span>
                <span className="stat-value">{stats.cabBookings}</span>
                {stats.cabRevenue > 0 && (
                  <span className="stat-sub">Revenue: {stats.cabRevenue.toLocaleString()}</span>
                )}
              </Link>
              <div className="stat-card stat-card-highlight">
                <span className="stat-label">Total Bookings</span>
                <span className="stat-value">{stats.totalBookings}</span>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Core Entities</h2>
            <div className="dashboard-stats">
              <Link to="/customers" className="stat-card stat-card-link">
                <span className="stat-label">Customers</span>
                <span className="stat-value">{stats.customers}</span>
              </Link>
              <Link to="/hotels" className="stat-card stat-card-link">
                <span className="stat-label">Hotels</span>
                <span className="stat-value">{stats.hotels}</span>
              </Link>
              <Link to="/journeys" className="stat-card stat-card-link">
                <span className="stat-label">Journeys</span>
                <span className="stat-value">{stats.journeys}</span>
              </Link>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Fleet & Travel</h2>
            <div className="dashboard-stats">
              <Link to="/drivers" className="stat-card stat-card-link">
                <span className="stat-label">Drivers</span>
                <span className="stat-value">{stats.drivers}</span>
              </Link>
              <Link to="/vehicles" className="stat-card stat-card-link">
                <span className="stat-label">Vehicles</span>
                <span className="stat-value">{stats.vehicles}</span>
              </Link>
              <Link to="/destinations" className="stat-card stat-card-link">
                <span className="stat-label">Destinations</span>
                <span className="stat-value">{stats.destinations}</span>
              </Link>
              <Link to="/countries" className="stat-card stat-card-link">
                <span className="stat-label">Countries</span>
                <span className="stat-value">{stats.countries}</span>
              </Link>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Master Data</h2>
            <div className="dashboard-stats">
              <Link to="/brands" className="stat-card stat-card-link">
                <span className="stat-label">Brands</span>
                <span className="stat-value">{stats.brands}</span>
              </Link>
              <Link to="/hotel-types" className="stat-card stat-card-link">
                <span className="stat-label">Hotel Types</span>
                <span className="stat-value">{stats.hotelTypes}</span>
              </Link>
              <Link to="/vehicle-types" className="stat-card stat-card-link">
                <span className="stat-label">Vehicle Types</span>
                <span className="stat-value">{stats.vehicleTypes}</span>
              </Link>
            </div>
          </section>
        </>
      ) : (
        <p className="empty-msg">Unable to load dashboard data.</p>
      )}
    </div>
  );
}

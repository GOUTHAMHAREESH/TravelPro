import { useState, useEffect, useMemo } from 'react';
import { cabBookingList } from '../api';
import './DataPage.css';

function formatDate(val) {
  if (!val) return '—';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toLocaleDateString();
  } catch {
    return val;
  }
}

export default function CabBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const filteredList = useMemo(() => {
    let result = list;
    if (searchText?.trim()) {
      const txt = searchText.trim().toLowerCase();
      result = result.filter((i) =>
        (i.Customer?.Name || '').toLowerCase().includes(txt) ||
        (i.Driver?.Name || '').toLowerCase().includes(txt) ||
        (i.Vehicle?.Model || '').toLowerCase().includes(txt) ||
        (i.LocationFrom || '').toLowerCase().includes(txt) ||
        (i.LocationTo || '').toLowerCase().includes(txt) ||
        (i.Destination?.Name || '').toLowerCase().includes(txt)
      );
    }
    if (fromDate) {
      result = result.filter((i) => i.Date && new Date(i.Date) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter((i) => i.Date && new Date(i.Date) <= new Date(toDate));
    }
    return result;
  }, [list, searchText, fromDate, toDate]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await cabBookingList();
        if (!cancelled) setList(data || []);
      } catch (e) {
        if (!cancelled) setList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Cab Bookings</h1>
      </div>
      <div className="table-filters">
        <div className="filter-item">
          <label>Search</label>
          <input placeholder="Customer, driver, vehicle, location..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No cab bookings found.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No cab bookings match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>From</th>
                <th>To</th>
                <th>Destination</th>
                <th>Customer</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Km</th>
                <th>Total</th>
                <th>Status</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td>{formatDate(item.Date)}</td>
                  <td>{item.Time || '—'}</td>
                  <td>{item.LocationFrom || '—'}</td>
                  <td>{item.LocationTo || '—'}</td>
                  <td>{item.Destination?.Name || '—'}</td>
                  <td>{item.Customer?.Name || '—'}</td>
                  <td>{item.Driver?.Name || '—'}</td>
                  <td>{item.Vehicle?.Model || '—'}</td>
                  <td>{item.TotalKmS != null ? item.TotalKmS : '—'}</td>
                  <td>{item.TotalAmount != null ? item.TotalAmount : '—'}</td>
                  <td>{item.Status || '—'}</td>
                  <td>{item.Rating != null ? item.Rating : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

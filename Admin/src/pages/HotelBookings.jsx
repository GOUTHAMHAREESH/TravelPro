import { useState, useEffect, useMemo } from 'react';
import { hotelBookingList } from '../api';
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

export default function HotelBookings() {
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
        (i.Hotel?.Name || '').toLowerCase().includes(txt) ||
        (i.HotelRoom?.Title || '').toLowerCase().includes(txt) ||
        (i.Customer?.Name || '').toLowerCase().includes(txt) ||
        (i.Customer?.MobileNo || '').toLowerCase().includes(txt)
      );
    }
    if (fromDate) {
      result = result.filter((i) => i.FromDate && new Date(i.FromDate) >= new Date(fromDate));
    }
    if (toDate) {
      result = result.filter((i) => i.ToDate && new Date(i.ToDate) <= new Date(toDate));
    }
    return result;
  }, [list, searchText, fromDate, toDate]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await hotelBookingList();
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
        <h1>Hotel Bookings</h1>
      </div>
      <div className="table-filters">
        <div className="filter-item">
          <label>Search</label>
          <input placeholder="Hotel, room, customer..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
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
          <p className="empty-msg">No hotel bookings found.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No hotel bookings match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hotel</th>
                <th>Room</th>
                <th>Customer</th>
                <th>Adults</th>
                <th>Kids</th>
                <th>Total Days</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td>{item.Hotel?.Name || '—'}</td>
                  <td>{item.HotelRoom?.Title || '—'}</td>
                  <td>{item.Customer?.Name || '—'}<br /><small>{item.Customer?.MobileNo || ''}</small></td>
                  <td>{item.Adults ?? '—'}</td>
                  <td>{item.Kids ?? '—'}</td>
                  <td>{item.TotalDays ?? '—'}</td>
                  <td>{formatDate(item.FromDate)}</td>
                  <td>{formatDate(item.ToDate)}</td>
                  <td>{item.Total != null ? item.Total : '—'}</td>
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

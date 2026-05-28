import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { journeyList } from '../api';
import { API_BASE } from '../api';
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

export default function Journeys() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await journeyList();
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

  const getPhotoUrl = (item) => {
    if (!item?.Photo) return null;
    if (item.Photo.startsWith('data:')) return item.Photo;
    return `${API_BASE}/${item.Photo.replace(/\\/g, '/')}`;
  };

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Journeys</h1>
      </div>
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No journeys found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Title</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Days</th>
                <th>Customer</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td className="thumb-cell">
                    {getPhotoUrl(item) ? (
                      <img src={getPhotoUrl(item)} alt="" />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>{item.Title || '—'}</td>
                  <td>{formatDate(item.DateFrom)}</td>
                  <td>{formatDate(item.DateTo)}</td>
                  <td>{item.NoOfDays ?? '—'}</td>
                  <td>{item.Customer?.Name || '—'}</td>
                  <td>
                    <Link to={`/journeys/${item.Id}`} className="btn btn-primary btn-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

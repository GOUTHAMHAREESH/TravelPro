import { useEffect, useMemo, useState } from 'react';
import { agencyList, API_BASE } from '../api';
import './DataPage.css';

function getDocUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}/${String(path).replace(/\\/g, '/')}`;
}

export default function Agency() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState(null);

  const filteredList = useMemo(() => {
    if (!searchText?.trim()) return list;
    const txt = searchText.trim().toLowerCase();
    return list.filter((i) =>
      (i.Name || '').toLowerCase().includes(txt) ||
      (i.EmailId || '').toLowerCase().includes(txt) ||
      (i.MobileNo || '').toLowerCase().includes(txt) ||
      (i.Location || '').toLowerCase().includes(txt) ||
      (i.Country?.Name || '').toLowerCase().includes(txt)
    );
  }, [list, searchText]);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await agencyList();
      setList(data || []);
      setError('');
    } catch (e) {
      setError('Failed to load agencies');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Agencies</h1>
      </div>

      <div className="table-filters">
        <div className="filter-item">
          <label>Search</label>
          <input
            placeholder="Agency name, email, mobile..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No agencies found.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No agencies match the search.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td>{item.Name || '—'}</td>
                  <td>{item.EmailId || '—'}</td>
                  <td>{item.MobileNo || '—'}</td>
                  <td>{item.Location || '—'}</td>
                  <td>{item.Country?.Name || '—'}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => setSelected(item)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="form-modal-overlay" onClick={() => setSelected(null)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Agency Details</h3>
            <div className="form-group"><label>Name</label><input value={selected.Name || ''} readOnly /></div>
            <div className="form-group"><label>Email</label><input value={selected.EmailId || ''} readOnly /></div>
            <div className="form-group"><label>Mobile</label><input value={selected.MobileNo || ''} readOnly /></div>
            <div className="form-group"><label>Location</label><input value={selected.Location || ''} readOnly /></div>
            <div className="form-group"><label>Address</label><textarea value={selected.Address || ''} readOnly /></div>
            <div className="form-group"><label>Country</label><input value={selected.Country?.Name || ''} readOnly /></div>
            <div className="form-group">
              <label>Registration Document</label>
              {selected.RegistrationDocument ? (
                <a
                  href={getDocUrl(selected.RegistrationDocument)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View Document
                </a>
              ) : (
                <span className="no-doc">No document uploaded</span>
              )}
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


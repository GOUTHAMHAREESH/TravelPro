import { useState, useEffect, useMemo } from 'react';
import { pendingUsers, approveUser, API_BASE } from '../api';
import './DataPage.css';

export default function UserApprovals() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const filteredList = useMemo(() => {
    let result = list;
    if (searchText?.trim()) {
      const txt = searchText.trim().toLowerCase();
      result = result.filter((i) =>
        (i.UserName || '').toLowerCase().includes(txt) ||
        (i.CustomerName || '').toLowerCase().includes(txt) ||
        (i.DriverName || '').toLowerCase().includes(txt) ||
        (i.HotelName || '').toLowerCase().includes(txt) ||
        (i.AgencyName || '').toLowerCase().includes(txt)
      );
    }
    if (filterRole) result = result.filter((i) => i.Role === filterRole);
    return result;
  }, [list, searchText, filterRole]);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await pendingUsers();
      setList(data || []);
      setError('');
    } catch (e) {
      setError('Failed to load pending users');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve "${name}"? They will be able to login after approval.`)) return;
    setApproving(id);
    try {
      await approveUser(id);
      loadList();
    } catch (e) {
      alert('Failed to approve');
    } finally {
      setApproving(null);
    }
  };

  const getDisplayName = (item) => {
    if (item.Role === 'Customer') return item.CustomerName || item.UserName;
    if (item.Role === 'Driver') return item.DriverName || item.UserName;
    if (item.Role === 'Hotel') return item.HotelName || item.UserName;
    if (item.Role === 'Agency') return item.AgencyName || item.UserName;
    return item.UserName || '—';
  };

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>User Approvals</h1>
        <p className="page-desc">Approve users who registered via web (Regular User, Hotel, Driver, Agency) to allow them to login.</p>
      </div>

      <div className="table-filters">
        <div className="filter-item">
          <label>Search</label>
          <input placeholder="User, name..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Role</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">All</option>
            <option value="Customer">Customer</option>
            <option value="Driver">Driver</option>
            <option value="Hotel">Hotel</option>
            <option value="Agency">Agency</option>
          </select>
        </div>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No pending approvals. All registered users have been verified.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No pending approvals match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Role</th>
                <th>Name</th>
                <th>Username / Email</th>
                <th>Document</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => {
                const docUrl = item.DocumentPath
                  ? `${API_BASE}/${(item.DocumentPath || '').replace(/\\/g, '/')}`
                  : null;
                return (
                  <tr key={item.Id}>
                    <td>{i + 1}</td>
                    <td>{item.Role}</td>
                    <td>{getDisplayName(item)}</td>
                    <td>{item.UserName || '—'}</td>
                    <td>
                      {item.Role === 'Driver' || item.Role === 'Hotel' || item.Role === 'Agency' ? (
                        docUrl ? (
                          <span>
                            <span className="doc-label">
                              {item.DocumentLabel || (item.Role === 'Driver' ? 'License' : item.Role === 'Hotel' ? 'Reg. Certificate' : 'Agency Registration')}
                            </span>
                            <a href={docUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ marginRight: '6px' }}>
                              View
                            </a>
                            <a href={docUrl} download className="btn btn-secondary btn-sm">
                              Download
                            </a>
                          </span>
                        ) : (
                          <span className="no-doc">— No document</span>
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApprove(item.Id, getDisplayName(item))}
                        disabled={approving === item.Id}
                      >
                        {approving === item.Id ? 'Approving...' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

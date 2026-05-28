import { useState, useEffect, useMemo } from 'react';
import { customerList } from '../api';
import TableFilters from '../components/TableFilters';
import './DataPage.css';

export default function Customers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const filteredList = useMemo(() => {
    if (!searchText?.trim()) return list;
    const txt = searchText.trim().toLowerCase();
    return list.filter((i) =>
      (i.Name || '').toLowerCase().includes(txt) ||
      (i.EmailId || '').toLowerCase().includes(txt) ||
      (i.MobileNo || '').toLowerCase().includes(txt) ||
      (i.Location || '').toLowerCase().includes(txt) ||
      (i.Address || '').toLowerCase().includes(txt) ||
      (i.Country?.Name || '').toLowerCase().includes(txt)
    );
  }, [list, searchText]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await customerList();
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
        <h1>Customers</h1>
      </div>
      <TableFilters searchText={searchText} setSearchText={setSearchText} placeholder="Filter by name, email, mobile..." />
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No customers found.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No customers match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Address</th>
                <th>Country</th>
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
                  <td>{item.Address || '—'}</td>
                  <td>{item.Country?.Name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

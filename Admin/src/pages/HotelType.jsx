import { useState, useEffect, useMemo } from 'react';
import { hotelTypeList, addHotelType, deleteHotelType } from '../api';
import TableFilters from '../components/TableFilters';
import './DataPage.css';

export default function HotelType() {
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const filteredList = useMemo(() => {
    if (!searchText?.trim()) return list;
    const txt = searchText.trim().toLowerCase();
    return list.filter((i) => (i.Name || '').toLowerCase().includes(txt));
  }, [list, searchText]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await hotelTypeList();
      setList(data || []);
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.Id);
    setName(item.Name || '');
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await addHotelType({ Id: editingId || 0, Name: name });
      setShowForm(false);
      loadList();
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, itemName) => {
    if (!window.confirm(`Delete "${itemName}"?`)) return;
    try {
      await deleteHotelType(id);
      loadList();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Hotel Types</h1>
        <button className="btn btn-primary" onClick={openAdd}>Add Hotel Type</button>
      </div>

      <TableFilters searchText={searchText} setSearchText={setSearchText} placeholder="Filter by name..." />
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No hotel types found. Add one to get started.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No hotel types match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td>{item.Name}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-secondary" onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item.Id, item.Name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="form-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Hotel Type' : 'Add Hotel Type'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Hotel type name" />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { brandList, addBrand, deleteBrand } from '../api';
import TableFilters from '../components/TableFilters';
import { API_BASE } from '../api';
import './DataPage.css';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Brand() {
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
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await brandList();
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

  const getPhotoUrl = (item) => {
    if (!item?.Photo) return null;
    if (item.Photo.startsWith('data:')) return item.Photo;
    return `${API_BASE}/${item.Photo.replace(/\\/g, '/')}`;
  };

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setPhoto('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.Id);
    setName(item.Name || '');
    setPhoto(item.Photo?.startsWith('data:') ? item.Photo : '');
    setError('');
    setShowForm(true);
  };

  const onPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setPhoto(b64);
    } catch (err) {
      setError('Failed to load image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        Id: editingId || 0,
        Name: name,
        IsActive: true,
      };
      if (photo) payload.Photo = photo;
      await addBrand(payload);
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
      await deleteBrand(id);
      loadList();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const formPhotoPreview = photo || (editingId && list.find((x) => x.Id === editingId)?.Photo && getPhotoUrl(list.find((x) => x.Id === editingId)));

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Brands</h1>
        <button className="btn btn-primary" onClick={openAdd}>Add Brand</button>
      </div>

      <TableFilters searchText={searchText} setSearchText={setSearchText} placeholder="Filter by name..." />
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No brands found. Add one to get started.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No brands match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td className="thumb-cell">
                    {getPhotoUrl(item) ? (
                      <img src={getPhotoUrl(item)} alt="" />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
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
            <h3>{editingId ? 'Edit Brand' : 'Add Brand'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Brand name" />
              </div>
              <div className="form-group">
                <label>Photo</label>
                <div className="img-input-wrap">
                  <input type="file" accept="image/*" onChange={onPhotoChange} />
                  {formPhotoPreview && (
                    <img src={formPhotoPreview} alt="" className="img-preview" />
                  )}
                </div>
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

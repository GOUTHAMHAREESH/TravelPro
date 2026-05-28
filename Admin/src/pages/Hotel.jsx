import { useState, useEffect, useMemo } from 'react';
import { hotelList, addHotel, deleteHotel, destinationList, hotelTypeList } from '../api';
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

const IMAGE_KEYS = ['Image1', 'Image2', 'Image3', 'Image4', 'Image5'];

export default function Hotel() {
  const [list, setList] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotelTypes, setHotelTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    MobileNo: '',
    Password: '',
    DestinationId: '',
    HotelTypeId: '',
    CostPerDay: '',
    Location: '',
    Address: '',
    StarRating: 3,
    Image1: '',
    Image2: '',
    Image3: '',
    Image4: '',
    Image5: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterDestId, setFilterDestId] = useState('');
  const [filterTypeId, setFilterTypeId] = useState('');
  const filteredList = useMemo(() => {
    let result = list;
    if (searchText?.trim()) {
      const txt = searchText.trim().toLowerCase();
      result = result.filter((i) =>
        (i.Name || '').toLowerCase().includes(txt) ||
        (i.Location || '').toLowerCase().includes(txt) ||
        (i.Address || '').toLowerCase().includes(txt) ||
        (i.Email || '').toLowerCase().includes(txt) ||
        (i.Destination?.Name || '').toLowerCase().includes(txt) ||
        (i.HotelType?.Name || '').toLowerCase().includes(txt)
      );
    }
    if (filterDestId) result = result.filter((i) => String(i.DestinationId) === filterDestId);
    if (filterTypeId) result = result.filter((i) => String(i.HotelTypeId) === filterTypeId);
    return result;
  }, [list, searchText, filterDestId, filterTypeId]);

  const loadList = async () => {
    setLoading(true);
    try {
      const [hotelData, destData, typeData] = await Promise.all([
        hotelList(),
        destinationList(),
        hotelTypeList(),
      ]);
      setList(hotelData || []);
      setDestinations(destData || []);
      setHotelTypes(typeData || []);
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:')) return path;
    return `${API_BASE}/${path.replace(/\\/g, '/')}`;
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      Name: '',
      Email: '',
      MobileNo: '',
      Password: '',
      DestinationId: destinations[0]?.Id?.toString() || '',
      HotelTypeId: hotelTypes[0]?.Id?.toString() || '',
      CostPerDay: '',
      Location: '',
      Address: '',
      StarRating: 3,
      Image1: '',
      Image2: '',
      Image3: '',
      Image4: '',
      Image5: '',
    });
    setError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.Id);
    setForm({
      Name: item.Name || '',
      Email: item.Email || '',
      MobileNo: item.MobileNo || '',
      Password: '',
      DestinationId: (item.DestinationId || '').toString(),
      HotelTypeId: (item.HotelTypeId || '').toString(),
      CostPerDay: item.CostPerDay ?? '',
      Location: item.Location || '',
      Address: item.Address || '',
      StarRating: item.StarRating ?? 3,
      Image1: '',
      Image2: '',
      Image3: '',
      Image4: '',
      Image5: '',
    });
    setError('');
    setShowForm(true);
  };

  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onImageChange = async (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      updateForm(key, b64);
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
        Name: form.Name,
        Email: form.Email,
        AdminCreated: true, // Admin-created users are auto-verified
        MobileNo: form.MobileNo,
        ...(form.Password && { Password: form.Password }),
        DestinationId: parseInt(form.DestinationId, 10) || 0,
        HotelTypeId: parseInt(form.HotelTypeId, 10) || 0,
        CostPerDay: parseFloat(form.CostPerDay) || 0,
        Location: form.Location,
        Address: form.Address,
        StarRating: parseInt(form.StarRating, 10) || 0,
      };
      IMAGE_KEYS.forEach((key) => {
        if (form[key]) payload[key] = form[key];
      });
      await addHotel(payload);
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
      await deleteHotel(id);
      loadList();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Hotels</h1>
        <button className="btn btn-primary" onClick={openAdd}>Add Hotel</button>
      </div>

      <div className="table-filters">
        <div className="filter-item">
          <label>Search</label>
          <input placeholder="Name, location, email..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Destination</label>
          <select value={filterDestId} onChange={(e) => setFilterDestId(e.target.value)}>
            <option value="">All</option>
            {destinations.map((d) => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
          </select>
        </div>
        <div className="filter-item">
          <label>Hotel Type</label>
          <select value={filterTypeId} onChange={(e) => setFilterTypeId(e.target.value)}>
            <option value="">All</option>
            {hotelTypes.map((ht) => <option key={ht.Id} value={ht.Id}>{ht.Name}</option>)}
          </select>
        </div>
      </div>
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No hotels found. Add one to get started.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No hotels match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Destination</th>
                <th>Type</th>
                <th>Stars</th>
                <th>Cost/Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td className="thumb-cell">
                    {getImageUrl(item.Image1) ? (
                      <img src={getImageUrl(item.Image1)} alt="" />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>{item.Name}</td>
                  <td>{item.Location || '—'}</td>
                  <td>{item.Destination?.Name || '—'}</td>
                  <td>{item.HotelType?.Name || '—'}</td>
                  <td>{item.StarRating ?? '—'}</td>
                  <td>{item.CostPerDay != null ? item.CostPerDay : '—'}</td>
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
          <div className="form-modal form-modal-wide" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Hotel' : 'Add Hotel'}</h3>
            <form onSubmit={handleSubmit} className="form-scroll">
              <div className="form-section">
                <div className="form-section-title">Basic Info</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input value={form.Name} onChange={(e) => updateForm('Name', e.target.value)} required placeholder="Hotel name" />
                  </div>
                  <div className="form-group">
                    <label>Star Rating</label>
                    <select value={form.StarRating} onChange={(e) => updateForm('StarRating', e.target.value)}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.Email} onChange={(e) => updateForm('Email', e.target.value)} placeholder="Email" />
                  </div>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input value={form.MobileNo} onChange={(e) => updateForm('MobileNo', e.target.value)} placeholder="Mobile" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={form.Password} onChange={(e) => updateForm('Password', e.target.value)} placeholder={editingId ? 'Leave blank to keep current' : 'Password'} autoComplete="new-password" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Destination</label>
                    <select value={form.DestinationId} onChange={(e) => updateForm('DestinationId', e.target.value)} required>
                      <option value="">Select destination</option>
                      {destinations.map((d) => (
                        <option key={d.Id} value={d.Id}>{d.Name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Hotel Type</label>
                    <select value={form.HotelTypeId} onChange={(e) => updateForm('HotelTypeId', e.target.value)} required>
                      <option value="">Select type</option>
                      {hotelTypes.map((ht) => (
                        <option key={ht.Id} value={ht.Id}>{ht.Name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cost Per Day</label>
                    <input type="number" step="0.01" value={form.CostPerDay} onChange={(e) => updateForm('CostPerDay', e.target.value)} placeholder="Cost per day" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input value={form.Location} onChange={(e) => updateForm('Location', e.target.value)} placeholder="Location" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input value={form.Address} onChange={(e) => updateForm('Address', e.target.value)} placeholder="Address" />
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Images</div>
                <div className="form-images-grid">
                  {IMAGE_KEYS.map((key, idx) => {
                    const existing = editingId && list.find((x) => x.Id === editingId)?.[key];
                    const preview = form[key] || (existing && getImageUrl(existing));
                    return (
                      <div key={key} className="form-image-item">
                        <label>Image {idx + 1}</label>
                        <div className="img-input-wrap">
                          <input type="file" accept="image/*" onChange={(e) => onImageChange(key, e)} />
                          {preview && <img src={preview} alt="" className="img-preview" />}
                        </div>
                      </div>
                    );
                  })}
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

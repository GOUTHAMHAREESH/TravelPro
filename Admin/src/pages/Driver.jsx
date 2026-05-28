import { useState, useEffect, useMemo } from 'react';
import { driverList, addDriver, deleteDriver, countryList, destinationList } from '../api';
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

function toDateInput(val) {
  if (!val) return '';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

export default function Driver() {
  const [list, setList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [emailId, setEmailId] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [adharNo, setAdharNo] = useState('');
  const [licenseIssueDate, setLicenseIssueDate] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [countryId, setCountryId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [photo, setPhoto] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterDestId, setFilterDestId] = useState('');
  const filteredList = useMemo(() => {
    let result = list;
    if (searchText?.trim()) {
      const txt = searchText.trim().toLowerCase();
      result = result.filter((i) =>
        (i.Name || '').toLowerCase().includes(txt) ||
        (i.EmailId || '').toLowerCase().includes(txt) ||
        (i.MobileNo || '').toLowerCase().includes(txt) ||
        (i.Location || '').toLowerCase().includes(txt) ||
        (i.Destination?.Name || '').toLowerCase().includes(txt) ||
        (i.Country?.Name || '').toLowerCase().includes(txt)
      );
    }
    if (filterDestId) result = result.filter((i) => String(i.DestinationId) === filterDestId);
    return result;
  }, [list, searchText, filterDestId]);

  const loadList = async () => {
    setLoading(true);
    try {
      const [driverData, countryData, destData] = await Promise.all([
        driverList(),
        countryList(),
        destinationList(),
      ]);
      setList(driverData || []);
      setCountries(countryData || []);
      setDestinations(destData || []);
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
    setMobileNo('');
    setEmailId('');
    setLocation('');
    setAddress('');
    setLicenseNo('');
    setAdharNo('');
    setLicenseIssueDate('');
    setLicenseExpiryDate('');
    setCountryId(countries[0]?.Id?.toString() || '');
    setDestinationId(destinations[0]?.Id?.toString() || '');
    setPhoto('');
    setPassword('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.Id);
    setName(item.Name || '');
    setMobileNo(item.MobileNo || '');
    setEmailId(item.EmailId || '');
    setLocation(item.Location || '');
    setAddress(item.Address || '');
    setLicenseNo(item.LicenseNo || '');
    setAdharNo(item.AdharNo || '');
    setLicenseIssueDate(toDateInput(item.LicenseIssueDate));
    setLicenseExpiryDate(toDateInput(item.LicenseExpiryDate));
    setCountryId((item.CountryId || '').toString());
    setDestinationId((item.DestinationId || '').toString());
    setPhoto('');
    setPassword('');
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
        MobileNo: mobileNo,
        EmailId: emailId,
        AdminCreated: true, // Admin-created users are auto-verified
        Location: location,
        Address: address,
        LicenseNo: licenseNo,
        AdharNo: adharNo,
        LicenseIssueDate: licenseIssueDate || '2000-01-01',
        LicenseExpiryDate: licenseExpiryDate || '2030-12-31',
        CountryId: parseInt(countryId, 10) || 0,
        DestinationId: parseInt(destinationId, 10) || 0,
      };
      if (photo) payload.Photo = photo;
      if (password) payload.Password = password;
      await addDriver(payload);
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
      await deleteDriver(id);
      loadList();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const formPhotoPreview = photo || (editingId && list.find((x) => x.Id === editingId) && getPhotoUrl(list.find((x) => x.Id === editingId)));

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Drivers</h1>
        <button className="btn btn-primary" onClick={openAdd}>Add Driver</button>
      </div>

      <div className="table-filters">
        <div className="filter-item">
          <label>Search</label>
          <input placeholder="Name, email, mobile..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Destination</label>
          <select value={filterDestId} onChange={(e) => setFilterDestId(e.target.value)}>
            <option value="">All</option>
            {destinations.map((d) => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
          </select>
        </div>
      </div>
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No drivers found. Add one to get started.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No drivers match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Location</th>
                <th>Country</th>
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
                  <td>{item.MobileNo || '—'}</td>
                  <td>{item.EmailId || '—'}</td>
                  <td>{item.Location || '—'}</td>
                  <td>{item.Country?.Name || '—'}</td>
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
            <h3>{editingId ? 'Edit Driver' : 'Add Driver'}</h3>
            <form onSubmit={handleSubmit} className="form-scroll">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} placeholder="Mobile" />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={emailId} onChange={(e) => setEmailId(e.target.value)} placeholder="Email" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>License No</label>
                  <input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="License No" />
                </div>
                <div className="form-group">
                  <label>Aadhar No</label>
                  <input value={adharNo} onChange={(e) => setAdharNo(e.target.value)} placeholder="Aadhar No" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>License Issue Date</label>
                  <input type="date" value={licenseIssueDate} onChange={(e) => setLicenseIssueDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>License Expiry Date</label>
                  <input type="date" value={licenseExpiryDate} onChange={(e) => setLicenseExpiryDate(e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.Id} value={c.Id}>{c.Name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
                    <option value="">Select destination</option>
                    {destinations.map((d) => (
                      <option key={d.Id} value={d.Id}>{d.Name}</option>
                    ))}
                  </select>
                </div>
              </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={editingId ? 'Leave blank to keep current' : 'Password'} autoComplete="new-password" />
                </div>
                <div className="form-group">
                  <label>Photo</label>
                  <div className="img-input-wrap">
                    <input type="file" accept="image/*" onChange={onPhotoChange} />
                    {formPhotoPreview && <img src={formPhotoPreview} alt="" className="img-preview" />}
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

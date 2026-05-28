import { useState, useEffect, useMemo } from 'react';
import { vehicleList, addVehicle, deleteVehicle, brandList, vehicleTypeList, driverList } from '../api';
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

const BOOL_FIELDS = [
  { key: 'Sensors', label: 'Sensors' },
  { key: 'Bluetooth', label: 'Bluetooth' },
  { key: 'Camera', label: 'Camera' },
  { key: 'LCD', label: 'LCD' },
  { key: 'Safety', label: 'Safety' },
  { key: 'MusicSystem', label: 'Music System' },
  { key: 'Wifi', label: 'Wifi' },
  { key: 'AC', label: 'AC' },
  { key: 'GPS', label: 'GPS' },
];

export default function Vehicle() {
  const [list, setList] = useState([]);
  const [brands, setBrands] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    Model: '',
    Year: new Date().getFullYear(),
    FuelType: '',
    Transmission: '',
    Color: '',
    NoOfSeat: '',
    Rate: '',
    Image1: '',
    Luggage: '',
    Milage: '',
    PollutionExpiry: '',
    PollutionDocNo: '',
    InsuranceDocNo: '',
    InsuranceExpiry: '',
    RegistrationNo: '',
    RegistrationExpiryDate: '',
    BrandId: '',
    VehicleTypeId: '',
    DriverId: '',
    Sensors: false,
    Bluetooth: false,
    Camera: false,
    LCD: false,
    Safety: false,
    MusicSystem: false,
    Wifi: false,
    AC: false,
    GPS: false,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState('');
  const filteredList = useMemo(() => {
    if (!searchText?.trim()) return list;
    const txt = searchText.trim().toLowerCase();
    return list.filter((i) =>
      (i.Model || '').toLowerCase().includes(txt) ||
      (i.RegistrationNo || '').toLowerCase().includes(txt) ||
      (i.Brand?.Name || '').toLowerCase().includes(txt) ||
      (i.VehicleType?.Name || '').toLowerCase().includes(txt) ||
      (i.Driver?.Name || '').toLowerCase().includes(txt)
    );
  }, [list, searchText]);

  const loadList = async () => {
    setLoading(true);
    try {
      const [vehicleData, brandData, vtData, driverData] = await Promise.all([
        vehicleList(),
        brandList(),
        vehicleTypeList(),
        driverList(),
      ]);
      setList(vehicleData || []);
      setBrands(brandData || []);
      setVehicleTypes(vtData || []);
      setDrivers(driverData || []);
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const getImageUrl = (item) => {
    if (!item?.Image1) return null;
    if (item.Image1.startsWith('data:')) return item.Image1;
    return `${API_BASE}/${item.Image1.replace(/\\/g, '/')}`;
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      Model: '',
      Year: new Date().getFullYear(),
      FuelType: '',
      Transmission: '',
      Color: '',
      NoOfSeat: '',
      Rate: '',
      Image1: '',
      Luggage: '',
      Milage: '',
      PollutionExpiry: '',
      PollutionDocNo: '',
      InsuranceDocNo: '',
      InsuranceExpiry: '',
      RegistrationNo: '',
      RegistrationExpiryDate: '',
      BrandId: brands[0]?.Id?.toString() || '',
      VehicleTypeId: vehicleTypes[0]?.Id?.toString() || '',
      DriverId: drivers[0]?.Id?.toString() || '',
      Sensors: false,
      Bluetooth: false,
      Camera: false,
      LCD: false,
      Safety: false,
      MusicSystem: false,
      Wifi: false,
      AC: false,
      GPS: false,
    });
    setError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.Id);
    setForm({
      Model: item.Model || '',
      Year: item.Year || new Date().getFullYear(),
      FuelType: item.FuelType || '',
      Transmission: item.Transmission || '',
      Color: item.Color || '',
      NoOfSeat: item.NoOfSeat ?? '',
      Rate: item.Rate ?? '',
      Image1: '',
      Luggage: item.Luggage ?? '',
      Milage: item.Milage ?? '',
      PollutionExpiry: toDateInput(item.PollutionExpiry),
      PollutionDocNo: item.PollutionDocNo || '',
      InsuranceDocNo: item.InsuranceDocNo || '',
      InsuranceExpiry: toDateInput(item.InsuranceExpiry),
      RegistrationNo: item.RegistrationNo || '',
      RegistrationExpiryDate: toDateInput(item.RegistrationExpiryDate),
      BrandId: (item.BrandId || '').toString(),
      VehicleTypeId: (item.VehicleTypeId || '').toString(),
      DriverId: (item.DriverId || '').toString(),
      Sensors: !!item.Sensors,
      Bluetooth: !!item.Bluetooth,
      Camera: !!item.Camera,
      LCD: !!item.LCD,
      Safety: !!item.Safety,
      MusicSystem: !!item.MusicSystem,
      Wifi: !!item.Wifi,
      AC: !!item.AC,
      GPS: !!item.GPS,
    });
    setError('');
    setShowForm(true);
  };

  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      updateForm('Image1', b64);
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
        Model: form.Model,
        Year: parseInt(form.Year, 10) || 0,
        FuelType: form.FuelType,
        Transmission: form.Transmission,
        Color: form.Color,
        NoOfSeat: parseInt(form.NoOfSeat, 10) || 0,
        Rate: parseFloat(form.Rate) || 0,
        Luggage: parseInt(form.Luggage, 10) || 0,
        Milage: parseFloat(form.Milage) || 0,
        PollutionExpiry: form.PollutionExpiry || null,
        PollutionDocNo: form.PollutionDocNo,
        InsuranceDocNo: form.InsuranceDocNo,
        InsuranceExpiry: form.InsuranceExpiry || null,
        RegistrationNo: form.RegistrationNo,
        RegistrationExpiryDate: form.RegistrationExpiryDate || null,
        BrandId: parseInt(form.BrandId, 10) || 0,
        VehicleTypeId: parseInt(form.VehicleTypeId, 10) || 0,
        DriverId: parseInt(form.DriverId, 10) || 0,
        Sensors: form.Sensors,
        Bluetooth: form.Bluetooth,
        Camera: form.Camera,
        LCD: form.LCD,
        Safety: form.Safety,
        MusicSystem: form.MusicSystem,
        Wifi: form.Wifi,
        AC: form.AC,
        GPS: form.GPS,
      };
      if (form.Image1) payload.Image1 = form.Image1;
      await addVehicle(payload);
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
      await deleteVehicle(id);
      loadList();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const formImagePreview = form.Image1 || (editingId && list.find((x) => x.Id === editingId) && getImageUrl(list.find((x) => x.Id === editingId)));

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Vehicles</h1>
        <button className="btn btn-primary" onClick={openAdd}>Add Vehicle</button>
      </div>

      <TableFilters searchText={searchText} setSearchText={setSearchText} placeholder="Filter by model, registration, brand, driver..." />
      <div className="data-table-wrap">
        {loading ? (
          <p className="loading-msg">Loading...</p>
        ) : list.length === 0 ? (
          <p className="empty-msg">No vehicles found. Add one to get started.</p>
        ) : filteredList.length === 0 ? (
          <p className="empty-msg">No vehicles match the filter.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Model</th>
                <th>Year</th>
                <th>Brand</th>
                <th>Type</th>
                <th>Driver</th>
                <th>Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, i) => (
                <tr key={item.Id}>
                  <td>{i + 1}</td>
                  <td className="thumb-cell">
                    {getImageUrl(item) ? (
                      <img src={getImageUrl(item)} alt="" />
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td>{item.Model}</td>
                  <td>{item.Year}</td>
                  <td>{item.Brand?.Name || '—'}</td>
                  <td>{item.VehicleType?.Name || '—'}</td>
                  <td>{item.Driver?.Name || '—'}</td>
                  <td>{item.Rate != null ? item.Rate : '—'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-secondary" onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item.Id, item.Model)}>Delete</button>
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
            <h3>{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <form onSubmit={handleSubmit} className="form-scroll">
              <div className="form-section">
                <div className="form-section-title">Basic Info</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Model</label>
                    <input value={form.Model} onChange={(e) => updateForm('Model', e.target.value)} required placeholder="Model" />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input type="number" value={form.Year} onChange={(e) => updateForm('Year', e.target.value)} placeholder="Year" min="1990" max="2030" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fuel Type</label>
                    <input value={form.FuelType} onChange={(e) => updateForm('FuelType', e.target.value)} placeholder="Petrol/Diesel/CNG" />
                  </div>
                  <div className="form-group">
                    <label>Transmission</label>
                    <input value={form.Transmission} onChange={(e) => updateForm('Transmission', e.target.value)} placeholder="Manual/Auto" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Color</label>
                    <input value={form.Color} onChange={(e) => updateForm('Color', e.target.value)} placeholder="Color" />
                  </div>
                  <div className="form-group">
                    <label>No of Seats</label>
                    <input type="number" value={form.NoOfSeat} onChange={(e) => updateForm('NoOfSeat', e.target.value)} placeholder="Seats" min="1" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rate</label>
                    <input type="number" step="0.01" value={form.Rate} onChange={(e) => updateForm('Rate', e.target.value)} placeholder="Rate" />
                  </div>
                  <div className="form-group">
                    <label>Luggage</label>
                    <input type="number" value={form.Luggage} onChange={(e) => updateForm('Luggage', e.target.value)} placeholder="Luggage capacity" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Associations</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Brand</label>
                    <select value={form.BrandId} onChange={(e) => updateForm('BrandId', e.target.value)} required>
                      <option value="">Select brand</option>
                      {brands.map((b) => (
                        <option key={b.Id} value={b.Id}>{b.Name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Vehicle Type</label>
                    <select value={form.VehicleTypeId} onChange={(e) => updateForm('VehicleTypeId', e.target.value)} required>
                      <option value="">Select type</option>
                      {vehicleTypes.map((vt) => (
                        <option key={vt.Id} value={vt.Id}>{vt.Name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Driver</label>
                  <select value={form.DriverId} onChange={(e) => updateForm('DriverId', e.target.value)}>
                    <option value="">Select driver</option>
                    {drivers.map((d) => (
                      <option key={d.Id} value={d.Id}>{d.Name} ({d.MobileNo})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Documents</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Registration No</label>
                    <input value={form.RegistrationNo} onChange={(e) => updateForm('RegistrationNo', e.target.value)} placeholder="Registration No" />
                  </div>
                  <div className="form-group">
                    <label>Registration Expiry</label>
                    <input type="date" value={form.RegistrationExpiryDate} onChange={(e) => updateForm('RegistrationExpiryDate', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Insurance Doc No</label>
                    <input value={form.InsuranceDocNo} onChange={(e) => updateForm('InsuranceDocNo', e.target.value)} placeholder="Insurance Doc No" />
                  </div>
                  <div className="form-group">
                    <label>Insurance Expiry</label>
                    <input type="date" value={form.InsuranceExpiry} onChange={(e) => updateForm('InsuranceExpiry', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pollution Doc No</label>
                    <input value={form.PollutionDocNo} onChange={(e) => updateForm('PollutionDocNo', e.target.value)} placeholder="Pollution Doc No" />
                  </div>
                  <div className="form-group">
                    <label>Pollution Expiry</label>
                    <input type="date" value={form.PollutionExpiry} onChange={(e) => updateForm('PollutionExpiry', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Features</div>
                <div className="form-checkbox-group">
                  {BOOL_FIELDS.map(({ key, label }) => (
                    <label key={key} className="form-checkbox-item">
                      <input type="checkbox" checked={form[key]} onChange={(e) => updateForm(key, e.target.checked)} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Image</div>
                <div className="form-group">
                  <label>Image 1</label>
                  <div className="img-input-wrap">
                    <input type="file" accept="image/*" onChange={onImageChange} />
                    {formImagePreview && <img src={formImagePreview} alt="" className="img-preview" />}
                  </div>
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

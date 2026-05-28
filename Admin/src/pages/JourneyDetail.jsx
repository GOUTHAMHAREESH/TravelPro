import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getJourneyById,
  journeyDetailList,
  journeyDirectoryList,
  journeyGalleryList,
  journeyHotelList,
  journeyCabList,
} from '../api';
import { API_BASE } from '../api';
import './JourneyDetail.css';

function formatDate(val) {
  if (!val) return '—';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toLocaleDateString();
  } catch {
    return val;
  }
}

function getPhotoUrl(path) {
  if (!path) return null;
  if (path.startsWith('data:')) return path;
  return `${API_BASE}/${path.replace(/\\/g, '/')}`;
}

export default function JourneyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailExtras, setDetailExtras] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [journeyData, detailsData] = await Promise.all([
          getJourneyById(id),
          journeyDetailList(id),
        ]);
        if (cancelled) return;
        setJourney(journeyData);
        const sorted = (detailsData || []).sort((a, b) => (a.Day ?? 0) - (b.Day ?? 0));
        setDetails(sorted);

        const extras = {};
        await Promise.all(
          sorted.map(async (d) => {
            const [dirs, gallery, hotels, cabs] = await Promise.all([
              journeyDirectoryList(d.Id),
              journeyGalleryList(d.Id),
              journeyHotelList(d.Id),
              journeyCabList(d.Id),
            ]);
            if (!cancelled) {
              extras[d.Id] = { directories: dirs || [], gallery: gallery || [], hotels: hotels || [], cabs: cabs || [] };
            }
          })
        );
        if (!cancelled) setDetailExtras(extras);
      } catch (e) {
        if (!cancelled) setJourney(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="journey-detail-page">
        <p className="loading-msg">Loading journey...</p>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="journey-detail-page">
        <p className="empty-msg">Journey not found.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/journeys')}>Back to Journeys</button>
      </div>
    );
  }

  const photoUrl = getPhotoUrl(journey.Photo);

  return (
    <div className="journey-detail-page">
      <div className="journey-header">
        <button className="btn btn-secondary btn-back" onClick={() => navigate('/journeys')}>← Back to Journeys</button>
        <div className="journey-hero">
          {photoUrl && <img src={photoUrl} alt="" className="journey-hero-image" />}
          <div className="journey-hero-content">
            <h1>{journey.Title}</h1>
            {journey.Description && <p className="journey-desc">{journey.Description}</p>}
            <div className="journey-meta">
              <span>From: {formatDate(journey.DateFrom)}</span>
              <span>To: {formatDate(journey.DateTo)}</span>
              <span>{journey.NoOfDays} days</span>
              {journey.Customer?.Name && <span>Customer: {journey.Customer.Name}</span>}
            </div>
          </div>
        </div>
      </div>

      <h2 className="itinerary-title">Itinerary</h2>
      <div className="itinerary-list">
        {details.length === 0 ? (
          <p className="empty-msg">No itinerary details.</p>
        ) : (
          details.map((d, idx) => {
            const extras = detailExtras[d.Id] || { directories: [], gallery: [], hotels: [], cabs: [] };
            return (
              <div key={d.Id} className="itinerary-card">
                <div className="itinerary-day-header">
                  <span className="day-badge">Day {d.Day ?? idx + 1}</span>
                  <h3>{d.Title}</h3>
                  {d.Destination?.Name && <span className="destination-tag">{d.Destination.Name}</span>}
                </div>
                {(d.Date || d.Time) && (
                  <div className="itinerary-meta">
                    {d.Date && <span>{formatDate(d.Date)}</span>}
                    {d.Time && <span>{d.Time}</span>}
                  </div>
                )}
                {d.Description && <p className="itinerary-desc">{d.Description}</p>}

                {extras.directories.length > 0 && (
                  <div className="detail-section">
                    <h4>Contacts & Info</h4>
                    <div className="directory-list">
                      {extras.directories.map((dir) => (
                        <div key={dir.Id} className="directory-item">
                          {dir.ContactPerson && <strong>{dir.ContactPerson}</strong>}
                          {dir.ContactType && <span> ({dir.ContactType})</span>}
                          {dir.ContactNo && <span> — {dir.ContactNo}</span>}
                          {dir.Description && <p>{dir.Description}</p>}
                          {dir.Cost != null && <span>Cost: {dir.Cost}</span>}
                          {dir.Photo && (
                            <div className="dir-photo">
                              <img src={getPhotoUrl(dir.Photo)} alt="" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {extras.gallery.length > 0 && (
                  <div className="detail-section">
                    <h4>Gallery</h4>
                    <div className="gallery-grid">
                      {extras.gallery.filter((g) => g.Photo).map((g) => (
                        <div key={g.Id} className="gallery-item">
                          <img src={getPhotoUrl(g.Photo)} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {extras.hotels.length > 0 && (
                  <div className="detail-section">
                    <h4>Hotels</h4>
                    <ul className="simple-list">
                      {extras.hotels.map((h) => (
                        <li key={h.Id}>{h.Hotel?.Name || '—'} {h.Destination?.Name && `(${h.Destination.Name})`}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {extras.cabs.length > 0 && (
                  <div className="detail-section">
                    <h4>Cabs</h4>
                    <ul className="simple-list">
                      {extras.cabs.map((c) => (
                        <li key={c.Id}>{c.Vehicle?.Model || '—'} — Rate: {c.Vehicle?.Rate ?? '—'} {c.Destination?.Name && `(${c.Destination.Name})`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

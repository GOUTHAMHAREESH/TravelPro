export const API_BASE = 'http://localhost:61792';

function getAuthHeaders() {
  const stored = localStorage.getItem('travelProUser');
  const user = stored ? JSON.parse(stored) : null;
  const token = user?.Token;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ UserName: username, Password: password }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  return data;
}

export async function logout(token) {
  const response = await fetch(`${API_BASE}/LogOut`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Token: token }),
  });
  if (!response.ok) return false;
  return response.json();
}

// Country
export async function countryList() {
  const res = await fetch(`${API_BASE}/CountryList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addCountry(data) {
  const res = await fetch(`${API_BASE}/AddCountry`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function getCountryById(id) {
  const res = await fetch(`${API_BASE}/GetCountryById/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
export async function deleteCountry(id) {
  const res = await fetch(`${API_BASE}/DeleteCountry/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Brand
export async function brandList() {
  const res = await fetch(`${API_BASE}/BrandList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addBrand(data) {
  const res = await fetch(`${API_BASE}/AddBrand`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function deleteBrand(id) {
  const res = await fetch(`${API_BASE}/DeleteBrand/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Hotel Type
export async function hotelTypeList() {
  const res = await fetch(`${API_BASE}/HotelTypeList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addHotelType(data) {
  const res = await fetch(`${API_BASE}/AddHotelType`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function deleteHotelType(id) {
  const res = await fetch(`${API_BASE}/DeleteHotelType/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Vehicle Type
export async function vehicleTypeList() {
  const res = await fetch(`${API_BASE}/VehicleTypeList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addVehicleType(data) {
  const res = await fetch(`${API_BASE}/AddVehicleType`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function getVehicleTypeById(id) {
  const res = await fetch(`${API_BASE}/GetVehicleTypeById/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
export async function deleteVehicleType(id) {
  const res = await fetch(`${API_BASE}/DeleteVehicleType/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Destination
export async function destinationList() {
  const res = await fetch(`${API_BASE}/DestinationList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addDestination(data) {
  const res = await fetch(`${API_BASE}/AddDestination`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function getDestinationById(id) {
  const res = await fetch(`${API_BASE}/GetDestinationById/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
export async function deleteDestination(id) {
  const res = await fetch(`${API_BASE}/DeleteDestination/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Customer
export async function customerList() {
  const res = await fetch(`${API_BASE}/CustomerList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Journey
export async function journeyList() {
  const res = await fetch(`${API_BASE}/JourneyList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function getJourneyById(id) {
  const res = await fetch(`${API_BASE}/GetJourneyById/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function journeyDetailList(journeyId) {
  const res = await fetch(`${API_BASE}/JourneyDetailList/${journeyId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function journeyDirectoryList(detailId) {
  const res = await fetch(`${API_BASE}/JourneyDirectoryList/${detailId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function journeyGalleryList(detailId) {
  const res = await fetch(`${API_BASE}/JourneyGalleryList/${detailId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function journeyHotelList(detailId) {
  const res = await fetch(`${API_BASE}/JourneyHotelList/${detailId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function journeyCabList(detailId) {
  const res = await fetch(`${API_BASE}/JourneyCabList/${detailId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Driver
export async function driverList() {
  const res = await fetch(`${API_BASE}/DriverList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addDriver(data) {
  const res = await fetch(`${API_BASE}/AddDriver`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function deleteDriver(id) {
  const res = await fetch(`${API_BASE}/DeleteDriver/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Vehicle
export async function vehicleList() {
  const res = await fetch(`${API_BASE}/VehicleList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addVehicle(data) {
  const res = await fetch(`${API_BASE}/AddVehicle`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function deleteVehicle(id) {
  const res = await fetch(`${API_BASE}/DeleteVehicle/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Hotel
export async function hotelList() {
  const res = await fetch(`${API_BASE}/HotelList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function addHotel(data) {
  const res = await fetch(`${API_BASE}/AddHotel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.Message || err.message || 'Failed to save');
  }
  return res.json();
}
export async function deleteHotel(id) {
  const res = await fetch(`${API_BASE}/DeleteHotel/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Agency
export async function agencyList() {
  const res = await fetch(`${API_BASE}/AgencyList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// User Verification (Admin approval)
export async function pendingUsers() {
  const res = await fetch(`${API_BASE}/api/UserVerification/PendingUsers`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
export async function approveUser(id) {
  const res = await fetch(`${API_BASE}/api/UserVerification/ApproveUser/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Cab Booking
export async function cabBookingList() {
  const res = await fetch(`${API_BASE}/CabBookingList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Hotel Booking
export async function hotelBookingList() {
  const res = await fetch(`${API_BASE}/HotelBookingList`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

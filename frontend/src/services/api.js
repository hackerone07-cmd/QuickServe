import axios from 'axios';
import { mockReviews, mockServices } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export function getErrorMessage(error, fallback = 'Something went wrong.') {
  return error.response?.data?.message || error.message || fallback;
}

export async function getServices() {
  try {
    const response = await api.get('/services');
    return { data: response.data, source: 'api' };
  } catch (error) {
    if (!error.response) {
      return { data: mockServices, source: 'mock' };
    }

    throw error;
  }
}

export async function getServiceById(id) {
  try {
    const response = await api.get(`/services/${id}`);
    return { data: response.data, source: 'api' };
  } catch (error) {
    if (!error.response) {
      const service = mockServices.find((item) => String(item._id) === String(id));

      if (service) {
        return { data: service, source: 'mock' };
      }
    }

    throw error;
  }
}

export async function getProviderReviews(providerId) {
  try {
    const response = await api.get(`/reviews/provider/${providerId}`);
    return { data: response.data, source: 'api' };
  } catch (error) {
    if (!error.response) {
      return { data: mockReviews[providerId] || [], source: 'mock' };
    }

    throw error;
  }
}

export async function loginUser(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function createBooking(payload) {
  const response = await api.post('/bookings', payload);
  return response.data ? { data: response.data } : response;
}

export async function getUserBookings() {
  return api.get('/bookings/user');
}

export async function getProviderBookings() {
  return api.get('/bookings/provider');
}

export async function updateBookingStatus(id, status) {
  return api.put(`/bookings/${id}`, { status });
}

export async function createService(formData) {
  return api.post('/services', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function createReview(payload) {
  const response = await api.post('/reviews', payload);
  return { data: response.data };
}

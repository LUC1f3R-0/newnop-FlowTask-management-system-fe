import axios from 'axios';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const axiosApiInstance = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'x-api-key': import.meta.env.VITE_X_API_KEY,
  },
});
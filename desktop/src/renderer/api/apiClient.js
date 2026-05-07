import axios from 'axios';
import { authStore } from '../state/authStore.js';

let runtimeConfigPromise = null;

async function getRuntimeApiUrl() {
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = window.desktopApp?.getConfig?.()
      .then((config) => config?.apiUrl)
      .catch(() => null);
  }

  return runtimeConfigPromise;
}

function parseData(data) {
  if (!data || typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function cleanHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers || {}).filter(([, value]) => value !== undefined && value !== null)
  );
}

function formatError(data) {
  if (!data) return 'The voting API returned an error.';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.map(formatError).join(' ');
  if (data.detail || data.message || data.error) return data.detail || data.message || data.error;
  if (typeof data === 'object') {
    return Object.entries(data)
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : formatError(value)}`)
      .join(' ');
  }
  return 'The voting API returned an error.';
}

const apiClient = axios.create({
  baseURL: process.env.API_URL || 'http://127.0.0.1:8000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },

  adapter: async (config) => {
    if (!window.votingApi?.request) {
      throw new Error('Desktop API bridge is unavailable.');
    }

    const response = await window.votingApi.request({
      baseURL: await getRuntimeApiUrl() || config.baseURL,
      url: config.url,
      method: config.method,
      data: parseData(config.data),
      params: config.params,
      headers: cleanHeaders(config.headers),
      timeout: config.timeout
    });

    if (response.error) {
      const err = new Error(response.message || 'The voting API returned an error.');
      err.response = response.response;
      err.config = config;
      throw err;
    }

    return { ...response, config, request: null };
  }
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) authStore.clearAuth();
    if (err.response?.status === 403) {
      authStore.setNotice('Access denied');
      return Promise.reject(new Error('Access Denied'));
    }
    if (!err.response) {
      return Promise.reject(
        new Error('Unable to reach the voting API. Check the API URL and your network connection.')
      );
    }
    return Promise.reject(new Error(formatError(err.response.data)));
  }
);

export default apiClient;

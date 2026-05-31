import { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient.js';

const CHECK_ENDPOINT = '/election/elections/';

export function useConnectionStatus(intervalMs = 30000) {
  const [connection, setConnection] = useState({
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    checkedAt: null,
    message: 'Checking backend connection...',
    status: 'checking'
  });

  const checkConnection = useCallback(async () => {
    try {
      const response = await apiClient.get(CHECK_ENDPOINT, { timeout: 5000 });
      const reachable = response.status === 200 || response.status === 401 || response.status === 403;

      setConnection({
        apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
        checkedAt: new Date(),
        message: reachable ? 'Backend reachable' : 'Backend check failed',
        status: reachable ? 'online' : 'offline'
      });
    } catch (error) {
      setConnection({
        apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
        checkedAt: new Date(),
        message: error.message || 'Backend is offline',
        status: 'offline'
      });
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const timer = window.setInterval(checkConnection, intervalMs);
    return () => window.clearInterval(timer);
  }, [checkConnection, intervalMs]);

  return { connection, refreshConnection: checkConnection };
}

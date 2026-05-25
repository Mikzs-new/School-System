import { useCallback, useEffect, useState } from 'react';

const CHECK_ENDPOINT = '/api/v1/election/elections/';

async function getApiUrl() {
  const config = await window.desktopApp?.getConfig?.();
  return config?.apiUrl || 'http://127.0.0.1:8000';
}

export function useConnectionStatus(intervalMs = 30000) {
  const [connection, setConnection] = useState({
    apiUrl: '',
    checkedAt: null,
    message: 'Checking backend connection...',
    status: 'checking'
  });

  const checkConnection = useCallback(async () => {
    if (!window.votingApi?.request) {
      setConnection({
        apiUrl: '',
        checkedAt: new Date(),
        message: 'Electron API bridge is unavailable.',
        status: 'offline'
      });
      return;
    }

    const apiUrl = await getApiUrl();

    try {
      const response = await window.votingApi.request({
        baseURL: apiUrl,
        url: CHECK_ENDPOINT,
        method: 'GET',
        timeout: 5000
      });

      const status = response.status || response.response?.status;
      const reachable = !response.error || [401, 403, 404, 405].includes(status);

      setConnection({
        apiUrl,
        checkedAt: new Date(),
        message: reachable ? 'Backend reachable' : response.message || 'Backend check failed',
        status: reachable ? 'online' : 'offline'
      });
    } catch (error) {
      setConnection({
        apiUrl,
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

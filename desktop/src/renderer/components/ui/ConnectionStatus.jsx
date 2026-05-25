import React from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function ConnectionStatus({ connection, onRefresh }) {
  const isOnline = connection.status === 'online';
  const isChecking = connection.status === 'checking';
  const Icon = isOnline ? Wifi : WifiOff;
  const label = isChecking ? 'Checking backend' : isOnline ? 'Backend online' : 'Backend offline';

  return (
    <button
      className={`connection-pill ${connection.status}`}
      title={`${connection.message}${connection.apiUrl ? ` (${connection.apiUrl})` : ''}`}
      type="button"
      onClick={onRefresh}
    >
      {isChecking ? <RefreshCw size={16} className="spin" /> : <Icon size={16} />}
      <span>{label}</span>
    </button>
  );
}

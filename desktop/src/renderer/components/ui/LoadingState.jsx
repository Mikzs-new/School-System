import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="loading-state">
      <Loader2 size={18} className="spin" />
      <span>{label}</span>
    </div>
  );
}

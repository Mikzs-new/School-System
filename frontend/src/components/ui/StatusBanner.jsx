import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const ICONS = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2
};

export default function StatusBanner({ children, type = 'info' }) {
  if (!children) return null;
  const Icon = ICONS[type] || Info;

  return (
    <div className={`status-banner ${type}`}>
      <Icon size={18} />
      <span>{children}</span>
    </div>
  );
}

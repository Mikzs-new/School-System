import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info' // 'error', 'success', 'warning', 'info'
}) {
  if (!isOpen) return null;

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type] || Info;

  const typeStyles = {
    error: 'notification-error',
    success: 'notification-success',
    warning: 'notification-warning',
    info: 'notification-info'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <div className={`notification-icon ${typeStyles[type]}`}>
            <Icon size={24} />
          </div>
          <h3 className="notification-title">{title}</h3>
          <button
            className="notification-close"
            onClick={onClose}
            aria-label="Close notification"
          >
            <X size={20} />
          </button>
        </div>
        <div className="notification-body">
          <p className="notification-message">{message}</p>
        </div>
        <div className="notification-footer">
          <button className="notification-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

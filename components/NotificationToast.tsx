
import React, { useEffect } from 'react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  notifications: AppNotification[];
  removeNotification: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ notification: AppNotification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-teal-50 border-teal-200 text-teal-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: 'fa-circle-info',
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-exclamation',
  };

  return (
    <div className={`pointer-events-auto p-4 rounded-2xl border shadow-lg flex items-start gap-4 animate-slide-in-right ${typeStyles[notification.type]}`}>
      <div className="mt-1">
        <i className={`fa-solid ${icons[notification.type]} text-lg`}></i>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold leading-tight">{notification.message}</p>
      </div>
      <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600">
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
};

export default NotificationToast;

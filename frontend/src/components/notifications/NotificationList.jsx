import { useState, useEffect, useCallback } from 'react';
import { getNotificationsApi, markAllReadApi } from '../../services/notificationApi';
import NotificationCard from './NotificationCard';
import Loader from '../common/Loader';
import { CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import useSocket from '../../hooks/useSocket';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotificationsApi()
      .then((r) => setNotifications(r.data.data.notifications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Real-time: prepend new notification when received via socket
  const handleNewNotification = useCallback((notif) => {
    setNotifications((prev) => [notif, ...prev]);
  }, []);
  useSocket('notification', handleNewNotification);

  const handleRead = (id) => {
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, readStatus: true } : n));
  };

  const handleMarkAll = async () => {
    await markAllReadApi();
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
    toast.success('All marked as read');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader /></div>;

  const unread = notifications.filter((n) => !n.readStatus).length;

  return (
    <div>
      {unread > 0 && (
        <div className="flex justify-end mb-3">
          <button onClick={handleMarkAll} className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-400">
            <CheckCheck size={13} /> Mark all read
          </button>
        </div>
      )}
      {notifications.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-brand-700 text-sm">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationCard key={n._id} notification={n} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
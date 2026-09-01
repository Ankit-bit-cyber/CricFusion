import MainLayout from '../layouts/MainLayout';
import NotificationList from '../components/notifications/NotificationList';
import { Bell } from 'lucide-react';

const Notifications = () => (
  <MainLayout>
    <div className="max-w-xl">
      <h1 className="text-lg font-semibold text-brand-200 flex items-center gap-2 mb-5">
        <Bell size={18} className="text-brand-500" /> Notifications
      </h1>
      <NotificationList />
    </div>
  </MainLayout>
);

export default Notifications;
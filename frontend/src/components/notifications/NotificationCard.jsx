import { Heart, MessageCircle, UserPlus, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { markReadApi } from '../../services/notificationApi';
import { getAvatarUrl } from '../../utils/helpers';
import { timeAgo } from '../../utils/formatDate';

const icons = {
  like: <Heart size={14} className="text-red-400" />,
  comment: <MessageCircle size={14} className="text-brand-400" />,
  follow: <UserPlus size={14} className="text-green-400" />,
  match_alert: <Radio size={14} className="text-yellow-400" />,
};

const NotificationCard = ({ notification, onRead }) => {
  const handleClick = async () => {
    if (!notification.readStatus) {
      await markReadApi(notification._id).catch(() => {});
      onRead?.(notification._id);
    }
  };

  const content = (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
        notification.readStatus
          ? 'border-brand-900/20 bg-transparent'
          : 'border-brand-800/40 bg-brand-900/20'
      } hover:bg-brand-900/30`}
    >
      <div className="relative shrink-0">
        <img
          src={getAvatarUrl(notification.senderId?.avatar, notification.senderId?.name)}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="absolute -bottom-1 -right-1 bg-dark-800 rounded-full p-0.5">
          {icons[notification.type]}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-brand-200">{notification.message}</p>
        <p className="text-xs text-brand-700 mt-0.5">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.readStatus && (
        <div className="w-2 h-2 bg-brand-500 rounded-full shrink-0 mt-2" />
      )}
    </div>
  );

  return notification.postId ? (
    <Link to={`/posts/${notification.postId}`}>{content}</Link>
  ) : content;
};

export default NotificationCard;
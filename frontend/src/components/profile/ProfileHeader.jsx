import { useState } from 'react';
import { Edit2, UserCheck, UserPlus } from 'lucide-react';
import { followUserApi } from '../../services/userApi';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';
import { formatDate } from '../../utils/formatDates';
import toast from 'react-hot-toast';

const ProfileHeader = ({ user: profileUser, onEdit, onFollowChange }) => {
  const { user: currentUser } = useAuth();
  const isOwn = profileUser?._id === currentUser?._id;
  const [isFollowing, setIsFollowing] = useState(
    profileUser?.followers?.some((f) => f._id === currentUser?._id || f === currentUser?._id)
  );
  const [followerCount, setFollowerCount] = useState(profileUser?.followers?.length || 0);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      await followUserApi(profileUser._id);
      const nowFollowing = !isFollowing;
      setIsFollowing(nowFollowing);
      setFollowerCount((c) => (nowFollowing ? c + 1 : c - 1));
      if (onFollowChange) onFollowChange();
    } catch {
      toast.error('Failed to update follow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-start gap-5">
        <div className="relative shrink-0">
          <img
            src={getAvatarUrl(profileUser?.avatar, profileUser?.name)}
            alt={profileUser?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-900"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-500 rounded-full border-2 border-dark-800" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-brand-50">{profileUser?.name}</h1>
              <p className="text-sm text-brand-700">{profileUser?.email}</p>
              {profileUser?.favoriteTeam && (
                <span className="mt-1 inline-block badge bg-brand-900/60 text-brand-400 border border-brand-800/40">
                  🏏 {profileUser.favoriteTeam}
                </span>
              )}
            </div>
            {isOwn ? (
              <button onClick={onEdit} className="btn-outline flex items-center gap-2 text-sm">
                <Edit2 size={14} /> Edit
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={loading}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                  isFollowing
                    ? 'bg-brand-900/40 text-brand-500 border border-brand-800 hover:border-red-800 hover:text-red-400'
                    : 'btn-primary'
                } disabled:opacity-60`}
              >
                {isFollowing ? <><UserCheck size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
              </button>
            )}
          </div>

          {profileUser?.bio && (
            <p className="mt-2 text-sm text-brand-300 leading-relaxed">{profileUser.bio}</p>
          )}

          <div className="mt-3 flex gap-4 text-sm">
            <div>
              <span className="font-semibold text-brand-200">{followerCount}</span>
              <span className="text-brand-700 ml-1">Followers</span>
            </div>
            <div>
              <span className="font-semibold text-brand-200">{profileUser?.following?.length || 0}</span>
              <span className="text-brand-700 ml-1">Following</span>
            </div>
            <div>
              <span className="text-brand-800 text-xs">Joined {formatDate(profileUser?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
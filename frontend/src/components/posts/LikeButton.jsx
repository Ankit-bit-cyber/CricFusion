import { useState } from 'react';
import { Heart } from 'lucide-react';
import { likePostApi } from '../../services/postApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LikeButton = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const isLiked = post.likes?.includes(user?._id);
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(post.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    const prev = liked;
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));
    try {
      const res = await likePostApi(post._id);
      if (onUpdate) onUpdate(res.data.data);
    } catch {
      setLiked(prev);
      setCount((c) => (prev ? c + 1 : c - 1));
      toast.error('Failed to like post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1.5 text-sm transition-all active:scale-90 ${
        liked ? 'text-red-400' : 'text-brand-700 hover:text-red-400'
      }`}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
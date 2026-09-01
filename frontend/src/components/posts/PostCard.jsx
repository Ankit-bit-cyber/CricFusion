import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Trash2, Edit2, MoreHorizontal } from 'lucide-react';
import { deletePostApi } from '../../services/postApi';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';
import { timeAgo } from '../../utils/formatDates';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

const PostCard = ({ post, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = post.userId?._id === user?._id || post.userId === user?._id;

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await deletePostApi(post._id);
      toast.success('Post deleted');
      if (onDelete) onDelete(post._id);
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  const highlightHashtags = (text) =>
    text.split(/(#\w+)/g).map((part, i) =>
      part.startsWith('#') ? (
        <Link key={i} to={`/search?q=${part.slice(1)}`} className="text-brand-400 hover:text-brand-300">
          {part}
        </Link>
      ) : part
    );

  return (
    <article className="card p-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <Link to={`/profile/${post.userId?._id}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img
            src={getAvatarUrl(post.userId?.avatar, post.userId?.name)}
            alt={post.userId?.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-900"
          />
          <div>
            <p className="text-sm font-semibold text-brand-100">{post.userId?.name}</p>
            <p className="text-xs text-brand-700">{timeAgo(post.createdAt)}</p>
          </div>
        </Link>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-brand-700 hover:text-brand-400 rounded-lg hover:bg-brand-900/30 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-dark-700 border border-brand-900/40 rounded-xl shadow-xl py-1 z-10 animate-fade-in">
                <button
                  onClick={() => { onEdit?.(post); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-400 hover:bg-brand-900/30"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 size={13} /> {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-sm text-brand-100 leading-relaxed whitespace-pre-wrap">
          {highlightHashtags(post.content)}
        </p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="mt-3 w-full rounded-xl object-cover max-h-96 border border-brand-900/30"
          />
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-brand-900/30 flex items-center gap-5">
        <LikeButton post={post} />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-400 transition-colors"
        >
          <MessageCircle size={16} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </article>
  );
};

export default PostCard;
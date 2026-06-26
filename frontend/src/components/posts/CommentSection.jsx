import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { addCommentApi, getCommentsApi, deleteCommentApi } from '../../services/postApi';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';
import { timeAgo as ago } from '../../utils/formatDate';
import Loader from '../common/Loader';
import toast from 'react-hot-toast';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCommentsApi(postId)
      .then((r) => setComments(r.data.data.comments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await addCommentApi(postId, text.trim());
      setComments([res.data.data.comment, ...comments]);
      setText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCommentApi(id);
      setComments(comments.filter((c) => c._id !== id));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <img
          src={getAvatarUrl(user?.avatar, user?.name)}
          alt=""
          className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
        />
        <div className="flex-1 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            maxLength={300}
            className="input text-sm py-1.5 flex-1"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="btn-primary px-3 py-1.5 disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-2"><Loader size="sm" /></div>
      ) : (
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2 group">
              <img
                src={getAvatarUrl(c.userId?.avatar, c.userId?.name)}
                alt=""
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 bg-dark-700 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-brand-400">{c.userId?.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-800">{ago(c.createdAt)}</span>
                    {c.userId?._id === user?._id && (
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-brand-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-brand-200 mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-xs text-brand-800 text-center py-2">No comments yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
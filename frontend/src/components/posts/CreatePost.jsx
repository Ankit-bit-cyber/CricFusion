import { useState } from 'react';
import { Image, X, Send } from 'lucide-react';
import { createPostApi } from '../../services/postApi';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';
import { MAX_POST_LENGTH } from '../../utils/constants';
import toast from 'react-hot-toast';

const CreatePost = ({ onCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error('Post content is required');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('content', content.trim());
      if (image) fd.append('image', image);
      const res = await createPostApi(fd);
      setContent('');
      removeImage();
      toast.success('Post created!');
      if (onCreated) onCreated(res.data.data.post);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const charsLeft = MAX_POST_LENGTH - content.length;

  return (
    <div className="card p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <img
            src={getAvatarUrl(user?.avatar, user?.name)}
            alt=""
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your cricket thoughts, match reactions, predictions…"
              maxLength={MAX_POST_LENGTH}
              rows={3}
              className="input resize-none text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${charsLeft < 50 ? 'text-red-400' : 'text-brand-800'}`}>
                {charsLeft} chars left
              </span>
            </div>
          </div>
        </div>

        {preview && (
          <div className="mt-3 relative">
            <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-900/30">
          <label className="flex items-center gap-2 text-brand-600 hover:text-brand-400 cursor-pointer text-sm transition-colors">
            <Image size={16} />
            <span>Photo</span>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn-primary flex items-center gap-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={14} /> Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
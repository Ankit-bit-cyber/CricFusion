import { useState } from 'react';
import { Camera } from 'lucide-react';
import { updateUserApi } from '../../services/userApi';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EditProfile = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', favoriteTeam: user?.favoriteTeam || '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio', form.bio);
      fd.append('favoriteTeam', form.favoriteTeam);
      if (avatar) fd.append('avatar', avatar);
      const res = await updateUserApi(user._id, fd);
      updateUser(res.data.data.user);
      toast.success('Profile updated!');
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const TEAMS = ['India', 'Australia', 'England', 'Pakistan', 'South Africa', 'New Zealand', 'West Indies', 'Sri Lanka'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center">
        <label className="relative cursor-pointer">
          <img
            src={preview || getAvatarUrl(user?.avatar, user?.name)}
            alt=""
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-900"
          />
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
          <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </label>
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-600 mb-1.5">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="input" maxLength={50} />
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-600 mb-1.5">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} className="input resize-none" rows={3} maxLength={200} />
        <p className="text-xs text-brand-800 mt-1">{200 - form.bio.length} chars left</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-600 mb-1.5">Favorite Team</label>
        <select name="favoriteTeam" value={form.favoriteTeam} onChange={handleChange} className="input">
          <option value="">Select team</option>
          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center">
          {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
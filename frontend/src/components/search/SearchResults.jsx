import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../../utils/helpers';
import Loader from '../common/Loader';

const SearchResults = ({ users, posts, loading }) => {
  if (loading) return <div className="flex justify-center py-8"><Loader /></div>;

  return (
    <div className="space-y-6">
      {users?.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">Users</h3>
          <div className="space-y-2">
            {users.map((u) => (
              <Link key={u._id} to={`/profile/${u._id}`} className="card p-3 flex items-center gap-3 hover:border-brand-700/50 transition-all block">
                <img src={getAvatarUrl(u.avatar, u.name)} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-brand-200">{u.name}</p>
                  <p className="text-xs text-brand-700">{u.bio || u.email}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {posts?.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">Posts</h3>
          <div className="space-y-2">
            {posts.map((p) => (
              <div key={p._id} className="card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <img src={getAvatarUrl(p.userId?.avatar, p.userId?.name)} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-brand-500">{p.userId?.name}</span>
                </div>
                <p className="text-sm text-brand-200">{p.content.slice(0, 120)}{p.content.length > 120 && '…'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!users?.length && !posts?.length && !loading && (
        <div className="card p-8 text-center">
          <p className="text-brand-700 text-sm">No results found.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
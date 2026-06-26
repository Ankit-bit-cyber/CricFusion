import { useState, useEffect, useCallback } from 'react';
import { getFeedApi } from '../../services/postApi';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import Loader from '../common/Loader';
import { RefreshCw } from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (p = 1, append = false) => {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await getFeedApi(p);
      const { posts: newPosts, pagination } = res.data.data;
      setPosts(append ? (prev) => [...prev, ...newPosts] : newPosts);
      setHasMore(p < pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  const handleCreated = (post) => setPosts((prev) => [post, ...prev]);
  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p._id !== id));

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next, true);
  };

  if (loading) return (
    <div className="flex justify-center py-12"><Loader size="lg" /></div>
  );

  return (
    <div className="space-y-4">
      <CreatePost onCreated={handleCreated} />

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-brand-600">Latest Posts</h2>
        <button
          onClick={() => fetchPosts(1)}
          className="flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-400 transition-colors"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-brand-700 text-sm">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDelete} />
        ))
      )}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full py-3 text-sm text-brand-600 hover:text-brand-400 border border-brand-900/40 rounded-xl hover:bg-brand-900/20 transition-all disabled:opacity-50"
        >
          {loadingMore ? <Loader size="sm" /> : 'Load more posts'}
        </button>
      )}
    </div>
  );
};

export default Feed;
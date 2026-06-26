import PostCard from '../posts/PostCard';
import Loader from '../common/Loader';

const UserPosts = ({ posts, loading }) => {
    if (loading) return <div className="flex justify-center py-8"><Loader /></div>;
    if (!posts?.length) return (
        <div className="card p-8 text-center">
            <p className="text-brand-700 text-sm">No posts yet.</p>
        </div>
    );
    return (
        <div className="space-y-4">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
    );
};

export default UserPosts;
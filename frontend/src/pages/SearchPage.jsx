import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SearchBar from '../components/search/Searchbar';
import SearchResults from '../components/search/SearchResults';
import { searchUsersApi } from '../services/userApi';
import { searchPostsApi } from '../services/postApi';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q) => {
    setSearchParams(q ? { q } : {});
    if (!q.trim()) { setUsers([]); setPosts([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const [usersRes, postsRes] = await Promise.all([searchUsersApi(q), searchPostsApi(q)]);
      setUsers(usersRes.data.data.users);
      setPosts(postsRes.data.data.posts);
    } catch {
      setUsers([]); setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl space-y-5">
        <h1 className="text-lg font-semibold text-brand-200">Search</h1>
        <SearchBar onSearch={handleSearch} />
        {searched && <SearchResults users={users} posts={posts} loading={loading} />}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
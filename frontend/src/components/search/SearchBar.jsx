import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../../utils/helpers';

const SearchBar = ({ onSearch, placeholder = 'Search players, teams, users, hashtags…' }) => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(debounce((q) => onSearch(q), 400), [onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const clear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-700" />
      <input
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="input pl-10 pr-9"
      />
      {query && (
        <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-700 hover:text-brand-400">
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
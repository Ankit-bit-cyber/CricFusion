import MainLayout from '../layouts/MainLayout';
import Feed from '../components/posts/Feed';
import LiveScoreCard from '../components/matches/LiveScoreCard';
import { getLiveMatchesApi } from '../services/matchApi';
import useFetch from '../hooks/useFetch';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { data, loading } = useFetch(getLiveMatchesApi);
  const matches = data?.matches?.slice(0, 3) || [];

  return (
    <MainLayout>
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <Feed />
        </div>

        {/* Right widget panel */}
        <aside className="hidden xl:block w-72 shrink-0">
          <div className="sticky top-20 space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-brand-400 flex items-center gap-2">
                  <Trophy size={14} /> Live Matches
                </h3>
                <Link to="/matches" className="text-xs text-brand-700 hover:text-brand-400">See all</Link>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[1,2].map(i => <div key={i} className="h-16 bg-dark-700 rounded-lg animate-pulse" />)}
                </div>
              ) : matches.length > 0 ? (
                <div className="space-y-2">
                  {matches.map((m) => <LiveScoreCard key={m.id} match={m} />)}
                </div>
              ) : (
                <p className="text-xs text-brand-800 text-center py-4">No live matches right now</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default Home;
import { useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import MatchStats from '../components/matches/MatchStats';
import MatchTimeline from '../components/matches/MatchTimeLine';
import MatchDiscussion from '../components/matches/MatchDiscussion';
import LiveScoreCard from '../components/matches/LiveScoreCard';
import useFetch from '../hooks/useFetch';
import { getLiveMatchesApi, getMatchApi } from '../services/matchApi';
import Loader from '../components/common/Loader';
import { Trophy } from 'lucide-react';

const MatchPage = () => {
  const { id } = useParams();
  const isDetail = !!id;

  const { data: liveData, loading: liveLoading } = useFetch(getLiveMatchesApi, [], !isDetail);
  const { data: matchData, loading: matchLoading } = useFetch(() => getMatchApi(id), [id], isDetail);

  if (isDetail) {
    if (matchLoading) return <MainLayout><div className="flex justify-center py-12"><Loader size="lg" /></div></MainLayout>;
    return (
      <MainLayout>
        <div className="space-y-5">
          <h1 className="text-lg font-semibold text-brand-200 flex items-center gap-2">
            <Trophy size={18} className="text-brand-500" /> Match Details
          </h1>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <MatchStats match={matchData?.match} />
              <MatchTimeline match={matchData?.match} />
            </div>
            <MatchDiscussion matchId={id} />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-5">
        <h1 className="text-lg font-semibold text-brand-200 flex items-center gap-2">
          <Trophy size={18} className="text-brand-500" /> Live Matches
        </h1>
        {liveLoading ? (
          <div className="flex justify-center py-12"><Loader size="lg" /></div>
        ) : liveData?.matches?.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {liveData.matches.map((m) => <LiveScoreCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Trophy size={32} className="text-brand-800 mx-auto mb-3" />
            <p className="text-brand-700">No live matches right now. Check back soon!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MatchPage;
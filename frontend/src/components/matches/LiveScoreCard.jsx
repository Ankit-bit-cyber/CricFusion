import {Link} from "react-router-dom";
import { Radio, ChevronRight } from 'lucide-react';

const LiveScoreCard = ({match})=>{
    const Team = match?.teams || ['Team A', 'Team B'];
    const Score = match?.score || [];
    const Status = match?.status || 'Live';
    const isLive = match?.matchStarted && !match?.matchEnded;

    return (
    <Link
      to={`/matches/${match?.id}`}
      className="card p-4 hover:border-brand-700/50 transition-all block group">
        
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isLive && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-400 badge bg-red-900/20 border border-red-900/30">
                <Radio size={9} className="animate-pulse" /> LIVE
              </span>
            )}
            <span className="text-xs text-brand-700 truncate">{match?.matchType?.toUpperCase()} • {match?.venue}</span>
          </div>

          <div className="space-y-1.5">
            {teams.map((team, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-100 truncate">{team}</span>
                <span className="text-sm font-mono text-brand-300 ml-2 shrink-0">
                  {score[i]?.r !== undefined ? `${score[i].r}/${score[i].w} (${score[i].o})` : '--'}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-brand-500 mt-2 truncate">{status}</p>
        </div>
        <ChevronRight size={16} className="text-brand-800 shrink-0 mt-1 group-hover:text-brand-500 transition-colors" />
      </div>
    </Link>
  );
}

export default LiveScoreCard;
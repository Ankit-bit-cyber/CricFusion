const MatchStats = ({ match }) => {
  if (!match) return null;
  const score = match.score || [];
  const teams = match.teams || [];

  return (
    <div className="card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider">Scorecard</h3>
      {teams.map((team, i) => (
        <div key={i} className="bg-dark-700 rounded-xl p-4">
          <p className="text-sm font-semibold text-brand-200 mb-2">{team}</p>
          {score[i] ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xl font-bold text-brand-300">{score[i].r ?? '--'}</p>
                <p className="text-xs text-brand-700">Runs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-brand-300">{score[i].w ?? '--'}</p>
                <p className="text-xs text-brand-700">Wickets</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-brand-300">{score[i].o ?? '--'}</p>
                <p className="text-xs text-brand-700">Overs</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-700">Yet to bat</p>
          )}
        </div>
      ))}
      <div className="text-center pt-2">
        <p className="text-sm text-brand-400 font-medium">{match.status}</p>
      </div>
    </div>
  );
};

export default MatchStats;
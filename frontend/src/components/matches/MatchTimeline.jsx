const MatchTimeLine = ({match})=>{
    const events = [
        {lebel: 'Match Type', value: match?.matchType?. toUpperCase()},
        {lebel: 'Venue', value: match?.venue},
        {lebel: 'Date', value: match?.date},
        {lebel: 'Series', value: match?.series},
        {lebel: 'Toss', value: match?.tossWinner ? `${match.tossWinner} won the toss` : null },

    ].filter((e)=> e.value);

     return (
    <div className="card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider">Match Info</h3>
      {events.map((e, i) => (
        <div key={i} className="flex justify-between items-start gap-4">
          <span className="text-xs text-brand-700 shrink-0">{e.label}</span>
          <span className="text-xs text-brand-300 text-right">{e.value}</span>
        </div>
      ))}
    </div>
  );
}
export default MatchTimeLine;
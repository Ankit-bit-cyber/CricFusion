const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-dark-900 flex">
    {/* Left panel – branding */}
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-dark-900 via-dark-800 to-brand-950 p-12 border-r border-brand-900/30 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-600/5 rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/50">
            <span className="text-white text-lg">🏏</span>
          </div>
          <span className="font-display text-2xl tracking-wide text-brand-400">CricConnect</span>
        </div>

        <h2 className="text-4xl font-display tracking-wide text-brand-50 leading-tight mb-4">
          Your Cricket<br />Community
        </h2>
        <p className="text-brand-600 text-base leading-relaxed max-w-xs">
          Live scores, match discussions, fan posts, and everything cricket — all in one place.
        </p>
      </div>

      <div className="relative z-10 space-y-4">
        {[
          { icon: '📡', text: 'Live match scores & updates' },
          { icon: '💬', text: 'Real-time match discussions' },
          { icon: '🏆', text: 'Connect with cricket fans worldwide' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-brand-600">
            <span className="text-base">{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Right panel – form */}
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
import { Link } from 'react-router-dom';
import { Trophy, Radio, MessageCircle, Users, ChevronRight, Star, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020b05] text-white overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/60">
            <Trophy size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide text-green-400" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.12em' }}>
            CricConnect
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium text-green-400 border border-green-900/60 rounded-lg hover:bg-green-900/20 transition-all"
          >Sign In</Link>
          
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-600 rounded-lg transition-all shadow-lg shadow-green-900/50"
          >Register</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center">
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-green-700/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-600/6 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(34,197,94,0.6) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(34,197,94,0.6) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-800/50 bg-green-900/20 text-green-400 text-xs font-medium mb-8">
              <Radio size={10} className="animate-pulse" />
              Live match discussions happening now
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight">
              <span className="text-white">Cricket</span>
              <br />
              <span
                className="text-transparent"
                style={{
                  WebkitTextStroke: '2px rgba(74,222,128,0.7)',
                }}
              >
                Reimagined
              </span>
              <br />
              <span className="text-green-400">Social</span>
            </h1>

            <p className="text-lg text-green-900/70 text-gray-400 max-w-xl leading-relaxed mb-10" style={{ color: 'rgba(134,239,172,0.55)' }}>
              Live scores, real-time match discussions, fan posts, and the largest cricket community.
              All in one platform built for cricket obsessives.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group flex items-center gap-2 px-8 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-green-900/50 hover:shadow-green-800/60 hover:-translate-y-0.5"
              >
                Get Started Free
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-8 py-3.5 text-green-400 border border-green-800/60 rounded-xl hover:bg-green-900/20 font-semibold transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6 text-sm" style={{ color: 'rgba(134,239,172,0.4)' }}>
              <div className="flex -space-x-2">
                {['V', 'R', 'S', 'D'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-green-800/60 border-2 border-[#020b05] flex items-center justify-center text-xs font-bold text-green-400">
                    {l}
                  </div>
                ))}
              </div>
              <span>10,000+ cricket fans already joined</span>
            </div>
          </div>

          {/* Hero floating card */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-80">
            <div className="bg-[#061209]/80 backdrop-blur border border-green-900/40 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-red-400">LIVE</span>
                </div>
                <span className="text-xs text-green-900" style={{ color: 'rgba(74,222,128,0.3)' }}>IND vs AUS</span>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">🇮🇳 India</span>
                  <span className="font-mono text-green-300 text-sm font-bold">287 / 4 (48.2)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">🇦🇺 Australia</span>
                  <span className="font-mono text-green-800 text-sm">Yet to bat</span>
                </div>
              </div>
              <div className="h-px bg-green-900/30 mb-4" />
              <p className="text-xs text-green-700 mb-3">Match Discussion</p>
              {[
                { name: 'Rohit', msg: 'What a knock by Virat! 🔥', time: '2m' },
                { name: 'Priya', msg: 'India all the way! 🏏', time: '1m' },
                { name: 'Arjun', msg: 'Brilliant century! 💯', time: 'now' },
              ].map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-green-800/50 flex items-center justify-center text-xs font-bold text-green-400 shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-green-500">{c.name} </span>
                    <span className="text-xs text-green-900" style={{ color: 'rgba(134,239,172,0.45)' }}>{c.msg}</span>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: 'rgba(74,222,128,0.3)' }}>{c.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-green-900/20 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '10K+', label: 'Active Fans' },
            { num: '500+', label: 'Live Matches' },
            { num: '50K+', label: 'Posts Created' },
            { num: '1M+', label: 'Comments' },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="text-3xl font-black text-green-400">{num}</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(134,239,172,0.4)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Everything a cricket fan needs
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(134,239,172,0.4)' }}>
            We built the platform we always wanted as cricket fans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <Radio size={22} className="text-red-400" />,
              bg: 'bg-red-900/15 border-red-900/30',
              title: 'Live Scores',
              desc: 'Real-time ball-by-ball scores and match updates powered by CricAPI.',
            },
            {
              icon: <MessageCircle size={22} className="text-green-400" />,
              bg: 'bg-green-900/15 border-green-900/30',
              title: 'Match Discussions',
              desc: 'Live chat rooms for every match. Discuss every wicket and boundary as it happens.',
            },
            {
              icon: <Zap size={22} className="text-yellow-400" />,
              bg: 'bg-yellow-900/15 border-yellow-900/30',
              title: 'Social Feed',
              desc: 'Post reactions, memes, predictions. Like and comment on cricket content.',
            },
            {
              icon: <Users size={22} className="text-blue-400" />,
              bg: 'bg-blue-900/15 border-blue-900/30',
              title: 'Fan Community',
              desc: 'Follow other fans, build your cricket network, and grow your follower base.',
            },
            {
              icon: <Star size={22} className="text-purple-400" />,
              bg: 'bg-purple-900/15 border-purple-900/30',
              title: 'Player & Team Search',
              desc: 'Find and discuss your favourite players, teams, and trending hashtags.',
            },
            {
              icon: <Trophy size={22} className="text-orange-400" />,
              bg: 'bg-orange-900/15 border-orange-900/30',
              title: 'Notifications',
              desc: 'Real-time alerts for likes, comments, follows, and match events.',
            },
          ].map(({ icon, bg, title, desc }) => (
            <div key={title} className={`rounded-2xl p-6 border ${bg} hover:scale-[1.02] transition-transform`} style={{ background: 'rgba(2,11,5,0.6)' }}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(134,239,172,0.45)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/60 via-[#020b05] to-green-950/60" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-700/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
            Ready to join the<br /><span className="text-green-400">cricket revolution?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(134,239,172,0.5)' }}>
            Free forever. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all text-lg shadow-2xl shadow-green-900/50 hover:-translate-y-1"
          >
            <Trophy size={20} />
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-green-900/20 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
              <Trophy size={13} className="text-white" />
            </div>
            <span className="font-bold text-green-500 tracking-wider text-sm">CricConnect</span>
          </div>
          <div className="flex gap-6 text-xs" style={{ color: 'rgba(74,222,128,0.3)' }}>
            <Link to="/login" className="hover:text-green-400 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-green-400 transition-colors">Register</Link>
          </div>
          <p className="text-xs" style={{ color: 'rgba(74,222,128,0.2)' }}>
            © 2025 CricConnect. Built for cricket fans.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

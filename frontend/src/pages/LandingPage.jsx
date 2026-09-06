import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import LordsBackground from '../components/landing/LordsBackground';
import CricketPlayground from '../components/landing/CricketPlayground';

/* ──────────────────────────────────────
   HOOKS
────────────────────────────────────── */
const useCountUp = (target, duration = 1800, active = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
};

const useInView = (threshold = 0.25) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ──────────────────────────────────────
   SUB-COMPONENTS
────────────────────────────────────── */
const Stat = ({ num, suffix, label, active }) => {
  const val = useCountUp(num, 1800, active);
  const display = num >= 1000000 ? `${(val / 1000000).toFixed(val >= 1000000 ? 0 : 1)}M` : num >= 1000 ? `${Math.floor(val / 1000)}K` : val;
  return (
    <div style={{ textAlign: 'center', padding: '32px 20px' }}>
      <div style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 900, color: '#4ade80', fontFamily: "'Bebas Neue', cursive", lineHeight: 1, letterSpacing: '0.04em' }}>
        {display}{suffix}
      </div>
      <div style={{ fontSize: 13, marginTop: 6, color: 'rgba(134,239,172,0.45)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
};

const FeatureCard = ({ emoji, color, title, desc, index }) => {
  const [hov, setHov] = useState(false);
  const delay = index * 80;
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '32px 28px', borderRadius: 20,
        background: hov ? `${color}10` : 'rgba(4,14,7,0.7)',
        border: `0.5px solid ${hov ? color + '55' : 'rgba(74,222,128,0.1)'}`,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform: visible ? (hov ? 'translateY(-6px) scale(1.01)' : 'translateY(0)') : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        boxShadow: hov ? `0 20px 48px ${color}20, inset 0 0 0 0.5px ${color}30` : 'none',
        cursor: 'default', position: 'relative', overflow: 'hidden',
      }}
    >
      {hov && <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${color}18, transparent)`, pointerEvents: 'none' }} />}
      <div style={{ width: 52, height: 52, borderRadius: 16, background: `${color}15`, border: `0.5px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>{emoji}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0fdf4', marginBottom: 10, margin: '0 0 10px' }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(187,247,208,0.5)', margin: 0 }}>{desc}</p>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}60, transparent)`, opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
    </div>
  );
};

const TestimonialCard = ({ name, handle, text, avatar, color, index }) => {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        padding: '28px 24px', borderRadius: 20,
        background: 'rgba(4,14,7,0.8)',
        border: '0.5px solid rgba(74,222,128,0.1)',
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.5s ease ${index * 100}ms`,
      }}
    >
      <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
        {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#fbbf24', fontSize: 14 }}>★</span>)}
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(220,252,231,0.75)', marginBottom: 20, fontStyle: 'italic' }}>
        "{text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}20`, border: `1.5px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color, fontSize: 16, flexShrink: 0 }}>{avatar}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#bbf7d0' }}>{name}</div>
          <div style={{ fontSize: 12, color: 'rgba(74,222,128,0.35)' }}>{handle}</div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   TICKER (scrolling marquee)
────────────────────────────────────── */
const Ticker = () => {
  const items = ['🏏 IND vs AUS — Live Now', '🔴 CSK vs MI — 3:30 PM', '⚡ Kohli hits century', '🏆 WC 2025 Schedule Out', '🎯 Bumrah takes 5-fer', '📊 ICC Rankings Updated', '🔥 Rohit surpasses Sachin', '🏟️ Lord\'s Test Sold Out', '⭐ Player of the Match: Jadeja'];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', background: 'rgba(22,163,74,0.08)', borderTop: '0.5px solid rgba(74,222,128,0.12)', borderBottom: '0.5px solid rgba(74,222,128,0.12)', padding: '10px 0', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 0 }}>
        <div style={{ display: 'flex', gap: 0, animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {doubled.map((item, i) => (
            <span key={i} style={{ fontSize: 12, fontWeight: 600, color: 'rgba(134,239,172,0.7)', padding: '0 32px', letterSpacing: '0.03em' }}>
              {item}
              <span style={{ color: 'rgba(74,222,128,0.25)', marginLeft: 32 }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   STEP CARD
────────────────────────────────────── */
const StepCard = ({ step, emoji, color, title, desc, index }) => {
  const [ref, visible] = useInView(0.15);
  return (
    <div
      ref={ref}
      style={{
        position: 'relative', padding: '36px 30px', borderRadius: 22,
        background: 'rgba(4,14,7,0.7)',
        border: `0.5px solid ${color}25`,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 120}ms`,
        overflow: 'hidden',
      }}
    >
      {/* Big step number watermark */}
      <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 80, fontWeight: 900, color: `${color}08`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{step}</div>
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}80, ${color}20, transparent)` }} />
      <div style={{ width: 54, height: 54, borderRadius: 16, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 20 }}>{emoji}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Step {step}</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0fdf4', margin: '0 0 12px' }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(187,247,208,0.5)', margin: 0 }}>{desc}</p>
    </div>
  );
};

/* ──────────────────────────────────────
   APP PREVIEW MOCKUP
────────────────────────────────────── */
const AppPreview = () => {
  const [ref, visible] = useInView(0.1);
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Feed', 'Live', 'Chat'];
  const previews = [
    // Feed tab
    <div key="feed" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { user: 'Virat18', avatar: 'V', time: '2m', text: 'What a century by Gill! Standing ovation at Lord\'s 🏟️🔥', likes: 342, col: '#4ade80' },
        { user: 'RohitFan', avatar: 'R', time: '5m', text: 'India dominating the test match. Bumrah looking unplayable #INDvsENG', likes: 218, col: '#a78bfa' },
        { user: 'CricketLover', avatar: 'C', time: '9m', text: 'Best pitch in the world. Lord\'s always delivers 🏏', likes: 156, col: '#38bdf8' },
      ].map((p, i) => (
        <div key={i} style={{ background: 'rgba(5,20,10,0.8)', border: '0.5px solid rgba(74,222,128,0.1)', borderRadius: 12, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${p.col}25`, border: `1px solid ${p.col}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: p.col }}>{p.avatar}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#86efac' }}>{p.user}</span>
            <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.3)', marginLeft: 'auto' }}>{p.time}</span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(187,247,208,0.7)', margin: 0, lineHeight: 1.5 }}>{p.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7 }}>
            <span style={{ fontSize: 10, color: 'rgba(239,68,68,0.6)' }}>❤ {p.likes}</span>
            <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.4)' }}>💬 Reply</span>
          </div>
        </div>
      ))}
    </div>,
    // Live tab
    <div key="live" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { t1: '🇮🇳 India', s1: '345/6 (87.4)', t2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', s2: '280/10', live: true, status: 'India need 50 more • Day 4' },
        { t1: '🇦🇺 Australia', s1: '198/3 (45.0)', t2: '🇿🇦 South Africa', s2: 'Yet to bat', live: true, status: '3rd ODI • MCG' },
        { t1: '🇵🇰 Pakistan', s1: 'Upcoming', t2: '🇳🇿 New Zealand', s2: 'Upcoming', live: false, status: '1st T20 • Tomorrow 7:30 PM' },
      ].map((m, i) => (
        <div key={i} style={{ background: 'rgba(5,20,10,0.8)', border: `0.5px solid ${m.live ? 'rgba(239,68,68,0.25)' : 'rgba(74,222,128,0.1)'}`, borderRadius: 12, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            {m.live && <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /><span style={{ fontSize: 10, color: '#fca5a5', fontWeight: 700 }}>LIVE</span></>}
            <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.4)', marginLeft: 'auto' }}>{m.status}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#e2fce9' }}>{m.t1}</span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#4ade80', fontWeight: 700 }}>{m.s1}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#e2fce9' }}>{m.t2}</span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'rgba(74,222,128,0.4)' }}>{m.s2}</span>
          </div>
        </div>
      ))}
    </div>,
    // Chat tab
    <div key="chat" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.4)', textAlign: 'center', marginBottom: 4 }}>IND vs ENG — Match Discussion</div>
      {[
        { name: 'Priya', msg: 'CENTURY!! 🎉🏏', col: '#4ade80', mine: false },
        { name: 'Arjun', msg: 'Unstoppable!!', col: '#a78bfa', mine: false },
        { name: 'You', msg: 'Best innings I\'ve seen 🔥', col: '#38bdf8', mine: true },
        { name: 'Dev', msg: 'Lord\'s going crazy rn', col: '#fb923c', mine: false },
        { name: 'Sam', msg: 'Give him the Player of the Match already!', col: '#facc15', mine: false },
      ].map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 7, justifyContent: c.mine ? 'flex-end' : 'flex-start' }}>
          {!c.mine && <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${c.col}20`, border: `1px solid ${c.col}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: c.col, flexShrink: 0 }}>{c.name[0]}</div>}
          <div style={{ maxWidth: '70%', padding: '6px 10px', borderRadius: c.mine ? '12px 12px 4px 12px' : '12px 12px 12px 4px', background: c.mine ? 'rgba(22,163,74,0.25)' : 'rgba(5,20,10,0.8)', border: `0.5px solid ${c.mine ? 'rgba(74,222,128,0.3)' : 'rgba(74,222,128,0.1)'}`, fontSize: 11, color: 'rgba(220,252,231,0.8)' }}>
            {!c.mine && <div style={{ fontSize: 9, fontWeight: 700, color: c.col, marginBottom: 2 }}>{c.name}</div>}
            {c.msg}
          </div>
        </div>
      ))}
    </div>,
  ];
  return (
    <div
      ref={ref}
      style={{
        transform: visible ? 'perspective(1000px) rotateY(-8deg) rotateX(2deg) scale(1)' : 'perspective(1000px) rotateY(-12deg) rotateX(4deg) scale(0.92)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Phone frame */}
      <div style={{ width: 260, borderRadius: 32, background: '#040e07', border: '6px solid rgba(74,222,128,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(74,222,128,0.05), inset 0 1px 0 rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
        {/* Notch */}
        <div style={{ background: '#020b05', height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 60, height: 6, borderRadius: 10, background: 'rgba(74,222,128,0.15)' }} />
        </div>
        {/* Status bar */}
        <div style={{ padding: '6px 14px', display: 'flex', justifyContent: 'space-between', background: '#020b05' }}>
          <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.5)', fontWeight: 600 }}>CricConnect</span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.5)' }}>Live</span>
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display: 'flex', background: 'rgba(5,20,10,0.9)', borderBottom: '0.5px solid rgba(74,222,128,0.1)' }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: '8px', fontSize: 11, fontWeight: 600, color: activeTab === i ? '#4ade80' : 'rgba(74,222,128,0.3)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${activeTab === i ? '#4ade80' : 'transparent'}`, transition: 'all 0.2s' }}>{tab}</button>
          ))}
        </div>
        {/* Content */}
        <div style={{ height: 340, overflowY: 'auto', background: '#020b05' }}>
          {previews[activeTab]}
        </div>
        {/* Bottom nav */}
        <div style={{ display: 'flex', background: '#020b05', borderTop: '0.5px solid rgba(74,222,128,0.08)', padding: '8px 0 12px' }}>
          {['🏠','🔴','🔍','🔔','👤'].map((icon, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 16, opacity: i === 0 ? 1 : 0.35 }}>{icon}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   MAIN LANDING PAGE
────────────────────────────────────── */
const Landing = () => {
  const [statsRef, statsVisible] = useInView(0.3);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { emoji: '📡', color: '#ef4444', title: 'Live Scores', desc: 'Ball-by-ball updates. Every wicket, every boundary, every run — in real time via CricAPI.' },
    { emoji: '💬', color: '#4ade80', title: 'Match Discussions', desc: 'Real-time fan rooms for every match. The energy of a stadium, from your screen.' },
    { emoji: '⚡', color: '#facc15', title: 'Social Feed', desc: 'Posts, memes, hot takes, predictions. Pure cricket content 24/7.' },
    { emoji: '🏆', color: '#a78bfa', title: 'Fan Community', desc: 'Follow fans, build your cricket network, discover your tribe.' },
    { emoji: '🔍', color: '#38bdf8', title: 'Search Everything', desc: 'Players, teams, users, hashtags. Find anything cricket in milliseconds.' },
    { emoji: '🔔', color: '#fb923c', title: 'Smart Notifications', desc: 'Wickets, boundaries, match starts — never miss a moment that matters.' },
  ];

  const testimonials = [
    { name: 'Rohit M.', handle: '@rohit_cricket', text: 'Finally a platform built for real fans. The IPL live discussions are absolutely insane!', avatar: 'R', color: '#4ade80' },
    { name: 'Priya S.', handle: '@priya_stumps', text: 'The match discussion rooms feel like being in the stadium. Best cricket app, period.', avatar: 'P', color: '#a78bfa' },
    { name: 'Arjun K.', handle: '@arjun18k', text: "Changed how I watch cricket completely. My friends are all on it now. It's addictive!", avatar: 'A', color: '#38bdf8' },
  ];

  return (
    <div style={{ background: '#020b05', color: '#fff', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

      {/* ═══════════════════════════════════════════
          NAVBAR — glass, scrolled state
      ═══════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled ? 'rgba(2,11,5,0.95)' : 'rgba(2,11,5,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: `0.5px solid ${navScrolled ? 'rgba(74,222,128,0.15)' : 'rgba(74,222,128,0.06)'}`,
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#16a34a 0%,#166534 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 16px rgba(22,163,74,0.4)' }}>🏏</div>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.08em', color: '#4ade80', fontFamily: "'Bebas Neue', cursive" }}>CricConnect</span>
          </div>
          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link to="/login" style={{ padding: '9px 22px', fontSize: 14, fontWeight: 500, color: 'rgba(134,239,172,0.8)', border: '0.5px solid rgba(74,222,128,0.2)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.2s', background: 'transparent' }}>Sign In</Link>
            <Link to="/register" style={{ padding: '9px 24px', fontSize: 14, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#16a34a,#166534)', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 20px rgba(22,163,74,0.4)', letterSpacing: '0.02em' }}>
              Join Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO SECTION — Lord's Ground BG
      ═══════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 66, overflow: 'hidden' }}>
        <LordsBackground />
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(2,11,5,0.88) 0%, rgba(2,11,5,0.5) 50%, rgba(2,11,5,0.75) 100%)', zIndex: 1, pointerEvents: 'none' }} />
        {/* Bottom fade into page */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to bottom, transparent, #020b05)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 3, maxWidth: 1280, margin: '0 auto', padding: '60px 1.5rem', width: '100%', display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap', justifyContent: 'space-between' }}>

          {/* LEFT — Copy */}
          <div style={{ flex: '1 1 480px', minWidth: 300 }}>
            {/* Live badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 100, border: '0.5px solid rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.08)', marginBottom: 36, backdropFilter: 'blur(8px)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fca5a5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live — 3 Matches in Progress</span>
            </div>

            {/* Headline */}
            <h1 style={{ margin: '0 0 28px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              <span style={{ display: 'block', fontSize: 'clamp(48px,7.5vw,100px)', color: '#ffffff' }}>THE HOME</span>
              <span style={{ display: 'block', fontSize: 'clamp(48px,7.5vw,100px)', color: 'transparent', WebkitTextStroke: '2px rgba(74,222,128,0.65)' }}>OF CRICKET</span>
              <span style={{ display: 'block', fontSize: 'clamp(48px,7.5vw,100px)', background: 'linear-gradient(95deg,#4ade80 0%,#22c55e 40%,#86efac 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FANS</span>
            </h1>

            <p style={{ fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.75, color: 'rgba(187,247,208,0.6)', maxWidth: 500, margin: '0 0 40px' }}>
              Live scores, real-time match discussions, fan posts — everything cricket in one place. Built by fans, for fans.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 44 }}>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '15px 34px', borderRadius: 14, textDecoration: 'none',
                background: 'linear-gradient(135deg,#16a34a 0%,#166534 100%)',
                color: '#fff', fontWeight: 700, fontSize: 16,
                boxShadow: '0 8px 40px rgba(22,163,74,0.5), 0 2px 0 rgba(255,255,255,0.1) inset',
                letterSpacing: '0.01em',
              }}>
                <span>🏏</span> Start for Free
                <span style={{ fontSize: 18, fontWeight: 300 }}>→</span>
              </Link>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 28px', borderRadius: 14, textDecoration: 'none',
                color: 'rgba(134,239,172,0.85)', fontWeight: 600, fontSize: 16,
                border: '0.5px solid rgba(74,222,128,0.25)',
                background: 'rgba(74,222,128,0.05)', backdropFilter: 'blur(8px)',
              }}>
                Sign In
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {['R','V','S','P','A'].map((l, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${138+i*16},50%,${22+i*5}%)`, border: '2.5px solid #020b05', marginLeft: i > 0 ? -11 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#86efac', position: 'relative', zIndex: 5-i }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#bbf7d0' }}>10,000+ cricket fans</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  {'★★★★★'.split('').map((s,i) => <span key={i} style={{ color: '#fbbf24', fontSize: 13 }}>{s}</span>)}
                  <span style={{ fontSize: 12, color: 'rgba(134,239,172,0.4)', marginLeft: 4 }}>5.0 • Trusted by fans</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Live card + chat */}
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ width: 340, background: 'rgba(4,14,7,0.92)', backdropFilter: 'blur(24px)', border: '0.5px solid rgba(74,222,128,0.2)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(74,222,128,0.08)' }}>
              {/* Card top bar */}
              <div style={{ padding: '14px 18px 12px', borderBottom: '0.5px solid rgba(74,222,128,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,20,10,0.5)' }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#fca5a5', letterSpacing: '0.1em' }}>LIVE</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.4)', fontWeight: 500 }}>3rd ODI • Lord's</span>
                  <span style={{ padding: '2px 8px', background: 'rgba(74,222,128,0.1)', border: '0.5px solid rgba(74,222,128,0.2)', borderRadius: 20, fontSize: 10, color: '#4ade80', fontWeight: 600 }}>Day 4</span>
                </div>
              </div>
              {/* Scores */}
              <div style={{ padding: '16px 18px', borderBottom: '0.5px solid rgba(74,222,128,0.07)' }}>
                {[
                  { flag: '🇮🇳', name: 'India', score: '347/6', overs: '85.4 ov', active: true, rr: 'RR: 3.97' },
                  { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', score: '298/10', overs: '78.2 ov', active: false, rr: 'Innings closed' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', marginBottom: i === 0 ? 8 : 0, borderRadius: 12, background: t.active ? 'rgba(74,222,128,0.07)' : 'transparent', border: t.active ? '0.5px solid rgba(74,222,128,0.18)' : '0.5px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{t.flag}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2fce9' }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.35)' }}>{t.rr}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'monospace', color: t.active ? '#4ade80' : 'rgba(134,239,172,0.4)' }}>{t.score}</div>
                      <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.3)' }}>{t.overs}</div>
                    </div>
                  </div>
                ))}
                {/* Status pill */}
                <div style={{ marginTop: 10, padding: '7px 12px', background: 'rgba(250,204,21,0.08)', border: '0.5px solid rgba(250,204,21,0.2)', borderRadius: 10 }}>
                  <span style={{ fontSize: 12, color: '#fde68a', fontWeight: 600 }}>⚡ Kohli 94* — India need 49 more runs</span>
                </div>
              </div>
              {/* Chat preview */}
              <div style={{ padding: '14px 18px 16px' }}>
                <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.35)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>💬 Fan Discussion — 2.4K Online</div>
                {[
                  { n: 'Rohit', m: 'KOHLI IS BACK 🔥🔥🔥', t: '3s', c: '#4ade80' },
                  { n: 'Priya', m: 'Century incoming fr fr 💯', t: '9s', c: '#a78bfa' },
                  { n: 'Arjun', m: 'Lord\'s crowd on their feet!!', t: '14s', c: '#38bdf8' },
                  { n: 'Dev', m: 'Best test match in years 🏏', t: '21s', c: '#fb923c' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${c.c}18`, border: `1px solid ${c.c}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: c.c, flexShrink: 0 }}>{c.n[0]}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: c.c }}>{c.n} </span>
                      <span style={{ fontSize: 12, color: 'rgba(187,247,208,0.7)' }}>{c.m}</span>
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(74,222,128,0.2)', flexShrink: 0 }}>{c.t}</span>
                  </div>
                ))}
                {/* Join prompt */}
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, padding: '9px 12px', background: 'rgba(74,222,128,0.05)', border: '0.5px solid rgba(74,222,128,0.15)', borderRadius: 10, fontSize: 12, color: 'rgba(74,222,128,0.3)' }}>Join to react…</div>
                  <Link to="/register" style={{ padding: '9px 16px', background: 'rgba(22,163,74,0.3)', border: '0.5px solid rgba(74,222,128,0.3)', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#4ade80', textDecoration: 'none' }}>Join</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(74,222,128,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Explore</span>
          <div style={{ width: 24, height: 36, border: '1.5px solid rgba(74,222,128,0.2)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
            <div style={{ width: 4, height: 8, borderRadius: 2, background: '#4ade80', animation: 'scrollDot 1.8s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TICKER
      ═══════════════════════════════════════════ */}
      <Ticker />

      {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
      <div ref={statsRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderRadius: 20, overflow: 'hidden', border: '0.5px solid rgba(74,222,128,0.1)', marginTop: 60 }}>
          {[
            { num: 10000, suffix: '+', label: 'Active Fans' },
            { num: 500, suffix: '+', label: 'Live Matches' },
            { num: 50000, suffix: '+', label: 'Posts Created' },
            { num: 1000000, suffix: '+', label: 'Total Reactions' },
          ].map((s, i) => (
            <div key={s.label} style={{ background: 'rgba(4,14,7,0.7)', borderRight: i < 3 ? '0.5px solid rgba(74,222,128,0.08)' : 'none', backdropFilter: 'blur(8px)' }}>
              <Stat {...s} active={statsVisible} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '100px 1.5rem 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Simple As A Yorker</span>
          <h2 style={{ fontSize: 'clamp(30px,5vw,54px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>Up in 30 seconds flat</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          <StepCard step="01" emoji="✍️" color="#4ade80" title="Create your account" desc="Sign up free. No credit card. No nonsense. Just cricket." index={0} />
          <StepCard step="02" emoji="🏏" color="#a78bfa" title="Pick your teams & fans" desc="Follow your favourite teams, players, and fellow supporters." index={1} />
          <StepCard step="03" emoji="🔥" color="#fb923c" title="Dive into the action" desc="Live discussions, real scores, fan posts — all waiting for you." index={2} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          APP PREVIEW + FEATURES
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Phone mockup */}
          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
            <AppPreview />
          </div>
          {/* Features grid */}
          <div style={{ flex: '1 1 400px', minWidth: 300 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Everything You Need</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 32px' }}>Built for the obsessive fan</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
              {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CRICKET PLAYGROUND
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '0 0 100px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Mini Game</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 12px' }}>Cricket Playground</h2>
          <p style={{ fontSize: 16, color: 'rgba(134,239,172,0.45)', margin: 0 }}>Face a 6-ball over right here. Hold to charge your shot, release to swing.</p>
        </div>
        <CricketPlayground />
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Fan Reviews</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>The fans have spoken</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 20 }}>
          {testimonials.map((t, i) => <TestimonialCard key={t.name} {...t} index={i} />)}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA FINAL BANNER
      ═══════════════════════════════════════════ */}
      <section style={{ padding: '0 1.5rem 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', padding: 'clamp(56px,8vw,96px) clamp(28px,6vw,80px)', textAlign: 'center', background: 'rgba(4,14,7,0.9)', border: '0.5px solid rgba(74,222,128,0.18)' }}>
          {/* Top / bottom accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,transparent 0%,#16a34a 20%,#4ade80 50%,#16a34a 80%,transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,transparent 0%,#16a34a 20%,#4ade80 50%,#16a34a 80%,transparent 100%)' }} />
          {/* Corner glows */}
          <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, background: 'radial-gradient(circle,rgba(22,163,74,0.15),transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle,rgba(22,163,74,0.12),transparent)', pointerEvents: 'none' }} />
          {/* Centre glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(22,163,74,0.1),transparent)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(74,222,128,0.4))' }}>🏏</div>
            <h2 style={{ fontSize: 'clamp(34px,6vw,72px)', fontWeight: 900, margin: '0 0 18px', letterSpacing: '-0.04em', lineHeight: 1.02, color: '#fff' }}>
              Ready to join the<br />
              <span style={{ background: 'linear-gradient(95deg,#4ade80,#22c55e,#86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>cricket revolution?</span>
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(134,239,172,0.5)', margin: '0 0 40px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              Free forever. No credit card. 10,000 fans are already inside.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '17px 44px', borderRadius: 16, background: 'linear-gradient(135deg,#16a34a,#166534)', color: '#fff', fontWeight: 800, fontSize: 18, textDecoration: 'none', boxShadow: '0 12px 48px rgba(22,163,74,0.5)', letterSpacing: '0.01em' }}>
                Create Free Account
                <span style={{ fontSize: 20 }}>→</span>
              </Link>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '17px 36px', borderRadius: 16, color: '#86efac', fontWeight: 600, fontSize: 17, textDecoration: 'none', border: '0.5px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.06)' }}>
                Sign In
              </Link>
            </div>
            {/* Proof row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 32, flexWrap: 'wrap' }}>
              {['✅ Free forever', '🔒 Secure & private', '📱 Works on all devices', '⚡ Live scores included'].map(item => (
                <span key={item} style={{ fontSize: 13, color: 'rgba(134,239,172,0.45)', fontWeight: 500 }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{ borderTop: '0.5px solid rgba(74,222,128,0.08)', padding: '48px 1.5rem 36px', background: 'rgba(2,8,4,0.6)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 40 }}>
            {/* Brand */}
            <div style={{ flex: '0 0 auto', maxWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#16a34a,#166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏏</div>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#4ade80', fontFamily: "'Bebas Neue', cursive", letterSpacing: '0.1em' }}>CricConnect</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(134,239,172,0.35)', lineHeight: 1.7, margin: 0 }}>The ultimate social platform for cricket fans. Live scores, real-time discussions, and a community of obsessives.</p>
            </div>
            {/* Links */}
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(74,222,128,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
                {[['Home Feed','/home'],['Live Matches','/matches'],['Search','/search']].map(([l,h]) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <Link to={h} style={{ fontSize: 14, color: 'rgba(134,239,172,0.5)', textDecoration: 'none' }}>{l}</Link>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(74,222,128,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Account</div>
                {[['Sign In','/login'],['Register','/register']].map(([l,h]) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <Link to={h} style={{ fontSize: 14, color: 'rgba(134,239,172,0.5)', textDecoration: 'none' }}>{l}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '0.5px solid rgba(74,222,128,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(74,222,128,0.2)', margin: 0 }}>© 2025 CricConnect. Built for cricket obsessives.</p>
            <p style={{ fontSize: 12, color: 'rgba(74,222,128,0.15)', margin: 0 }}>Made with 🏏 and ❤️</p>
          </div>
        </div>
      </footer>

      {/* Global keyframes */}
      <style>{`
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(1.5); }
        }
        @keyframes ticker {
          0% { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes scrollDot {
          0%   { transform:translateY(0);   opacity:1; }
          80%  { transform:translateY(14px); opacity:0; }
          100% { transform:translateY(0);   opacity:0; }
        }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#020b05; }
        ::-webkit-scrollbar-thumb { background:#166534; border-radius:4px; }
      `}</style>
    </div>
  );
};

export default Landing;
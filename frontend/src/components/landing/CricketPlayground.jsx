import { useEffect, useRef, useState, useCallback } from 'react';

const CricketPlayground = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    score: 0, balls: 6, streak: 0, best: 0,
    phase: 'idle',
    power: 0, powerDir: 1, charging: false,
    ball: null,
    fielders: [],
    particles: [],
    bowlT: 0,
    animId: null,
  });
  const [ui, setUi] = useState({ score: 0, balls: 6, streak: 0, best: 0, power: 0, msg: 'Click the canvas or press SPACE to start!' });

  const FIELDER_POS = [
    {x:160, y:90}, {x:520, y:90}, {x:100, y:180}, {x:580, y:180},
    {x:280, y:60}, {x:400, y:60}, {x:340, y:45}, {x:220, y:150}, {x:460, y:150}
  ];
  const W = 680, H = 360, CX = W/2, CY = H/2;

  const initFielders = () => FIELDER_POS.map(p => ({ ...p, caught: false }));

  const setMsg = useCallback((text) => {
    setUi(u => ({ ...u, msg: text }));
  }, []);

  const syncUi = useCallback(() => {
    const s = stateRef.current;
    setUi(u => ({ ...u, score: s.score, balls: s.balls, streak: s.streak, best: s.best, power: s.power }));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;
    ctx.clearRect(0, 0, W, H);

    // Field
    ctx.fillStyle = '#020b05';
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath(); ctx.ellipse(CX, CY+60, 290, 185, 0, 0, Math.PI*2);
    ctx.fillStyle = '#061a0c'; ctx.fill();
    ctx.strokeStyle = 'rgba(34,197,94,0.12)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(CX, CY+60, 180, 120, 0, 0, Math.PI*2);
    ctx.fillStyle = '#071f10'; ctx.fill();
    ctx.strokeStyle = 'rgba(34,197,94,0.18)'; ctx.lineWidth = 0.5; ctx.stroke();

    // Pitch strip
    ctx.fillStyle = '#0f2d1a';
    ctx.beginPath(); ctx.roundRect(CX-18, 90, 36, 220, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5; ctx.stroke();

    // Creases
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(CX-28, 285); ctx.lineTo(CX+28, 285); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX-22, 115); ctx.lineTo(CX+22, 115); ctx.stroke();

    // Stumps
    ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 2;
    [-6, 0, 6].forEach(i => {
      ctx.beginPath(); ctx.moveTo(CX+i, 292); ctx.lineTo(CX+i, 270); ctx.stroke();
    });
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(CX-7, 270); ctx.lineTo(CX+7, 270); ctx.stroke();

    // Fielders
    s.fielders.forEach(f => {
      ctx.globalAlpha = f.caught ? 0.35 : 1;
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath(); ctx.ellipse(f.x, f.y+12, 7, 3, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = f.caught ? '#374151' : '#1e40af';
      ctx.beginPath(); ctx.roundRect(f.x-5, f.y-12, 10, 18, 2); ctx.fill();
      ctx.fillStyle = f.caught ? '#4b5563' : '#2563eb';
      ctx.beginPath(); ctx.arc(f.x, f.y-16, 6, 0, Math.PI*2); ctx.fill();
      if (s.ball && !f.caught && Math.hypot(s.ball.x - f.x, s.ball.y - f.y) < 55) {
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
        const ang = Math.atan2(s.ball.y - f.y, s.ball.x - f.x);
        ctx.beginPath(); ctx.moveTo(f.x, f.y-8);
        ctx.lineTo(f.x + Math.cos(ang)*14, f.y-8 + Math.sin(ang)*9); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });

    // Bowler
    const runX = s.phase === 'bowling' ? Math.sin(s.bowlT * 8) * 3 : 0;
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath(); ctx.roundRect(CX-6+runX, 88, 12, 20, 2); ctx.fill();
    ctx.fillStyle = '#6d28d9';
    ctx.beginPath(); ctx.arc(CX+runX, 84, 7, 0, Math.PI*2); ctx.fill();

    // Batsman
    const swinging = s.phase === 'swinging';
    ctx.fillStyle = '#1a3a2a';
    ctx.beginPath(); ctx.roundRect(CX-8, 250, 16, 26, 3); ctx.fill();
    ctx.fillStyle = '#166534';
    ctx.beginPath(); ctx.arc(CX, 244, 9, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#052e16';
    ctx.beginPath(); ctx.ellipse(CX, 244, 9, 5, 0.3, 0, Math.PI); ctx.fill();
    ctx.save(); ctx.translate(CX+8, 258); ctx.rotate(swinging ? -0.9 : -0.3);
    ctx.fillStyle = '#78350f';
    ctx.beginPath(); ctx.roundRect(-2, -28, 5, 30, 2); ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.beginPath(); ctx.roundRect(-3, -28, 7, 20, 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#dcfce7';
    ctx.beginPath(); ctx.roundRect(CX-10, 274, 8, 14, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(CX+2, 274, 8, 14, 2); ctx.fill();

    // Ball
    if (s.ball) {
      const { x, y, r = 8 } = s.ball;
      const sc = Math.min(1, y/300);
      ctx.fillStyle = `rgba(0,0,0,${0.28*sc})`;
      ctx.beginPath(); ctx.ellipse(x, 300, 8*sc, 4*sc, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r-1, -0.5, 0.5); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r-1, Math.PI-0.5, Math.PI+0.5); ctx.stroke();
    }

    // Particles
    s.particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Power bar overlay on canvas
    if (s.phase === 'charging') {
      const bw = 160, bh = 9, bx = CX - bw/2, by = H - 28;
      ctx.fillStyle = 'rgba(5,46,22,0.75)';
      ctx.beginPath(); ctx.roundRect(bx-2, by-2, bw+4, bh+4, 5); ctx.fill();
      const col = s.power < 40 ? '#4ade80' : s.power < 70 ? '#facc15' : '#f87171';
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.roundRect(bx, by, bw*(s.power/100), bh, 4); ctx.fill();
      ctx.fillStyle = 'rgba(134,239,172,0.5)';
      ctx.font = '11px DM Sans, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(`Power: ${Math.round(s.power)}%`, CX, by - 5);
    }
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;

    // Update particles
    s.particles = s.particles.filter(p => p.life > 0.01);
    s.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= 0.024;
    });

    if (s.phase === 'bowling' && s.ball) {
      s.bowlT += 0.05;
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;
      s.ball.r = Math.max(4, 8 - (s.ball.y - 115) / 50);
      if (s.ball.y >= 255) {
        s.phase = 'charging'; s.ball.y = 255; s.ball.vx = 0; s.ball.vy = 0;
        setMsg('Hold SPACE / hold click → release to swing!');
      }
    }

    if (s.phase === 'charging' && s.charging) {
      s.power += s.powerDir * 2.2;
      if (s.power >= 100) { s.power = 100; s.powerDir = -1; }
      if (s.power <= 0)   { s.power = 0;   s.powerDir = 1; }
      setUi(u => ({ ...u, power: Math.round(s.power) }));
    }

    if (s.phase === 'flying' && s.ball) {
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;
      s.ball.vy += 0.08;
      s.ball.r = Math.max(5, 8 + (250 - s.ball.y) / 60);

      if (s.ball.y < 210) {
        for (let f of s.fielders) {
          if (!f.caught && Math.hypot(s.ball.x - f.x, s.ball.y - f.y) < 22) {
            f.caught = true; s.phase = 'result';
            endBall(0, true); return;
          }
        }
      }
      if (s.ball.x < -30 || s.ball.x > W+30 || s.ball.y < -60 || s.ball.y > H+40) {
        s.phase = 'result';
        endBall(calcRuns(s.ball.x, s.ball.y), false); return;
      }
      if (s.ball.y > 325) {
        s.phase = 'result'; endBall(1, false); return;
      }
    }

    draw();
    s.animId = requestAnimationFrame(loop);
  }, [draw]);

  const calcRuns = (bx, by) => {
    const dist = Math.hypot(bx - CX, by - CY - 60);
    if (dist > 260) return 6;
    if (dist > 185) return 4;
    if (dist > 120) return 2;
    if (dist > 60)  return 1;
    return 0;
  };

  const spawnParticles = (x, y, runs) => {
    const s = stateRef.current;
    const color = runs >= 6 ? '#fbbf24' : runs >= 4 ? '#4ade80' : '#86efac';
    for (let i = 0; i < 20; i++) {
      s.particles.push({
        x: x + (Math.random()-0.5)*40, y: y + (Math.random()-0.5)*30,
        vx: (Math.random()-0.5)*4, vy: -Math.random()*5 - 2,
        r: Math.random()*4+2, life: 1, color
      });
    }
  };

  const endBall = useCallback((runs, caught) => {
    const s = stateRef.current;
    s.balls--;
    if (caught) {
      s.streak = 0;
      setMsg('🧤 Caught! OUT! Better luck next ball.');
    } else if (runs === 0) {
      s.streak = 0;
      setMsg('Dot ball — no runs scored.');
    } else {
      s.score += runs; s.streak++;
      if (s.score > s.best) s.best = s.score;
      const msgs = {
        6: ['SIX! Maximum! 🏏', 'SIX! Over the boundary!', 'What a shot — SIX!'],
        4: ['FOUR! Racing to the rope!', 'Boundary! 4 runs!', 'Beautiful drive — FOUR!'],
        2: ['2 runs — good running!', 'Turned for 2!'],
        1: ['Quick single — 1 run!', 'Turned for 1.'],
      };
      const pool = msgs[runs] || msgs[1];
      setMsg(pool[Math.floor(Math.random() * pool.length)]);
      if (s.ball) spawnParticles(s.ball.x, s.ball.y, runs);
    }
    s.ball = null;
    syncUi();

    if (s.balls <= 0) {
      setTimeout(() => {
        setMsg(`Over! Final: ${s.score} runs from 6 balls. Hit "New Over" to retry!`);
        s.phase = 'done';
        syncUi();
      }, 1500);
      return;
    }
    setTimeout(() => {
      s.phase = 'idle';
      setMsg('Click canvas or press SPACE for next ball!');
    }, 1700);
  }, [syncUi]);

  const bowlBall = useCallback(() => {
    const s = stateRef.current;
    s.phase = 'bowling'; s.bowlT = 0;
    s.ball = { x: CX + (Math.random()-0.5)*6, y: 115, vx: (Math.random()-0.5)*0.4, vy: 4.5, r: 8 };
    setMsg('Ball incoming — get ready to swing!');
  }, []);

  const startCharge = useCallback((e) => {
    e.preventDefault();
    const s = stateRef.current;
    if (s.phase === 'idle') { bowlBall(); return; }
    if (s.phase === 'done') return;
    if (s.phase === 'charging' && !s.charging) {
      s.charging = true; s.powerDir = 1;
    }
  }, [bowlBall]);

  const endCharge = useCallback((e) => {
    if (e) e.preventDefault();
    const s = stateRef.current;
    if (s.phase !== 'charging' || !s.charging) return;
    const p = s.power;
    s.power = 0; s.charging = false; s.phase = 'swinging';
    if (!s.ball) return;
    const spread = ((Math.random()-0.5) * (1 - p/120)) * 1.1;
    const speed = 4 + p * 0.12;
    const angle = -Math.PI/2 + spread + (Math.random()-0.5)*0.25;
    s.ball.vx = Math.cos(angle) * speed;
    s.ball.vy = Math.sin(angle) * speed - 1;
    s.phase = 'flying';
    setMsg('');
    setUi(u => ({ ...u, power: 0 }));
  }, []);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.score = 0; s.balls = 6; s.streak = 0;
    s.ball = null; s.particles = []; s.phase = 'idle';
    s.charging = false; s.power = 0; s.powerDir = 1;
    s.fielders = initFielders();
    syncUi();
    setMsg('Click the canvas or press SPACE to start!');
  }, [syncUi]);

  useEffect(() => {
    const s = stateRef.current;
    s.fielders = initFielders();
    s.animId = requestAnimationFrame(loop);

    const onKey = (e) => {
      if (e.code === 'Space') {
        if (e.type === 'keydown') startCharge(e);
        else endCharge(e);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => {
      cancelAnimationFrame(s.animId);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, [loop, startCharge, endCharge]);

  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-800/40 bg-green-900/15 text-green-500 text-xs font-medium mb-4">
            🏏 Mini Game
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Cricket Playground
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: 'rgba(134,239,172,0.45)' }}>
            While you're here — face a 6-ball over. Hold to charge, release to swing.
          </p>
        </div>

        {/* Game card */}
        <div className="rounded-2xl border border-green-900/30 overflow-hidden" style={{ background: 'rgba(2,11,5,0.8)' }}>
          {/* Stats bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-green-900/25">
            <div className="flex gap-4">
              {[
                { label: 'Runs', val: ui.score },
                { label: 'Balls', val: ui.balls },
                { label: 'Streak', val: ui.streak },
                { label: 'Best', val: ui.best },
              ].map(({ label, val }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-bold text-green-400 leading-none">{val}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'rgba(134,239,172,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div
                className="text-sm font-medium min-w-[220px] text-right"
                style={{ color: 'rgba(134,239,172,0.7)' }}
              >
                {ui.msg}
              </div>
              <button
                onClick={resetGame}
                className="text-xs px-3 py-1.5 rounded-lg border border-green-800/50 text-green-600 hover:text-green-400 hover:bg-green-900/20 transition-all"
              >
                New Over
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={680}
              height={360}
              className="w-full block cursor-crosshair select-none"
              onMouseDown={startCharge}
              onMouseUp={endCharge}
              onTouchStart={startCharge}
              onTouchEnd={endCharge}
            />
            {/* Power indicator */}
            {ui.power > 0 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(5,46,22,0.7)' }}>
                <div className="w-28 h-2 rounded-full overflow-hidden bg-green-950">
                  <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                      width: `${ui.power}%`,
                      background: ui.power < 40 ? '#4ade80' : ui.power < 70 ? '#facc15' : '#f87171'
                    }}
                  />
                </div>
                <span className="text-xs font-mono" style={{ color: 'rgba(134,239,172,0.7)' }}>{ui.power}%</span>
              </div>
            )}
          </div>

          {/* Controls hint */}
          <div className="px-5 py-3 border-t border-green-900/20 flex items-center justify-center gap-6 text-xs" style={{ color: 'rgba(74,222,128,0.3)' }}>
            <span>🖱️ Click to bowl → hold to charge → release to swing</span>
            <span>⌨️ SPACE works too</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CricketPlayground;
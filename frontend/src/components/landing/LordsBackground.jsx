import { useEffect, useRef } from 'react';

const LordsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Crowd dots
    const crowd = [];
    for (let i = 0; i < 420; i++) {
      crowd.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2.5 + 1,
        hue: Math.random() > 0.5 ? 'rgba(134,239,172,' : Math.random() > 0.5 ? 'rgba(255,255,255,' : 'rgba(250,204,21,',
        wave: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        section: Math.floor(Math.random() * 4),
      });
    }

    // Birds
    const birds = Array.from({ length: 6 }, () => ({
      x: Math.random() * window.innerWidth,
      y: 40 + Math.random() * 120,
      vx: 0.3 + Math.random() * 0.5,
      vy: (Math.random() - 0.5) * 0.15,
      wing: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      // ── Sky gradient (deep dusk)
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
      sky.addColorStop(0, '#010804');
      sky.addColorStop(0.4, '#020f08');
      sky.addColorStop(1, '#041a0c');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H * 0.55);

      // ── Stars
      ctx.save();
      for (let i = 0; i < 120; i++) {
        const sx = ((i * 137.5) % W);
        const sy = ((i * 89.3) % (H * 0.38));
        const twinkle = 0.4 + 0.4 * Math.sin(t * 1.5 + i);
        ctx.globalAlpha = twinkle * 0.7;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(sx, sy, i % 3 === 0 ? 1.2 : 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ── Floodlight glow (Lord's 6 towers)
      const floodX = [W * 0.08, W * 0.22, W * 0.38, W * 0.62, W * 0.78, W * 0.92];
      const floodY = H * 0.28;
      floodX.forEach((fx) => {
        const glow = ctx.createRadialGradient(fx, floodY, 0, fx, floodY, 180);
        glow.addColorStop(0, 'rgba(220,252,231,0.18)');
        glow.addColorStop(0.4, 'rgba(134,239,172,0.06)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(fx - 180, 0, 360, H * 0.55);
      });

      // ── Ground (full ellipse pitch view from low angle)
      // Outer field
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.72, W * 0.52, H * 0.32, 0, 0, Math.PI * 2);
      const fieldGrad = ctx.createRadialGradient(W / 2, H * 0.72, 0, W / 2, H * 0.72, W * 0.52);
      fieldGrad.addColorStop(0, '#0d3318');
      fieldGrad.addColorStop(0.45, '#0a2912');
      fieldGrad.addColorStop(0.75, '#071e0d');
      fieldGrad.addColorStop(1, '#041408');
      ctx.fillStyle = fieldGrad;
      ctx.fill();
      ctx.restore();

      // Mowing stripes
      const stripeCount = 14;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.72, W * 0.52, H * 0.32, 0, 0, Math.PI * 2);
      ctx.clip();
      for (let i = 0; i < stripeCount; i++) {
        const sx = (W / 2 - W * 0.52) + (i / stripeCount) * W * 1.04;
        const sw = W * 1.04 / stripeCount;
        if (i % 2 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.018)';
          ctx.fillRect(sx, 0, sw, H);
        }
      }
      ctx.restore();

      // ── Pitch strip (centre, Lord's famous slope implied)
      ctx.save();
      ctx.beginPath();
      const pw = W * 0.045, ph = H * 0.26;
      const px = W / 2 - pw / 2, py = H * 0.52;
      ctx.roundRect(px, py, pw, ph, 6);
      const pitchGrad = ctx.createLinearGradient(px, py, px, py + ph);
      pitchGrad.addColorStop(0, '#1a4a28');
      pitchGrad.addColorStop(0.5, '#17422399');
      pitchGrad.addColorStop(1, '#0f2d18');
      ctx.fillStyle = pitchGrad;
      ctx.fill();
      // Pitch border
      ctx.strokeStyle = 'rgba(134,239,172,0.12)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();

      // Crease lines
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.5;
      // Batting crease
      ctx.beginPath();
      ctx.moveTo(W / 2 - pw * 0.8, py + ph * 0.86);
      ctx.lineTo(W / 2 + pw * 0.8, py + ph * 0.86);
      ctx.stroke();
      // Popping crease
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 - pw * 0.7, py + ph * 0.14);
      ctx.lineTo(W / 2 + pw * 0.7, py + ph * 0.14);
      ctx.stroke();
      ctx.restore();

      // Stumps (batting end)
      ctx.save();
      ctx.strokeStyle = '#fef9c3';
      ctx.lineWidth = 2.5;
      const stumpY1 = py + ph * 0.86, stumpY2 = stumpY1 - H * 0.045;
      [-1, 0, 1].forEach((i) => {
        const sx = W / 2 + i * pw * 0.25;
        ctx.beginPath();
        ctx.moveTo(sx, stumpY1);
        ctx.lineTo(sx, stumpY2);
        ctx.stroke();
      });
      // Bails
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - pw * 0.32, stumpY2);
      ctx.lineTo(W / 2 + pw * 0.32, stumpY2);
      ctx.stroke();
      ctx.restore();

      // ── Boundary rope
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.72, W * 0.505, H * 0.308, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── Lord's Pavilion (iconic silhouette, centre-background)
      const pvX = W / 2, pvY = H * 0.38;
      const pvW = W * 0.26, pvH = H * 0.19;
      ctx.save();

      // Main pavilion body
      ctx.fillStyle = '#0c1f14';
      ctx.beginPath();
      ctx.rect(pvX - pvW / 2, pvY, pvW, pvH);
      ctx.fill();

      // Upper tier with balconies
      ctx.fillStyle = '#0e2517';
      ctx.beginPath();
      ctx.rect(pvX - pvW * 0.44, pvY - pvH * 0.35, pvW * 0.88, pvH * 0.42);
      ctx.fill();

      // Balcony railing line
      ctx.strokeStyle = 'rgba(134,239,172,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pvX - pvW * 0.44, pvY - pvH * 0.0);
      ctx.lineTo(pvX + pvW * 0.44, pvY - pvH * 0.0);
      ctx.stroke();

      // Roof ridge
      ctx.fillStyle = '#061008';
      ctx.beginPath();
      ctx.moveTo(pvX - pvW * 0.5, pvY - pvH * 0.35);
      ctx.lineTo(pvX, pvY - pvH * 0.7);
      ctx.lineTo(pvX + pvW * 0.5, pvY - pvH * 0.35);
      ctx.closePath();
      ctx.fill();

      // Turret domes (Lord's distinctive)
      [-0.38, 0.38].forEach((offset) => {
        ctx.fillStyle = '#061008';
        ctx.beginPath();
        ctx.arc(pvX + pvW * offset, pvY - pvH * 0.35, pvW * 0.07, Math.PI, 0);
        ctx.fill();
        // Turret body
        ctx.beginPath();
        ctx.rect(pvX + pvW * offset - pvW * 0.055, pvY - pvH * 0.35, pvW * 0.11, pvH * 0.2);
        ctx.fill();
      });

      // Windows (lit yellow — players inside)
      const winRows = 2;
      for (let row = 0; row < winRows; row++) {
        for (let col = 0; col < 7; col++) {
          const wx = pvX - pvW * 0.38 + col * (pvW * 0.76 / 6);
          const wy = pvY - pvH * 0.28 + row * pvH * 0.18;
          const flicker = 0.5 + 0.3 * Math.sin(t * 3 + col + row * 3);
          ctx.fillStyle = `rgba(254,243,199,${flicker * 0.7})`;
          ctx.beginPath();
          ctx.roundRect(wx - 4, wy - 5, 8, 10, 1);
          ctx.fill();
        }
      }
      ctx.restore();

      // ── Grand stands (left & right, tiered)
      const stands = [
        { cx: W * 0.18, tier: 3, col: 'rgba(8,28,16,0.95)', w: W * 0.22, h: H * 0.15, y: H * 0.44 },
        { cx: W * 0.82, tier: 3, col: 'rgba(8,28,16,0.95)', w: W * 0.22, h: H * 0.15, y: H * 0.44 },
      ];

      stands.forEach(({ cx, tier, col, w, h, y }) => {
        for (let i = tier - 1; i >= 0; i--) {
          const tw = w * (1 - i * 0.08);
          const th = h / tier;
          const tx = cx - tw / 2;
          const ty = y + i * th * 0.7;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.roundRect(tx, ty, tw, h - i * th * 0.2, 3);
          ctx.fill();
          // Tier edge
          ctx.strokeStyle = 'rgba(134,239,172,0.08)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        // Roof overhang
        ctx.fillStyle = '#040e08';
        ctx.beginPath();
        ctx.rect(cx - w * 0.55, y - h * 0.08, w * 1.1, h * 0.1);
        ctx.fill();
      });

      // ── Media Centre (futuristic pod, Lord's signature)
      const mcX = W * 0.73, mcY = H * 0.35;
      ctx.save();
      ctx.fillStyle = '#0a1f12';
      ctx.beginPath();
      ctx.ellipse(mcX, mcY, W * 0.075, H * 0.055, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(134,239,172,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Media centre windows (curved row)
      for (let i = 0; i < 9; i++) {
        const angle = -Math.PI * 0.55 + i * (Math.PI * 1.1 / 8);
        const wx = mcX + Math.cos(angle) * W * 0.055;
        const wy = mcY + Math.sin(angle) * H * 0.035;
        const lit = 0.3 + 0.4 * Math.sin(t * 2 + i * 0.7);
        ctx.fillStyle = `rgba(134,239,172,${lit * 0.6})`;
        ctx.beginPath();
        ctx.arc(wx, wy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Stalk / support
      ctx.strokeStyle = 'rgba(134,239,172,0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mcX, mcY + H * 0.06);
      ctx.lineTo(mcX, H * 0.5);
      ctx.stroke();
      ctx.restore();

      // ── Floodlight pylons (6)
      floodX.forEach((fx, fi) => {
        const fBase = H * 0.5 + (fi % 2 === 0 ? H * 0.02 : 0);
        const fTop = H * 0.1;
        // Tower
        ctx.strokeStyle = 'rgba(134,239,172,0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fx, fBase);
        ctx.lineTo(fx, fTop);
        ctx.stroke();
        // Cross supports
        ctx.lineWidth = 1;
        [0.3, 0.55, 0.75].forEach((frac) => {
          const fy = fTop + (fBase - fTop) * frac;
          ctx.beginPath();
          ctx.moveTo(fx - 14, fy);
          ctx.lineTo(fx + 14, fy);
          ctx.stroke();
        });
        // Light cluster at top
        const lightPulse = 0.85 + 0.15 * Math.sin(t * 0.5 + fi);
        const lg = ctx.createRadialGradient(fx, fTop - 6, 0, fx, fTop - 6, 28);
        lg.addColorStop(0, `rgba(255,253,235,${lightPulse * 0.95})`);
        lg.addColorStop(0.3, `rgba(220,252,231,${lightPulse * 0.5})`);
        lg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = lg;
        ctx.fillRect(fx - 28, fTop - 34, 56, 56);
        // Head bar
        ctx.fillStyle = `rgba(255,253,235,${lightPulse})`;
        ctx.fillRect(fx - 11, fTop - 8, 22, 4);
      });

      // ── Animated crowd (stands area, dots waving)
      ctx.save();
      const standAreas = [
        { x: W * 0.07, y: H * 0.44, w: W * 0.22, h: H * 0.13 },
        { x: W * 0.71, y: H * 0.44, w: W * 0.22, h: H * 0.13 },
        { x: W * 0.3, y: H * 0.38, w: W * 0.4, h: H * 0.06 },
      ];
      crowd.forEach((c) => {
        const area = standAreas[c.section % standAreas.length];
        if (!area) return;
        const cx = area.x + c.x * area.w;
        const cy = area.y + c.y * area.h;
        const wave = Math.sin(t * c.speed * 80 + c.wave) * 2;
        const alpha = 0.25 + 0.2 * Math.abs(Math.sin(t + c.wave));
        ctx.fillStyle = c.hue + alpha + ')';
        ctx.beginPath();
        ctx.arc(cx, cy + wave, c.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // ── Scoreboard (Lord's famous old scoreboard, left side)
      const sbX = W * 0.06, sbY = H * 0.34, sbW = W * 0.1, sbH = H * 0.12;
      ctx.save();
      ctx.fillStyle = '#060f08';
      ctx.strokeStyle = 'rgba(134,239,172,0.18)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.roundRect(sbX, sbY, sbW, sbH, 4);
      ctx.fill(); ctx.stroke();
      // Score display rows
      const sbData = [
        { label: 'RUNS', val: Math.floor(287 + Math.sin(t * 0.1) * 3) },
        { label: 'WKTS', val: 4 },
        { label: 'OVERS', val: '48.2' },
      ];
      ctx.font = `bold ${Math.floor(sbH * 0.16)}px monospace`;
      ctx.textAlign = 'center';
      sbData.forEach((row, i) => {
        const ry = sbY + sbH * 0.2 + i * sbH * 0.28;
        ctx.fillStyle = 'rgba(74,222,128,0.35)';
        ctx.font = `${Math.floor(sbH * 0.13)}px monospace`;
        ctx.fillText(row.label, sbX + sbW / 2, ry);
        ctx.fillStyle = 'rgba(254,249,195,0.8)';
        ctx.font = `bold ${Math.floor(sbH * 0.18)}px monospace`;
        ctx.fillText(String(row.val), sbX + sbW / 2, ry + sbH * 0.15);
      });
      ctx.restore();

      // ── Birds flying over ground
      birds.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy + Math.sin(t * 2 + b.wing) * 0.3;
        b.wing += 0.08;
        if (b.x > W + 30) b.x = -30;
        const wingFlap = Math.sin(b.wing) * 5;
        ctx.save();
        ctx.strokeStyle = 'rgba(134,239,172,0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(b.x - 8, b.y + wingFlap);
        ctx.quadraticCurveTo(b.x, b.y - 3, b.x + 8, b.y + wingFlap);
        ctx.stroke();
        ctx.restore();
      });

      // ── Atmospheric overlay (bottom vignette to blend into page)
      const vignette = ctx.createLinearGradient(0, H * 0.55, 0, H);
      vignette.addColorStop(0, 'rgba(1,8,4,0)');
      vignette.addColorStop(0.4, 'rgba(1,8,4,0.6)');
      vignette.addColorStop(1, 'rgba(1,8,4,0.97)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, H * 0.55, W, H * 0.45);

      // Side vignettes
      const lv = ctx.createLinearGradient(0, 0, W * 0.15, 0);
      lv.addColorStop(0, 'rgba(1,8,4,0.7)');
      lv.addColorStop(1, 'rgba(1,8,4,0)');
      ctx.fillStyle = lv;
      ctx.fillRect(0, 0, W * 0.15, H);
      const rv = ctx.createLinearGradient(W, 0, W * 0.85, 0);
      rv.addColorStop(0, 'rgba(1,8,4,0.7)');
      rv.addColorStop(1, 'rgba(1,8,4,0)');
      ctx.fillStyle = rv;
      ctx.fillRect(W * 0.85, 0, W * 0.15, H);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none', zIndex: 0 }}
    />
  );
};

export default LordsBackground;
// SALTROAD — drawing only: world, caravan, HUD and every screen.
import { CFG, PAL } from './config.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function panel(ctx, x, y, w, h) {
  ctx.fillStyle = PAL.panel;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = PAL.panelEdge;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function text(ctx, s, x, y, size, color, align = 'left', weight = '700') {
  ctx.font = `${weight} ${size}px Trebuchet MS, Verdana, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

export function drawCamel(ctx, x, y, scale, bob, blanket, facing = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);
  const legSwing = Math.sin(bob) * 5;
  const legSwing2 = Math.sin(bob + Math.PI) * 5;
  // legs
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-12, 2); ctx.lineTo(-14 + legSwing, 16);
  ctx.moveTo(-4, 4); ctx.lineTo(-5 + legSwing2, 16);
  ctx.moveTo(6, 4); ctx.lineTo(7 + legSwing, 16);
  ctx.moveTo(13, 2); ctx.lineTo(15 + legSwing2, 16);
  ctx.stroke();
  // body + hump
  ctx.fillStyle = '#c98f4e';
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-2, -10, 9, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // blanket / cargo
  ctx.fillStyle = blanket;
  ctx.fillRect(-11, -8, 20, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(-11, -8, 20, 2);
  // neck + head
  ctx.strokeStyle = '#c98f4e';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(16, -4);
  ctx.quadraticCurveTo(24, -16, 26, -22);
  ctx.stroke();
  ctx.fillStyle = '#c98f4e';
  ctx.beginPath();
  ctx.ellipse(28, -23, 7, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // eye
  ctx.fillStyle = '#241a12';
  ctx.beginPath();
  ctx.arc(30, -24, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSaltCrystal(ctx, x, y, t) {
  const s = 10 + Math.sin(t * 4 + x) * 1.5;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#fff8e0';
  ctx.strokeStyle = PAL.gold;
  ctx.lineWidth = 2;
  ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.strokeRect(-s / 2, -s / 2, s, s);
  ctx.restore();
}

function drawWaterSkin(ctx, x, y, t) {
  const bob = Math.sin(t * 3 + x) * 2;
  ctx.fillStyle = PAL.water;
  ctx.beginPath();
  ctx.moveTo(x, y - 12 + bob);
  ctx.quadraticCurveTo(x + 10, y + 2 + bob, x, y + 11 + bob);
  ctx.quadraticCurveTo(x - 10, y + 2 + bob, x, y - 12 + bob);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath();
  ctx.arc(x - 3, y - 2 + bob, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawCoin(ctx, x, y, t) {
  ctx.fillStyle = PAL.gold;
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a87c1e';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, '¢', x, y + 0.5, 12, '#7a5a10', 'center', '800');
}

function drawSinkhole(ctx, x, y) {
  ctx.fillStyle = '#3a2415';
  ctx.beginPath();
  ctx.ellipse(x, y, 26, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = PAL.saltCrack;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 26, y - 4); ctx.lineTo(x - 12, y + 2); ctx.lineTo(x - 2, y - 5);
  ctx.moveTo(x + 8, y + 5); ctx.lineTo(x + 18, y - 2); ctx.lineTo(x + 26, y + 3);
  ctx.stroke();
  text(ctx, '!', x, y - 24, 16, PAL.danger, 'center', '900');
}

function drawThorn(ctx, x, y) {
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.42;
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + Math.cos(a) * 20, y + 8 + Math.sin(a) * 24);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a4a22';
  ctx.beginPath();
  ctx.arc(x, y + 8, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawRaider(ctx, x, y, t) {
  const bob = Math.sin(t * 10) * 3;
  ctx.fillStyle = '#8c1f28';
  ctx.beginPath();
  ctx.ellipse(x, y + bob, 13, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c22e35';
  ctx.beginPath();
  ctx.arc(x, y - 10 + bob, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e8b25c';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x + 8, y - 22 + bob);
  ctx.lineTo(x + 14, y + 6 + bob);
  ctx.stroke();
  text(ctx, '⚔', x, y - 26 + bob, 13, '#ffd9a0', 'center');
}

function drawWyrm(ctx, wyrm, t) {
  const segs = 9;
  for (let i = segs - 1; i >= 0; i--) {
    const sx = wyrm.x - wyrm.dir * i * 34;
    const sy = 330 + Math.sin(t * 2 + i * 0.7) * 26 - i * 4;
    const r = 26 - i * 1.6;
    ctx.fillStyle = i === 0 ? '#d8a35a' : '#b98a4e';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8a6a3a';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (i === 0) {
      ctx.fillStyle = '#241a12';
      ctx.beginPath();
      ctx.arc(sx + wyrm.dir * 12, sy - 8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(sx + wyrm.dir * 22, sy + 6, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawWorld(ctx, g, opts = {}) {
  const { W, H } = CFG;
  // dusk sky + sun
  const sky = ctx.createLinearGradient(0, 0, 0, 150);
  sky.addColorStop(0, PAL.skyTop);
  sky.addColorStop(0.55, PAL.skyMid);
  sky.addColorStop(1, PAL.skyLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 150);
  ctx.fillStyle = '#ffd98a';
  ctx.beginPath();
  ctx.arc(846, 108, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,217,138,0.25)';
  ctx.beginPath();
  ctx.arc(846, 108, 52, 0, Math.PI * 2);
  ctx.fill();
  // far dunes
  ctx.fillStyle = PAL.duneFar;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.quadraticCurveTo(180, 96, 380, 138);
  ctx.quadraticCurveTo(560, 172, 760, 128);
  ctx.quadraticCurveTo(920, 100, 1024, 140);
  ctx.lineTo(1024, 150);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PAL.duneNear;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.quadraticCurveTo(260, 122, 520, 148);
  ctx.quadraticCurveTo(800, 170, 1024, 138);
  ctx.lineTo(1024, 150);
  ctx.closePath();
  ctx.fill();
  // salt flat
  ctx.fillStyle = PAL.salt;
  ctx.fillRect(0, 150, W, H - 150);
  // salt polygons scrolling with distance
  const off = (g.distance % 90);
  ctx.strokeStyle = 'rgba(184,154,109,0.55)';
  ctx.lineWidth = 1.5;
  for (let row = 0; row < 6; row++) {
    const y = 168 + row * 74 + off * 0.4;
    for (let col = -1; col < 12; col++) {
      const x = col * 96 + (row % 2 ? 48 : 0) + ((g.distance * 0.13) % 96) * 0.2;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k + 0.5;
        const px = x + Math.cos(a) * 34;
        const py = y + Math.sin(a) * 24;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  // the trail: a meandering band the caravan walks, scrolling with distance
  const trailX = (y) => 512 + Math.sin(y * 0.006 + g.distance * 0.004) * 170;
  ctx.fillStyle = PAL.trail;
  ctx.beginPath();
  ctx.moveTo(trailX(150) - 85, 150);
  for (let y = 150; y <= 576; y += 24) ctx.lineTo(trailX(y) - 85, y);
  for (let y = 576; y >= 150; y -= 24) ctx.lineTo(trailX(y) + 85, y);
  ctx.closePath();
  ctx.fill();
  // entities
  const t = g.time;
  for (const e of g.trail.entities) {
    if (e.kind === 'salt') drawSaltCrystal(ctx, e.x, e.y, t);
    else if (e.kind === 'water') drawWaterSkin(ctx, e.x, e.y, t);
    else if (e.kind === 'coin') drawCoin(ctx, e.x, e.y, t);
    else if (e.kind === 'sinkhole') drawSinkhole(ctx, e.x, e.y);
    else if (e.kind === 'thorn') drawThorn(ctx, e.x, e.y);
    else if (e.kind === 'raider') drawRaider(ctx, e.x, e.y, t);
  }
  if (g.trail.wyrm) drawWyrm(ctx, g.trail.wyrm, t);
  // gust indicator
  if (Math.abs(g.trail.gust) > 0.35) {
    ctx.fillStyle = 'rgba(255,246,224,0.85)';
    text(ctx, g.trail.gust > 0 ? '💨 GUST →' : '← 💨 GUST', g.trail.gust > 0 ? 940 : 84, 190, 16, '#7a5a10', 'center', '800');
  }
  // caravan: followers first, lead last (hidden on camp/win/lose screens)
  const blink = g.caravan.invuln > 0 && Math.floor(t * 12) % 2 === 0;
  if (!blink && !opts.hideCaravan) {
    const blankets = ['#3ec6b8', '#e84a4a', '#f5c542', '#8a6fd8', '#4fb3e8', '#e87ab0'];
    for (let i = g.camels - 1; i >= 1; i--) {
      const p = g.caravan.followerPos(i);
      drawCamel(ctx, p.x, p.y, 0.85, g.caravan.bob + i * 1.3, blankets[i % blankets.length]);
    }
    drawCamel(ctx, g.caravan.x, g.caravan.y, 1, g.caravan.bob, '#e8b25c');
    // lead flag
    ctx.strokeStyle = '#241a12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(g.caravan.x + 22, g.caravan.y - 22);
    ctx.lineTo(g.caravan.x + 22, g.caravan.y - 40);
    ctx.stroke();
    ctx.fillStyle = PAL.teal;
    ctx.beginPath();
    ctx.moveTo(g.caravan.x + 22, g.caravan.y - 40);
    ctx.lineTo(g.caravan.x + 40, g.caravan.y - 35);
    ctx.lineTo(g.caravan.x + 22, g.caravan.y - 30);
    ctx.closePath();
    ctx.fill();
  }
  // particles + floating text
  for (const p of g.particles.list) {
    const a = 1 - p.t / p.life;
    if (p.ring) {
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = a;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6 + (p.t / p.life) * 46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.globalAlpha = 1;
    }
  }
  for (const ft of g.particles.texts) {
    ctx.globalAlpha = 1 - ft.t / ft.life;
    text(ctx, ft.text, ft.x, ft.y, 17, ft.color, 'center', '800');
    ctx.globalAlpha = 1;
  }
}

export function drawHUD(ctx, g) {
  const { W } = CFG;
  // top bar
  ctx.fillStyle = 'rgba(20,12,6,0.72)';
  ctx.fillRect(0, 0, W, 46);
  text(ctx, 'SALTROAD', 16, 23, 19, PAL.gold, 'left', '900');
  text(ctx, `DAY ${g.day} / ${CFG.DAYS}`, 150, 23, 17, PAL.cream, 'left', '800');
  // progress to the oasis
  const prog = (g.day - 1 + g.dayProgress) / CFG.DAYS;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, 250, 16, 180, 12, 6);
  ctx.fill();
  ctx.fillStyle = PAL.teal;
  roundRect(ctx, 250, 16, 180 * prog, 12, 6);
  ctx.fill();
  text(ctx, '🏝️ OASIS', 436, 23, 12, PAL.cream, 'left', '700');
  // water bar
  text(ctx, '💧 WATER', 520, 16, 12, '#9fd8ff', 'left', '800');
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, 520, 24, 120, 10, 5);
  ctx.fill();
  const wfrac = Math.max(0, g.water / g.waterMax);
  ctx.fillStyle = g.water <= CFG.WATER_LOW_WARN ? PAL.danger : PAL.water;
  roundRect(ctx, 520, 24, 120 * wfrac, 10, 5);
  ctx.fill();
  text(ctx, `${Math.ceil(g.water)}`, 646, 23, 14, PAL.cream, 'left', '800');
  // salt / coin / camels
  text(ctx, `◆ SALT ${g.salt}`, 690, 23, 15, PAL.gold, 'left', '800');
  text(ctx, `¢ ${g.coin}`, 800, 23, 15, PAL.gold, 'left', '800');
  text(ctx, `🐪 ×${g.camels}`, 868, 23, 15, PAL.cream, 'left', '800');
  // score + combo
  text(ctx, `SCORE ${g.score.toLocaleString('en-US')}`, 16, 64, 16, PAL.cream, 'left', '800');
  if (g.combo > 1) text(ctx, `COMBO ×${g.combo}`, 16, 86, 16, PAL.gold, 'left', '900');
  text(ctx, `BEST ${g.best.toLocaleString('en-US')}`, W - 16, 64, 14, PAL.muted, 'right', '700');
  if (g.banner) {
    ctx.fillStyle = 'rgba(20,12,6,0.6)';
    roundRect(ctx, W / 2 - 260, 96, 520, 40, 10);
    ctx.fill();
    text(ctx, g.banner, W / 2, 117, 20, PAL.gold, 'center', '900');
  }
  if (g.water <= CFG.WATER_LOW_WARN) {
    const pulse = 0.5 + Math.sin(g.time * 6) * 0.3;
    ctx.globalAlpha = pulse;
    text(ctx, '⚠ WATER LOW — FIND A SKIN ⚠', W / 2, 160, 18, PAL.danger, 'center', '900');
    ctx.globalAlpha = 1;
  }
  // bottom hint
  ctx.fillStyle = 'rgba(20,12,6,0.55)';
  ctx.fillRect(0, 548, W, 28);
  text(ctx, 'Mouse / WASD steer · SHIFT sprint (thirsty!) · P pause · M mute', W / 2, 562, 13, PAL.cream, 'center', '600');
}

function statCard(ctx, x, y, w, value, label) {
  panel(ctx, x, y, w, 64);
  text(ctx, value, x + w / 2, y + 24, 24, PAL.gold, 'center', '900');
  text(ctx, label, x + w / 2, y + 48, 11, PAL.muted, 'center', '700');
}

export function drawTitle(ctx, g) {
  drawWorld(ctx, g);
  ctx.fillStyle = 'rgba(20,10,20,0.45)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  text(ctx, 'SALTROAD', 512, 120, 84, PAL.gold, 'center', '900');
  text(ctx, 'Carry the salt across the White Wastes — twelve days to the Oasis.', 512, 168, 19, PAL.cream, 'center', '600');
  panel(ctx, 262, 200, 500, 150);
  text(ctx, 'HOW TO PLAY', 512, 224, 16, PAL.gold, 'center', '900');
  const lines = [
    ['MOUSE / WASD', 'steer the lead camel — the caravan follows'],
    ['SHIFT', 'sprint, but sprinting makes you thirsty'],
    ['◆ SALT', 'collect chains for a combo — up to ×8'],
    ['💧 WATER', 'drink or die: thirst never stops'],
    ['⛺ DUSK', 'each night, pick 1 of 3 supplies at camp'],
  ];
  lines.forEach((l, i) => {
    text(ctx, l[0], 292, 250 + i * 20, 14, PAL.gold, 'left', '800');
    text(ctx, l[1], 470, 250 + i * 20, 14, PAL.cream, 'left', '600');
  });
  text(ctx, `WIN: reach the White Oasis on Day 12 · LOSE: water runs out or the last camel falls`, 512, 372, 15, '#ffd9a0', 'center', '700');
  if (g.best > 0) text(ctx, `BEST SCORE ◆ ${g.best.toLocaleString('en-US')}`, 512, 404, 16, PAL.muted, 'center', '800');
  const pulse = 0.65 + Math.sin(g.time * 3) * 0.35;
  ctx.globalAlpha = pulse;
  text(ctx, 'CLICK TO BEGIN', 512, 452, 30, PAL.cream, 'center', '900');
  ctx.globalAlpha = 1;
  text(ctx, 'P pause · M mute · R restart', 512, 500, 13, PAL.muted, 'center', '600');
}

export function drawCamp(ctx, g) {
  drawWorld(ctx, g, { hideCaravan: true });
  ctx.fillStyle = 'rgba(20,10,20,0.55)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  text(ctx, `DUSK · DAY ${g.day} SURVIVED`, 512, 66, 34, PAL.gold, 'center', '900');
  const cards = g.camp.cards;
  const cw = 210;
  const gap = 24;
  const total = cards.length * cw + (cards.length - 1) * gap;
  const x0 = (CFG.W - total) / 2;
  text(ctx, 'CHOOSE ONE SUPPLY', 512, 116, 18, PAL.cream, 'center', '800');
  cards.forEach((c, i) => {
    const x = x0 + i * (cw + gap);
    const y = 136;
    const picked = g.camp.picked === c.id;
    ctx.fillStyle = picked ? '#3a2a10' : 'rgba(24,14,8,0.88)';
    roundRect(ctx, x, y, cw, 190, 12);
    ctx.fill();
    ctx.strokeStyle = picked ? PAL.gold : PAL.panelEdge;
    ctx.lineWidth = picked ? 3 : 1.5;
    ctx.stroke();
    text(ctx, `${i + 1}`, x + 16, y + 20, 13, PAL.muted, 'left', '800');
    text(ctx, c.rarity.toUpperCase(), x + cw - 16, y + 20, 11, c.rarity === 'rare' ? '#c9a2ff' : PAL.muted, 'right', '800');
    text(ctx, c.icon, x + cw / 2, y + 66, 40, '#fff', 'center');
    text(ctx, c.name, x + cw / 2, y + 112, 18, PAL.gold, 'center', '800');
    // wrap desc
    const words = c.desc.split(' ');
    let line = '';
    let ly = 140;
    for (const w of words) {
      if ((line + ' ' + w).trim().length > 22) { text(ctx, line.trim(), x + cw / 2, y + ly, 13, PAL.cream, 'center', '600'); line = w; ly += 18; }
      else line += ' ' + w;
    }
    text(ctx, line.trim(), x + cw / 2, y + ly, 13, PAL.cream, 'center', '600');
    if (picked) text(ctx, '✓ TAKEN', x + cw / 2, y + 172, 14, PAL.teal, 'center', '900');
  });
  // trade row
  const trades = g.camp.trades(g);
  text(ctx, 'TRADE AT THE FIRE (optional)', 512, 356, 14, PAL.muted, 'center', '800');
  const tw = 300;
  const tx0 = (CFG.W - trades.length * tw - (trades.length - 1) * 16) / 2;
  trades.forEach((t, i) => {
    const x = tx0 + i * (tw + 16);
    ctx.fillStyle = t.ok ? 'rgba(24,14,8,0.88)' : 'rgba(24,14,8,0.45)';
    roundRect(ctx, x, 372, tw, 40, 10);
    ctx.fill();
    ctx.strokeStyle = t.ok ? PAL.panelEdge : 'rgba(200,180,140,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    text(ctx, t.label, x + tw / 2, 393, 14, t.ok ? PAL.cream : PAL.muted, 'center', '700');
    t._x = x; t._w = tw;
  });
  // resources + continue
  text(ctx, `◆ SALT ${g.salt}   ¢ ${g.coin}   💧 ${Math.ceil(g.water)}/${g.waterMax}   🐪 ×${g.camels}   SCORE ${g.score.toLocaleString('en-US')}`, 512, 436, 16, PAL.cream, 'center', '800');
  if (g.camp.picked) {
    const pulse = 0.65 + Math.sin(g.time * 3) * 0.35;
    ctx.globalAlpha = pulse;
    text(ctx, 'SPACE — BREAK CAMP, DAY ' + (g.day + 1), 512, 486, 24, PAL.gold, 'center', '900');
    ctx.globalAlpha = 1;
  } else {
    text(ctx, 'Pick a card (1-3 or click) to break camp', 512, 486, 17, PAL.muted, 'center', '700');
  }
}

function endStats(ctx, g, rows) {
  const w = 150;
  const gap = 14;
  const total = rows.length * w + (rows.length - 1) * gap;
  let x = (CFG.W - total) / 2;
  for (const r of rows) { statCard(ctx, x, 210, w, r[0], r[1]); x += w + gap; }
}

export function drawWin(ctx, g) {
  drawWorld(ctx, g, { hideCaravan: true });
  ctx.fillStyle = 'rgba(16,30,26,0.5)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  text(ctx, 'THE WHITE OASIS', 512, 96, 54, PAL.teal, 'center', '900');
  text(ctx, 'Twelve days kept. The salt is delivered. The caravan drinks.', 512, 140, 18, PAL.cream, 'center', '600');
  endStats(ctx, g, [
    [`${CFG.DAYS}/${CFG.DAYS}`, 'DAYS SURVIVED'],
    [`${g.saltTotal}`, 'SALT GATHERED'],
    [`${g.camels}`, 'CAMELS HOME'],
    [`×${g.bestCombo}`, 'BEST COMBO'],
  ]);
  text(ctx, 'FINAL SCORE', 512, 312, 15, PAL.muted, 'center', '700');
  text(ctx, g.score.toLocaleString('en-US'), 512, 350, 52, PAL.gold, 'center', '900');
  text(ctx, `GRADE ${g.grade}` + (g.newBest ? '  ·  NEW BEST' : ''), 512, 396, 20, PAL.teal, 'center', '900');
  text(ctx, `BEST ◆ ${g.best.toLocaleString('en-US')}`, 512, 428, 15, PAL.muted, 'center', '700');
  const pulse = 0.65 + Math.sin(g.time * 3) * 0.35;
  ctx.globalAlpha = pulse;
  text(ctx, 'PRESS R OR CLICK TO PLAY AGAIN', 512, 486, 24, PAL.cream, 'center', '900');
  ctx.globalAlpha = 1;
}

export function drawLose(ctx, g) {
  drawWorld(ctx, g, { hideCaravan: true });
  ctx.fillStyle = 'rgba(30,10,10,0.6)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  text(ctx, 'THE WASTES TAKE YOU', 512, 96, 48, PAL.danger, 'center', '900');
  text(ctx, g.loseReason, 512, 140, 18, PAL.cream, 'center', '600');
  endStats(ctx, g, [
    [`${g.day - 1}/${CFG.DAYS}`, 'DAYS SURVIVED'],
    [`${g.saltTotal}`, 'SALT GATHERED'],
    [`${g.score.toLocaleString('en-US')}`, 'SCORE'],
    [`×${g.bestCombo}`, 'BEST COMBO'],
  ]);
  text(ctx, `BEST ◆ ${g.best.toLocaleString('en-US')}`, 512, 330, 15, PAL.muted, 'center', '700');
  const pulse = 0.65 + Math.sin(g.time * 3) * 0.35;
  ctx.globalAlpha = pulse;
  text(ctx, 'PRESS R OR CLICK TO TRY AGAIN', 512, 420, 24, PAL.cream, 'center', '900');
  ctx.globalAlpha = 1;
}

export function drawPause(ctx) {
  ctx.fillStyle = 'rgba(16,10,6,0.6)';
  ctx.fillRect(0, 0, CFG.W, CFG.H);
  text(ctx, 'PAUSED', 512, 260, 44, PAL.cream, 'center', '900');
  text(ctx, 'P / ESC resume · R restart · M mute', 512, 310, 16, PAL.muted, 'center', '600');
}

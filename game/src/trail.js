// SALTROAD — the trail: seeded per-day spawns of pickups, hazards and events.
import { CFG } from './config.js';
import { makeRng } from './rng.js';

export class Trail {
  constructor() {
    this.entities = [];
    this.spawnT = 0;
    this.wyrm = null; // {x, dir, t} crossing worm, day 8
    this.wyrmTimer = 0;
    this.gust = 0; // current sideways wind force (-1..1)
    this.gustTimer = 0;
    this.day = 1;
    this.rng = makeRng(1);
  }
  startDay(day, seed) {
    this.day = day;
    this.rng = makeRng(seed * 1000 + day * 77);
    this.entities = [];
    this.spawnT = 0.4;
    this.wyrm = null;
    this.wyrmTimer = day === 8 ? 6 : -1;
    this.gust = 0;
    this.gustTimer = 2;
  }
  difficulty() {
    return 1 + (this.day - 1) * 0.09;
  }
  update(dt, game) {
    const d = this.difficulty();
    // spawn cadence quickens through the campaign
    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      this.spawnT = Math.max(0.32, 0.95 - this.day * 0.045) * this.rng.range(0.8, 1.25);
      this.spawnOne(game);
    }
    const scroll = CFG.BASE_SPEED * game.speedMult * (game.caravan.sprinting ? CFG.SPRINT_MULT : 1) * dt;
    // gusts: day 12 storm, or occasional desert wind from day 3
    this.gustTimer -= dt;
    if (this.gustTimer <= 0) {
      const stormDay = this.day >= 12;
      if (stormDay || this.day >= 3) {
        this.gust = this.rng.range(-1, 1) * (stormDay ? 1 : 0.6);
        this.gustTimer = this.rng.range(stormDay ? 1.2 : 2.5, stormDay ? 2.2 : 5);
        if (Math.abs(this.gust) > 0.35) game.audio.gust();
      } else {
        this.gust = 0;
        this.gustTimer = 2;
      }
    }
    if (this.gust !== 0) {
      const push = game.sandSails ? -this.gust * 26 * dt : this.gust * 46 * dt;
      game.caravan.x = Math.max(46, Math.min(978, game.caravan.x + push));
    }
    // Dune Wyrm event (day 8): a giant worm crosses the trail
    if (this.wyrmTimer > 0) {
      this.wyrmTimer -= dt;
      if (this.wyrmTimer <= 0) {
        if (game.wyrmCharm) {
          game.floatText(512, 200, 'THE WYRM SLEEPS — CHARM HELD', '#3ec6b8');
          this.wyrmTimer = -1;
        } else {
          this.wyrm = { x: this.rng.chance(0.5) ? -80 : 1104, dir: this.rng.chance(0.5) ? 1 : -1, t: 0 };
          if (this.wyrm.x > 0) this.wyrm.dir = -1;
          this.wyrmTimer = 9;
        }
      }
    }
    if (this.wyrm) {
      this.wyrm.x += this.wyrm.dir * 260 * dt;
      this.wyrm.t += dt;
      if (this.wyrm.x < -160 || this.wyrm.x > 1184) this.wyrm = null;
    }
    // move entities down the screen; raiders chase the tail camel
    for (const e of this.entities) {
      e.y += (e.vy || 60) * d * dt * (game.caravan.sprinting ? 1.15 : 1);
      if (e.kind === 'raider') {
        const tail = game.caravan.followerPos(Math.max(1, game.camels - 1));
        e.x += Math.max(-1, Math.min(1, (tail.x - e.x) / 40)) * 95 * dt;
      }
      if (e.kind === 'water' && game.compass) {
        e.x += Math.max(-1, Math.min(1, (game.caravan.x - e.x) / 50)) * 26 * dt;
      }
    }
    this.entities = this.entities.filter((e) => e.y < 640 && e.hp > 0);
    return scroll;
  }
  spawnOne(game) {
    const r = this.rng;
    const d = this.difficulty();
    const roll = r.next();
    const x = r.range(60, 964);
    // Day 4: raider ambush — raiders arrive in packs
    if (this.day === 4 && !game.guard && r.chance(0.3)) {
      for (let i = 0; i < 3; i++) {
        this.entities.push({ kind: 'raider', x: r.range(80, 944), y: -30 - i * 46, vy: 88, hp: 1, r: 16 });
      }
      return;
    }
    if (roll < 0.34) {
      // salt crystals come in little chains of 2-4
      const n = r.int(2, 4);
      const cx = x;
      for (let i = 0; i < n; i++) {
        this.entities.push({ kind: 'salt', x: Math.max(50, Math.min(974, cx + (i - (n - 1) / 2) * 34)), y: -20 - i * 30, vy: 62, hp: 1, r: 12 });
      }
    } else if (roll < 0.52) {
      this.entities.push({ kind: 'water', x, y: -20, vy: 58, hp: 1, r: 13 });
    } else if (roll < 0.62) {
      this.entities.push({ kind: 'coin', x, y: -20, vy: 64, hp: 1, r: 11 });
    } else if (roll < 0.76) {
      this.entities.push({ kind: 'sinkhole', x, y: -30, vy: 60, hp: 1, r: 26 });
    } else if (roll < 0.86) {
      this.entities.push({ kind: 'thorn', x, y: -30, vy: 60, hp: 1, r: 20 });
    } else if (roll < 0.94 && !game.guard) {
      this.entities.push({ kind: 'raider', x, y: -30, vy: 82, hp: 1, r: 16 });
    } else {
      this.entities.push({ kind: 'salt', x, y: -20, vy: 62, hp: 1, r: 12 });
    }
    void d;
  }
}

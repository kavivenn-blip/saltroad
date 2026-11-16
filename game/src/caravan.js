// SALTROAD — the caravan: lead camel steering, followers, camels as lives.
import { CFG } from './config.js';

export class Caravan {
  constructor() {
    this.x = 512;
    this.y = 400;
    this.vx = 0;
    this.sprinting = false;
    this.invuln = 0;
    this.trail = []; // past head positions, followers walk them
    this.bob = 0;
  }
  reset() {
    this.x = 512;
    this.y = 400;
    this.vx = 0;
    this.invuln = 0;
    this.trail = [];
    this.bob = 0;
  }
  update(dt, input, speedMult) {
    const k = input;
    let ax = 0;
    let ay = 0;
    if (k.down('ArrowLeft', 'a', 'A')) ax -= 1;
    if (k.down('ArrowRight', 'd', 'D')) ax += 1;
    if (k.down('ArrowUp', 'w', 'W')) ay -= 1;
    if (k.down('ArrowDown', 's', 'S')) ay += 1;
    this.sprinting = k.down('Shift');
    if (ax !== 0 || ay !== 0) {
      const len = Math.hypot(ax, ay);
      this.x += (ax / len) * CFG.STEER_SPEED * dt;
      this.y += (ay / len) * CFG.STEER_SPEED * 0.7 * dt;
      this.vx = ax / len;
    } else {
      // mouse steering: the caravan follows the pointer with a lag
      const tx = k.mouse.x;
      const ty = Math.min(Math.max(k.mouse.y, 180), 520);
      this.x += (tx - this.x) * Math.min(1, CFG.MOUSE_FOLLOW * dt);
      this.y += (ty - this.y) * Math.min(1, CFG.MOUSE_FOLLOW * 0.6 * dt);
      this.vx = Math.max(-1, Math.min(1, (tx - this.x) / 60));
    }
    this.x = Math.max(46, Math.min(978, this.x));
    this.y = Math.max(150, Math.min(520, this.y));
    this.bob += dt * (this.sprinting ? 11 : 7);
    if (this.invuln > 0) this.invuln -= dt;
    // record the trail by distance, so followers keep their spacing even when slow
    const last = this.trail[0];
    if (!last || Math.hypot(this.x - last.x, this.y - last.y) >= 8) {
      this.trail.unshift({ x: this.x, y: this.y });
      if (this.trail.length > 120) this.trail.pop();
    }
  }
  // follower slot i (1..n): a point back along the trail, 32px per camel
  followerPos(i) {
    const idx = Math.min(this.trail.length - 1, i * 4);
    return this.trail[idx] || { x: this.x, y: this.y + i * 32 };
  }
}

// SALTROAD — pooled particles, shockwave rings and floating score text.
export class Particles {
  constructor() {
    this.list = [];
    this.texts = [];
  }
  burst(x, y, n, color, speed = 120) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.4 + Math.random() * 0.8);
      this.list.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, life: 0.5 + Math.random() * 0.4, t: 0, color, size: 2 + Math.random() * 3 });
    }
    if (this.list.length > 320) this.list.splice(0, this.list.length - 320);
  }
  ring(x, y, color) {
    this.list.push({ x, y, vx: 0, vy: 0, life: 0.5, t: 0, color, size: 4, ring: true });
  }
  float(x, y, text, color) {
    this.texts.push({ x, y, text, color, t: 0, life: 1.1 });
    if (this.texts.length > 24) this.texts.shift();
  }
  update(dt) {
    for (const p of this.list) {
      p.t += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 60 * dt;
    }
    this.list = this.list.filter((p) => p.t < p.life);
    for (const t of this.texts) { t.t += dt; t.y -= 34 * dt; }
    this.texts = this.texts.filter((t) => t.t < t.life);
  }
}

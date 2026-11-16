// SALTROAD — synthesised sound effects (WebAudio, no audio files).
export class AudioSys {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.wind = null;
  }
  ensure() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.startWind();
      } catch { /* audio unavailable: play silent */ }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }
  toggleMute() { this.muted = !this.muted; return this.muted; }
  startWind() {
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = last * 0.98 + (Math.random() * 2 - 1) * 0.02;
      data[i] = last * 3.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.value = 0.05;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    this.wind = { gain, filter };
  }
  tone(freq, dur, type = 'sine', vol = 0.16, slide = 0) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  }
  pickup(combo) {
    const base = 520 + Math.min(combo, 8) * 45;
    this.tone(base, 0.12, 'triangle', 0.14);
    this.tone(base * 1.5, 0.14, 'sine', 0.1);
  }
  water() { this.tone(320, 0.25, 'sine', 0.16, 320); }
  coin() { this.tone(880, 0.1, 'square', 0.07); this.tone(1320, 0.16, 'square', 0.06); }
  hurt() { this.tone(180, 0.3, 'sawtooth', 0.18, -110); }
  gust() {
    if (!this.ctx || this.muted || !this.wind) return;
    const g = this.wind.gain.gain;
    g.cancelScheduledValues(this.ctx.currentTime);
    g.setValueAtTime(g.value, this.ctx.currentTime);
    g.linearRampToValueAtTime(0.14, this.ctx.currentTime + 0.15);
    g.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.9);
  }
  card() { this.tone(660, 0.1, 'triangle', 0.12); this.tone(990, 0.18, 'triangle', 0.1); }
  win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.tone(f, 0.35, 'triangle', 0.14), i * 130)); }
  lose() { [392, 330, 262, 196].forEach((f, i) => setTimeout(() => this.tone(f, 0.4, 'sine', 0.13), i * 170)); }
}

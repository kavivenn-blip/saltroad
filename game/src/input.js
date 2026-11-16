// SALTROAD — keyboard and mouse, with one-shot action flags.
export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.pressed = new Set();
    this.mouse = { x: 512, y: 380, down: false, clicked: false };
    this.anyKey = false;
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (!this.keys.has(e.key)) this.pressed.add(e.key);
      this.keys.add(e.key);
      this.anyKey = true;
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key));
    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * 1024;
      this.mouse.y = ((e.clientY - r.top) / r.height) * 576;
    });
    canvas.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
      this.mouse.clicked = true;
      const r = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - r.left) / r.width) * 1024;
      this.mouse.y = ((e.clientY - r.top) / r.height) * 576;
    });
    window.addEventListener('mouseup', () => { this.mouse.down = false; });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  down(...keys) { return keys.some((k) => this.keys.has(k)); }
  hit(...keys) { return keys.some((k) => this.pressed.has(k)); }
  endFrame() {
    this.pressed.clear();
    this.mouse.clicked = false;
    this.anyKey = false;
  }
}

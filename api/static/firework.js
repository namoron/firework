class Firework {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.hue = Math.random() * 360;
    }
  
    createParticles(x, y) {
      for (let i = 0; i < 100; i++) {
        const particle = {
          x: x,
          y: y,
          vx: Math.random() * 6 - 3,
          vy: Math.random() * 6 - 3,
          radius: Math.random() * 2 + 1,
          alpha: 1,
        };
        this.particles.push(particle);
      }
    }
  
    update() {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalCompositeOperation = 'lighter';
  
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= 0.01;
  
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${p.alpha})`;
        this.ctx.fill();
  
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          i--;
        }
      }
    }
  
    launch(x, y) {
      this.createParticles(x, y);
    }
  }
  
  class FireworksDisplay {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.fireworks = [];
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }
  
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    addFirework() {
      const x = Math.random() * this.canvas.width;
      const y = this.canvas.height;
      const targetY = Math.random() * this.canvas.height / 2;
      const firework = new Firework(this.canvas);
      this.fireworks.push({ firework, x, y, targetY });
    }
  
    update() {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      for (let i = 0; i < this.fireworks.length; i++) {
        const fw = this.fireworks[i];
        fw.y -= 4;
  
        if (fw.y <= fw.targetY) {
          fw.firework.launch(fw.x, fw.y);
          this.fireworks.splice(i, 1);
          i--;
        } else {
          this.ctx.beginPath();
          this.ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          this.ctx.closePath();
          this.ctx.fillStyle = 'white';
          this.ctx.fill();
        }
      }
  
      for (const fw of this.fireworks) {
        fw.firework.update();
      }
  
      requestAnimationFrame(() => this.update());
    }
  
    start() {
      this.update();
    }
  }
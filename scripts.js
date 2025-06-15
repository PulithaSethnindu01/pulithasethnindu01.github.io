const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight * 0.9; // hero height
}

window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 1 + Math.random() * 2;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.alpha = 0.1 + Math.random() * 0.3;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(100, 100, 100, ${this.alpha})`;
    ctx.shadowColor = `rgba(150, 150, 150, ${this.alpha})`;
    ctx.shadowBlur = 4;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = [];
const PARTICLE_COUNT = 70;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

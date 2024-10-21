const PARTICLES_TO_SPAW = 20;

const particles = [];

class Particle {
  constructor(x, y) {
    this.initialX = x;
    this.initialY = y;
    this.size = Math.random() * 5 + 1; // Tamaño aleatorio
    this.speedX = Math.random() * 0.3; // Velocidad en X
    this.speedY = Math.random() * 0.3; // Velocidad en Y
    this.parallaxOffsetX = 0;
    this.parallaxOffsetY = 0;
  }

  update(canvasWidth, canvasHeight, mouseX, mouseY, parallaxStrength) {
    // Actualiza la posición original con la velocidad
    this.initialX += this.speedX;
    this.initialY += this.speedY;

    // Aplicar el parallax en base al movimiento del mouse
    this.parallaxOffsetX =
      (mouseX / canvasWidth) * parallaxStrength * canvasWidth;
    this.parallaxOffsetY =
      (mouseY / canvasHeight) * parallaxStrength * canvasHeight;

    // Actualiza la posición de la partícula con el parallax
    this.x = this.initialX + this.parallaxOffsetX;
    this.y = this.initialY + this.parallaxOffsetY;

    // Rebotar partículas al llegar a los bordes del canvas
    if (this.size > 0) {
      if (
        this.initialX > canvasWidth - this.size ||
        this.initialX < this.size
      ) {
        this.speedX *= -1;
      }
      if (
        this.initialY > canvasHeight - this.size ||
        this.initialY < this.size
      ) {
        this.speedY *= -1;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#3335"; // Color de la partícula
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

export function createParticles(canvas) {
  for (let i = 0; i < PARTICLES_TO_SPAW; i++) {
    particles.push(
      new Particle(Math.random() * canvas.width, Math.random() * canvas.height)
    );
  }
}

// Animar partículas
export function renderParticles(canvasWidth, canvasHeight, ctx, mouseX, mouseY, parallaxStrength) {
  particles.forEach((particle) => {
    particle.update(canvasWidth, canvasHeight, mouseX, mouseY, parallaxStrength);
    particle.draw(ctx);
  });
}

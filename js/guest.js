import { CONFIG } from "./config";
import { SPRITE } from "./spritesSetup";

let currentGuest = null;

const originalSize = 896;
const scale = 0.65;

class Guest {
  constructor(canvas, skin, isDoppelganger) {
    this.skin = skin;
    this.x = -canvas.width;
    this.y = canvas.height - originalSize * scale;
    this.initialY = this.y;
    this.width = originalSize * scale;
    this.height = originalSize * scale;

    // Dirección
    this.direction = "right";
    this.speed = 2;

    // Estado del personaje
    this.hasReachedMiddle = false;
    this.hasSpoken = false;
    this.isDoppelganger = isDoppelganger;

    // Posición del medio del canvas
    this.middlePosition = (canvas.width / 6) * 3;

    // Variables para el efecto de pasos
    this.stepAmplitude = 5;
    this.stepSpeed = 0.1;
    this.stepOffset = 0;
  }

  update() {
    // Movimiento del personaje
    if (this.direction === "right") {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }

    // Efecto de pasos (movimiento vertical)
    this.stepOffset += this.stepSpeed;
    this.y = this.initialY + Math.sin(this.stepOffset) * this.stepAmplitude;
  }

  draw(ctx) {
    ctx.drawImage(this.skin, this.x, this.y, this.width, this.height);
  }
}

export function renderGuests(canvas, ctx) {
  if (CONFIG.PLAYING && CONFIG.CONTINUE_WORKING && currentGuest === null) {
    currentGuest = new Guest(canvas, SPRITE.GUEST);
  }

  if (currentGuest) {
    currentGuest.draw(ctx);
    currentGuest.update();
  }
}

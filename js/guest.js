import { CONFIG } from "./config";
import { sounds } from "./soundsSetup";
import { SPRITE } from "./spritesSetup";

let currentGuest = null;

const originalSize = 896;
const scale = 0.65;

class Guest {
  constructor(canvas, skin, isDoppelganger) {
    this.skin = skin;
    this.currentPositionX = -canvas.width;
    this.currentPositionY = (canvas.height - originalSize * scale) + (scale * 4)
    this.x = 0;
    this.y = 0;
    this.initialY = this.y;
    this.width = originalSize * scale;
    this.height = originalSize * scale;

    this.speed = 2;

    // Estado del personaje
    this.hasReachedMiddle = false;
    this.hasSpoken = false;
    this.isDoppelganger = isDoppelganger;

    // Variables para el efecto de pasos
    this.stepAmplitude = 5;
    this.stepSpeed = 0.1;
    this.stepOffset = 0;
    this.walking = true


    // Variables para el efecto de respiración
    this.scaleFactor = 1; // Factor inicial de escala
    this.breathingSpeed = 0.02; // Velocidad de respiración (ajustable)
    this.breathingAmplitude = 0.03; // Amplitud del efecto de respiración (ajustable)
    this.breathingOffset = 0; // Desfase en la animación

    // Others
    this.openDoor = false
  }

  update(scene) {
    this.x = scene.x + this.currentPositionX
    this.y = scene.y + this.currentPositionY

    // Movimiento del personaje
    const positionMiddle = (scene.x + (scene.width / 2) - (this.width / 2))
    const beforeTheMiddle = this.x < positionMiddle
    const aftherTheMiddle = this.x > (positionMiddle + this.speed)

    if (beforeTheMiddle || !CONFIG.CLOSED_DOOR || aftherTheMiddle)
      this.currentPositionX += this.speed;
    else {
      this.walking = false
    }

    if (this.walking) {
      // Efecto de pasos (movimiento vertical)
      this.stepOffset += this.stepSpeed;
      this.currentPositionY = this.initialY + Math.sin(this.stepOffset) * this.stepAmplitude;
    } else {
      // Efecto de respiración (escala de tamaño) 
      this.breathingOffset += this.breathingSpeed;
      this.scaleFactor = 1 + Math.sin(this.breathingOffset) * this.breathingAmplitude;
    }

    if (aftherTheMiddle && !this.openDoor) {
      this.walking = true
      this.openDoor = true
      sounds.get('door').play()
    }
  }

  draw(ctx) {
    const scaledWidth = this.width * this.scaleFactor;
    const scaledHeight = this.height * this.scaleFactor;
    const positionX = this.x - (scaledWidth - this.width) / 2
    const positionY = this.y - (scaledHeight - this.height) / 2
    ctx.drawImage(this.skin, positionX, positionY, scaledWidth, scaledHeight);
  }
}

export function renderGuests(canvas, ctx, scene) {
  if (CONFIG.PLAYING && CONFIG.CONTINUE_WORKING && currentGuest === null) {
    currentGuest = new Guest(canvas, SPRITE.GUEST);
  }

  if (currentGuest) {
    currentGuest.draw(ctx);
    currentGuest.update(scene);
  }
}

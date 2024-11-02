import { CONFIG } from "./config";
import { sounds } from "./soundsSetup";
import { SPRITE } from "./spritesSetup";
import { showDialog } from "./utils";

let currentGuest = null;

const originalSize = 896;
const scale = 0.65;

const possibleInputDialogs = [
  '...',
  'Hi human',
  'Hello! I want to drink your blood',
  'Today you look very juicy',
  'Human, I want to eat you alive, so you taste better',
  'Let me in'
]

class Guest {
  constructor(scene, skin, isDoppelganger) {
    this.skin = skin;
    this.currentPositionX = -scene.x - (scene.width / 2);
    this.currentPositionY = (scene.y + scene.height / 2) - (originalSize / 2 * scale)
    this.x = this.currentPositionX;
    this.y = this.currentPositionY;
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
    this.greet = true
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

      if (this.greet) {
        this.arrival()
      }
    }

    if (aftherTheMiddle && !this.openDoor) {
      this.walking = true
      this.openDoor = true
      sounds.get('door').play()
    }
  }

  async arrival() {
    this.greet = false
    const dialogId = Math.round(Math.random() * possibleInputDialogs.length)
    await showDialog([
      possibleInputDialogs[dialogId]
    ], dialogId !== 0)
  }

  draw(ctx) {
    const scaledWidth = this.width * this.scaleFactor;
    const scaledHeight = this.height * this.scaleFactor;
    const positionX = this.x - (scaledWidth - this.width) / 2
    const positionY = this.y - (scaledHeight - this.height) / 2
    ctx.drawImage(this.skin, positionX, positionY, scaledWidth, scaledHeight);
  }
}

export function renderGuests(ctx, scene) {
  if (CONFIG.SPAWN_AGENT) {
    currentGuest = null
  }

  if (CONFIG.PLAYING && CONFIG.CONTINUE_WORKING && currentGuest === null && !CONFIG.SPAWN_AGENT) {
    currentGuest = new Guest(scene, SPRITE.GUEST);
  }

  if (currentGuest) {
    currentGuest.draw(ctx);
    currentGuest.update(scene);
  }
}

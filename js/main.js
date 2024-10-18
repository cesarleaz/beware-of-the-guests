import { setupEventHandlers } from './eventHandlers.js';
import { applyParallax } from './parallax.js';
import { Sprite, setupSprites } from './spritesSetup'

const canvas = document.getElementById('gameCanvas');

console.log('started')

// Cargar las imágenes
await setupSprites(
    ['background', 'images/scene-background.jpg'],
    ['scene', 'images/scene.png']
)

console.log('loaded')

// Configura el canvas y los eventos
// setupEventHandlers(canvas);

// Aplicar efecto parallax y iniciar el juego
applyParallax(canvas, Sprite('scene'));

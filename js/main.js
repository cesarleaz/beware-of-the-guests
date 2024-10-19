import { buttons, setupEventHandlers } from "./eventHandlers.js";
import { renderGuests } from "./guest.js";
import { createParticles, renderParticles } from "./particles.js";
import { SPRITE, setupSprites } from "./spritesSetup";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let canvasWidth, canvasHeight;

// Ajustar el canvas a la resolución deseada
canvas.width = 800;
canvas.height = 600;

// Variables para el parallax
let mouseX = 0;
let mouseY = 0;

// Escalar la imagen en función de la variable 'scale'
const backgroundWidth = 1920;
const backgroundHeight = 1080;
const BACKGROUND_SCALE = 0.65;
const SCENE_SCALE = 0.65;

console.log("started");

// Cargar las imágenes
await setupSprites(
    ["background", "images/scene-background.jpg"],
    ["scene", "images/scene.png"],
    ["guest", "images/guest.png"]
);

console.log("loaded");

// Profundidad del parallax
const parallaxStrength = .15; // Controla la intensidad del desplazamiento

// Variables para el desplazamiento del fondo
let backgroundOffsetX = 0;
let backgroundOffsetY = 0;

// Capturar movimiento del mouse y actualizar las coordenadas
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left; // Calcula la posición del mouse relativa al canvas
    mouseY = event.clientY - rect.top;

    // Calcular el desplazamiento del fondo basado en la posición del mouse
    backgroundOffsetX =
        (mouseX / canvasWidth) * (backgroundWidth - canvasWidth) * parallaxStrength;
    backgroundOffsetY =
        (mouseY / canvasHeight) *
        (backgroundHeight - canvasHeight) *
        parallaxStrength;
});

class Background {
    constructor(image, scale = 1, isStatic = false) {
        this.image = image;
        this.width = backgroundWidth * scale;
        this.height = backgroundHeight * scale;
        this.isStatic = isStatic;

        if (isStatic) {
            this.x = 0
            this.y = 0
        } else {
            this.x = this.width / 2;
            this.y = this.height / 2;
        }
    }

    update() {
        if (this.isStatic) return;

        // Asegurarse de que el fondo no salga del canvas
        this.x = -backgroundOffsetX;
        this.y = -backgroundOffsetY;
        // Limitar el desplazamiento dentro del canvas
        if (this.x > 0) this.x = 0; // No permitir que el fondo se desplace hacia la derecha
        if (this.x < -this.width + canvasWidth) this.x = -this.width + canvasWidth; // No permitir que el fondo se desplace hacia la izquierda
        if (this.y > 0) this.y = 0; // No permitir que el fondo se desplace hacia abajo
        if (this.y < -this.height + canvasHeight)
            this.y = -this.height + canvasHeight; // No permitir que el fondo se desplace hacia arriba
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

const sceneBackground = new Background(
    SPRITE.BACKGROUND,
    BACKGROUND_SCALE,
    true // Establecer en estático
);
const scene = new Background(SPRITE.SCENE, SCENE_SCALE);

setupEventHandlers(canvas)

// Función de renderizado
function render() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Actualizar y dibujar las imágenes de fondo
    sceneBackground.update();
    sceneBackground.draw();

    renderGuests(canvas, ctx)

    // Actualizar y dibujar la imagen de escena
    scene.update();
    scene.draw();

    renderParticles(canvasWidth, canvasHeight, ctx, mouseX, mouseY, parallaxStrength)

    buttons.forEach((b) => {
        if (import.meta.env.DEV)
            b.draw(ctx);
        b.update(canvasWidth, canvasHeight, backgroundOffsetX, backgroundOffsetY)
    })

    // Repetir la animación en el siguiente frame
    requestAnimationFrame(render);
}

createParticles(canvas)

// Iniciar el render loop
render();

window.addEventListener("resize", windowResize);

function windowResize() {
    // Establecer la altura del canvas como el alto de la ventana
    canvasHeight = window.innerHeight;

    // Mantener la relación de aspecto 16:9
    canvasWidth = canvasHeight * (16 / 9);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Recalcular el tamaño de los fondos
    sceneBackground.width = backgroundWidth * BACKGROUND_SCALE;
    sceneBackground.height = backgroundHeight * BACKGROUND_SCALE;
    scene.width = backgroundWidth * SCENE_SCALE;
    scene.height = backgroundHeight * SCENE_SCALE;
}

windowResize();

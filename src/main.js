import { renderAgent } from "./agent.js";
import { CONFIG } from "./config.js";
import { buttons, setupEventHandlers } from "./eventHandlers.js";
import { renderGuests } from "./guest.js";
import { createParticles, renderParticles } from "./particles.js";
import { Phone } from "./phone.js";
import { setupSounds, sounds } from "./soundsSetup.js";
import { SPRITE, setupSprites } from "./spritesSetup.js";
import { $ } from "./utils.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajustar el canvas a la resolución deseada
canvas.width = 800;
canvas.height = 600;

// Variables para el parallax
let mouseX = 0;
let mouseY = 0;

// Escalar la imagen en función de la variable 'scale'
const BACKGROUND_WIDTH = 1920;
const BACKGROUND_HEIGHT = 1080;
const BACKGROUND_SCALE = 0.65;
const SCENE_SCALE = 0.6;

console.log("started");

// Cargar las imágenes
await setupSprites(
    ["logo", "images/logo.avif"],
    ["background", "images/scene-background.avif"],
    ["scene", "images/scene.avif"],
    ["guest", "images/guest.avif"],
    ["emergency", "images/emergency.avif"],
    ["blind", "images/blind.avif"],
    ["agent", "images/agent.avif"],
    ['phone', 'images/phone.avif'],
);

await setupSounds(
    ['sheet', 'sounds/sheet.mp3'],
    ['folder', 'sounds/folder.mp3'],
    ['open-button', 'sounds/open-button.mp3'],
    ['close-button', 'sounds/close-button.mp3'],
    ['alarm', 'sounds/alarm.mp3'],
    ['blind', 'sounds/blind.mp3'],
    ['door', 'sounds/door.mp3'],
    ['steps', 'sounds/steps.mp3'],
    ['dialog1', 'sounds/dialog1.mp3'],
    ['dialog2', 'sounds/dialog2.mp3'],
    ['dialog3', 'sounds/dialog3.mp3'],
    ['dialog4', 'sounds/dialog4.mp3'],
    ['dialog5', 'sounds/dialog5.mp3'],
    ['dialog6', 'sounds/dialog6.mp3'],
    ['dialog7', 'sounds/dialog7.mp3'],
    ['dialog8', 'sounds/dialog8.mp3'],
    ['dialog9', 'sounds/dialog9.mp3'],
    ['grab-the-phone', 'sounds/grab-the-phone.mp3'],
    ['number1', 'sounds/number1.mp3'],
    ['number2', 'sounds/number2.mp3'],
    ['number3', 'sounds/number3.mp3'],
    ['number4', 'sounds/number4.mp3'],
    ['number5', 'sounds/number5.mp3'],
    ['number6', 'sounds/number6.mp3'],
    ['number7', 'sounds/number7.mp3'],
    ['call', 'sounds/call.mp3'],
)

// Profundidad del parallax
const parallaxStrength = .35; // Controla la intensidad del desplazamiento

// Variables para el desplazamiento del fondo
let backgroundOffsetX = 180;
let backgroundOffsetY = 0;

// Capturar movimiento del mouse y actualizar las coordenadas
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    // Calcular el desplazamiento del fondo basado en la posición del mouse
    backgroundOffsetX =
        (mouseX / canvas.width) * (BACKGROUND_WIDTH - canvas.width) * parallaxStrength;
    backgroundOffsetY =
        (mouseY / canvas.height) *
        (BACKGROUND_HEIGHT - canvas.height) *
        parallaxStrength;
});

class Background {
    constructor(image, scale = 1, isStatic = false) {
        this.image = image;
        this.width = BACKGROUND_WIDTH * scale;
        this.height = BACKGROUND_HEIGHT * scale;
        this.isStatic = isStatic;
        this.x = 0
        this.y = 0
    }

    update() {
        if (this.isStatic) return;

        // Asegurarse de que el fondo no salga del canvas
        this.x = -backgroundOffsetX;
        this.y = -backgroundOffsetY;
        // Limitar el desplazamiento dentro del canvas
        if (this.x > 0) this.x = 0; // No permitir que el fondo se desplace hacia la derecha
        if (this.x < -this.width + canvas.width) this.x = -this.width + canvas.width; // No permitir que el fondo se desplace hacia la izquierda
        if (this.y > 0) this.y = 0; // No permitir que el fondo se desplace hacia abajo
        if (this.y < -this.height + canvas.height)
            this.y = -this.height + canvas.height; // No permitir que el fondo se desplace hacia arriba
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class DoorLamp {
    constructor() {
        this.x = this.getPositionXRelative();
        this.y = CONFIG.BUTTON_DOOR_Y;
        this.width = CONFIG.BUTTON_DOOR_WIDTH;
    }
    getPositionXRelative() {
        return CONFIG.CLOSED_DOOR ? CONFIG.CLOSE_DOOR_X : CONFIG.OPEN_DOOR_X
    }
    getGradient() {
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2,
            this.y + this.width / 2,
            0,
            this.x + this.width / 2,
            this.y + this.width / 2,
            this.width / 2
        );
        const isClosed = CONFIG.CLOSED_DOOR
        gradient.addColorStop(0, isClosed ? '#FF5722AA' : "#CDDC39AA");
        gradient.addColorStop(1, "transparent");
        return gradient;
    }
    update() {
        this.x = scene.x + this.getPositionXRelative();
        this.y = scene.y + CONFIG.BUTTON_DOOR_Y;
    }
    draw() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.width / 2;
        const radius = this.width / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.getGradient();
        ctx.fill();
        ctx.closePath();
    }
}

class EmergencyLamp {
    constructor() {
        this.positionX = 154;
        this.positionY = 314;
        this.x = this.positionX;
        this.y = this.positionY;
        this.width = 44;
        this.rotation = 0;
        this.speed = 4;

        this.maxOpacity = 1
        this.minOpacity = 0.25
        this.losing = true
        this.opacity = this.minOpacity
        this.speedOpacity = 0.02
    }

    getLinearGradient() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.width / 2;
        const radius = this.width / 2;

        // Cálculo de las coordenadas del gradiente
        const angleRad = (this.rotation * Math.PI) / 180;
        const startX = centerX + Math.cos(angleRad) * radius;
        const startY = centerY + Math.sin(angleRad) * radius;
        const endX = centerX - Math.cos(angleRad) * radius;
        const endY = centerY - Math.sin(angleRad) * radius;

        // Crear el gradiente lineal
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);

        // Colores del gradiente
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, "#CDDC3944");
        gradient.addColorStop(1, "transparent");

        return gradient;
    }

    update() {
        this.x = scene.x + this.positionX;
        this.y = scene.y + this.positionY;

        // Incrementar la rotación para animar
        this.rotation = (this.rotation + this.speed) % 360; // Rota continuamente de 0 a 360

        // Incrementar o disminuir la opacidad del negro
        if (this.losing) {
            this.opacity += this.speedOpacity; // Incrementa la opacidad del negro
        } else {
            this.opacity -= this.speedOpacity; // Disminuye la opacidad del negro
        }

        // Cambia la dirección de la opacidad al alcanzar los límites
        if (this.opacity > this.maxOpacity) {
            this.losing = false; // Deja de aumentar la opacidad
        } else if (this.opacity < this.minOpacity) {
            this.losing = true; // Vuelve a aumentar la opacidad
        }
    }

    draw() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.width / 2;
        const radius = this.width / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.getLinearGradient();
        ctx.fill();
        ctx.closePath();

        ctx.globalAlpha = this.opacity;
        ctx.drawImage(SPRITE.EMERGENCY, scene.x, scene.y, scene.width, scene.height)
        ctx.globalAlpha = 1.0;
    }
}

class Blind {
    constructor() {
        this.positionX = 300;
        this.positionY = 0;
        this.currentPositionY = 0
        this.width = 550
        this.height = 550
        this.closedY = 0
        this.openY = -this.height
        this.y = this.closedY
        this.x = canvas.width / 4.80
        this.speed = 10

        // Logo
        this.hiddenLogo = false
    }
    update() {
        this.x = scene.x + this.positionX
        this.y = (scene.y + this.positionY) + this.currentPositionY

        if (!CONFIG.EMERGENCY && CONFIG.PLAYING && this.y >= this.openY) {
            this.currentPositionY -= this.speed
        } else if (this.y < this.closedY) {
            this.currentPositionY += this.speed
        }

        if (CONFIG.PLAYING && this.y < this.openY) {
            this.hiddenLogo = true
        }
        else if (!CONFIG.PLAYING && this.y < this.closedY) {
            this.hiddenLogo = false
        }
    }
    draw() {
        ctx.drawImage(SPRITE.BLIND, this.x, this.y, this.width, this.height)

        if (!CONFIG.PLAYING || !this.hiddenLogo) {
            const scale = 50
            ctx.drawImage(SPRITE.LOGO, this.x + (scale / 2), this.y + (scale / 2), this.width - scale, this.height - scale)
        }
    }
}

const blind = new Blind()
const doorLamp = new DoorLamp()
const emergencyLamp = new EmergencyLamp()
const sceneBackground = new Background(
    SPRITE.BACKGROUND,
    BACKGROUND_SCALE,
    true // Establecer en estático
);
const scene = new Background(SPRITE.SCENE, SCENE_SCALE);
const phone = new Phone(SCENE_SCALE, scene)

setupEventHandlers(canvas)

// Función de renderizado
function render() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar las imágenes de fondo
    sceneBackground.update();
    sceneBackground.draw();

    renderAgent(ctx, scene)
    renderGuests(ctx, scene)

    // Actualizar y dibujar la imagen de escena
    blind.draw()
    blind.update()

    scene.update();
    scene.draw();

    if (CONFIG.PLAYING) {
        doorLamp.draw()
        doorLamp.update()
    }

    if (CONFIG.EMERGENCY) {
        emergencyLamp.draw()
        emergencyLamp.update()
    }

    phone.update(scene)
    phone.draw(ctx)

    renderParticles(canvas.width, canvas.height, ctx, mouseX, mouseY, parallaxStrength)

    if (CONFIG.PLAYING) {
        buttons.forEach((b) => {
            if (import.meta.env.DEV)
                b.draw(ctx);
            b.update(scene)
        })
    }

    // Repetir la animación en el siguiente frame
    requestAnimationFrame(render);
}

createParticles(canvas)

// Iniciar el render loop
render();

$('.loading').remove()

import { CONFIG } from './config';
import { sounds } from './soundsSetup';
import { $, $$ } from './utils'

class Clickable {
    constructor(label, x, y, width, height, shape = "rect", onClick) {
        this.label = label;
        this.originalPositionX = x;
        this.originalPositionY = y;
        this.x = this.originalPositionX;
        this.y = this.originalPositionY;
        this.width = width;
        this.height = height;
        this.shape = shape;
        this.onClick = onClick
    }

    // Detectar clics en el área de la forma (dependiendo del tipo de forma)
    isClicked(mouseX, mouseY) {
        if (this.shape === "rect") {
            return (
                mouseX >= this.x &&
                mouseX <= this.x + this.width &&
                mouseY >= this.y &&
                mouseY <= this.y + this.height
            );
        } else if (this.shape === "circle") {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = this.width / 2;
            const distance = Math.sqrt(
                (mouseX - centerX) ** 2 + (mouseY - centerY) ** 2
            );
            return distance <= radius;
        }
        return false;
    }

    // Actualiza la posición del botón en función del desplazamiento del fondo y limita dentro del background
    update(scene) {
        this.x = scene.x + this.originalPositionX;
        this.y = scene.y + this.originalPositionY;
    }

    // Dibuja el botón dependiendo de su forma
    draw(ctx) {
        if (this.shape === "rect") {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fill();
            ctx.closePath();
        } else if (this.shape === "circle") {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = this.width / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fill();
            ctx.closePath();
        }

        // Dibujar la etiqueta en el centro del botón
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }
}


export const buttons = [
    new Clickable("Emergency", 185, 395, 60, 60, "circle", handleEmergency),
    new Clickable("Guest List", 225, 260, 85, 125, "rect", eventWithSound('sheet', handleListGuest)),
    new Clickable("folder1", 928, 54, 140, 124, "rect", handleOpenFolder("folder1")),
    new Clickable("folder2", 928, 180, 140, 124, "rect", handleOpenFolder("folder2")),
    new Clickable("folder3", 928, 305, 140, 124, "rect", handleOpenFolder("folder3")),
    new Clickable("Open Door", CONFIG.OPEN_DOOR_X, CONFIG.BUTTON_DOOR_Y, CONFIG.BUTTON_DOOR_WIDTH, CONFIG.BUTTON_DOOR_WIDTH, "circle", handleOpenDoor(true)),
    new Clickable("Close Door", CONFIG.CLOSE_DOOR_X, CONFIG.BUTTON_DOOR_Y, CONFIG.BUTTON_DOOR_WIDTH, CONFIG.BUTTON_DOOR_WIDTH, "circle", handleOpenDoor(false)),
    new Clickable("Checklist", 642, 500, 126, 142),
];

// Configurar los manejadores de eventos para los clics
export function setupEventHandlers(canvas) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        buttons.forEach((button) => {
            if (button.isClicked(x, y)) {
                if (import.meta.env.DEV) console.info(`Clicked on ${button.label}`);
                button.onClick?.()
            }
        });
    });

    $$('.btn-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const button = buttons.find(b => b.label === event.target.dataset.eventLabel)
            button?.onClick?.()
        })
    })
}

const $backdrop = $('#backdrop')

function backdrop(visibility) {
    $backdrop.style.visibility = visibility ? 'hidden' : 'visible'
}

// Elements
const $listGuest = $('#guest-list')
function handleListGuest() {
    const isHidden = $listGuest.style.visibility !== 'visible'
    backdrop(!isHidden)
    $listGuest.style.visibility = isHidden ? 'visible' : 'hidden'
}

// Folder
const $folder = $('#folder')
const $closeFolder = $('#close-folder')
function handleFolder(folderId) {
    const isHidden = $folder.style.visibility !== 'visible'
    backdrop(!isHidden)
    $closeFolder.dataset.eventLabel = folderId
    $folder.style.visibility = isHidden ? 'visible' : 'hidden'
}
function handleOpenFolder(folderId) {
    return eventWithSound('folder', () => handleFolder(folderId))
}

// Buttons
function handleOpenDoor(state) {
    return () => {
        if (CONFIG.CLOSED_DOOR === state) return;
        eventWithSound(state ? 'open-button' : 'close-button', () => {
            CONFIG.CLOSED_DOOR = state
        })()
    }
}

function handleEmergency() {
    if (CONFIG.EMERGENCY) return;
    const alarm = sounds.get('alarm')
    const blind = sounds.get('blind')
    blind.play()
    alarm.loop = true
    alarm.play()
    CONFIG.EMERGENCY = true
}

// Utils
function eventWithSound(soundId, listener) {
    return () => {
        const audio = sounds.get(soundId)
        audio.pause()
        audio.currentTime = 0
        audio.play()
        listener?.()
    }
}

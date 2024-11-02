import { CONFIG } from "./config";
import { sounds } from "./soundsSetup";
import { SPRITE } from "./spritesSetup";
import { showDialog } from "./utils";

let currentAgent = null;

const scale = 0.6;

class Agent {
    static Types = {
        Initial: -1,
        Continue: 0
    }
    
    constructor(scene) {
        this.width = 800 * scale;
        this.height = 600 * scale;
        this.currentPositionX = scene.x + (scene.width / 2) - (this.width / 8);
        this.currentPositionY = (scene.y + scene.height / 2) - (this.width / 2)

        this.x = 0;
        this.y = 0;
        this.initialY = this.currentPositionY;

        this.speed = 2;

        // Estado del personaje
        this.hasReachedMiddle = false;
        this.hasSpoken = false;

        // Variables para el efecto de pasos
        this.stepAmplitude = 5;
        this.stepSpeed = 0.1;
        this.stepOffset = 0;
        this.walking = false

        // Variables para el efecto de respiración
        this.scaleFactor = 1; // Factor inicial de escala
        this.breathingSpeed = 0.02; // Velocidad de respiración (ajustable)
        this.breathingAmplitude = 0.03; // Amplitud del efecto de respiración (ajustable)
        this.breathingOffset = 0; // Desfase en la animación

        // Others
        this.dialog = true
        this.type = CONFIG.IS_INITIAL
            ? Agent.Types.Initial
            : Agent.Types.Continue
    }

    update(scene) {
        this.x = scene.x + this.currentPositionX
        this.y = scene.y + this.currentPositionY

        // Movimiento del personaje
        if (this.walking) {
            this.currentPositionX -= this.speed;
            // Efecto de pasos (movimiento vertical)
            this.stepOffset += this.stepSpeed;
            this.currentPositionY = this.initialY + Math.sin(this.stepOffset) * this.stepAmplitude;

            // LLega al final
            if (this.currentPositionX < scene.x && !CONFIG.CONTINUE_WORKING) {
                CONFIG.CONTINUE_WORKING = true
            }
        } else {
            // Efecto de respiración (escala de tamaño) 
            this.breathingOffset += this.breathingSpeed;
            this.scaleFactor = 1 + Math.sin(this.breathingOffset) * this.breathingAmplitude;
        }

        if (this.dialog) {
            this.dialog = false
            this.speech()
        }
    }

    async speech() {
        if (this.type === Agent.Types.Continue) {
            await showDialog([
                'Cleaning protocol executed correctly',
                'You can now continue with your work'
            ])
        } else if (this.type === Agent.Types.Initial) {
            await showDialog([
                'Good night. Everything is in order',
                'You can start working'
            ])
        }
        this.walking = true
        const sound = sounds.get('steps')
        sound.play()
    }

    draw(ctx) {
        const scaledWidth = this.width * this.scaleFactor;
        const scaledHeight = this.height * this.scaleFactor;
        const positionX = this.x - (scaledWidth - this.width) / 2
        const positionY = this.y - (scaledHeight - this.height) / 2
        ctx.drawImage(SPRITE.AGENT, positionX, positionY, scaledWidth, scaledHeight);
    }
}

export function renderAgent(ctx, scene) {
    if ((CONFIG.PLAYING && CONFIG.IS_INITIAL && currentAgent === null) || CONFIG.SPAWN_AGENT) {
        currentAgent = new Agent(scene);
        CONFIG.IS_INITIAL = false
        CONFIG.SPAWN_AGENT = false
    }

    if (currentAgent) {
        currentAgent.draw(ctx);
        currentAgent.update(scene);
    }
}

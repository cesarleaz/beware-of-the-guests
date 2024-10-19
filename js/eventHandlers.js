class Clickable {
    constructor(label, x, y, width, height, shape = "rect") {
        this.label = label;
        this.originalPositionX = x;
        this.originalPositionY = y;
        this.x = this.originalPositionX;
        this.y = this.originalPositionY;
        this.width = width;
        this.height = height;
        this.shape = shape;
    }

    // Detectar clics en el área de la forma (dependiendo del tipo de forma)
    isClicked(mouseX, mouseY) {
        if (this.shape === "rect") {
            // Detección de clic estándar para rectángulos
            return (
                mouseX >= this.x &&
                mouseX <= this.x + this.width &&
                mouseY >= this.y &&
                mouseY <= this.y + this.height
            );
        } else if (this.shape === "circle") {
            // Detección de clic para un círculo
            const centerX = this.x + this.width / 2; // X del centro del círculo
            const centerY = this.y + this.height / 2; // Y del centro del círculo
            const radius = this.width / 2; // Asumimos que el círculo tiene width = height
            const distance = Math.sqrt(
                (mouseX - centerX) ** 2 + (mouseY - centerY) ** 2
            );
            return distance <= radius; // Está dentro del círculo si la distancia al centro es menor o igual al radio
        } 
        return false;
    }

    // Actualiza la posición del botón en función del desplazamiento del fondo
    update(canvasWidth, canvasHeight, backgroundOffsetX, backgroundOffsetY) {
        this.x = this.originalPositionX - backgroundOffsetX;
        this.y = this.originalPositionY - backgroundOffsetY;
    }

    // Dibuja el botón dependiendo de su forma
    draw(ctx) {
        if (this.shape === "rect") {
            // Dibujar rectángulo
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fill();
            ctx.closePath();
        } else if (this.shape === "circle") {
            // Dibujar un círculo
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
    new Clickable("Emergency", 205, 430, 60, 60, "circle"),
    new Clickable("Guest List", 240, 280, 100, 135),
    new Clickable("1ST Folder", 1005, 58, 154, 135),
    new Clickable("2ND Folder", 1005, 194, 154, 135),
    new Clickable("3RD Folder", 1005, 330, 154, 135),
    new Clickable("Open Door", 880, 506, 67, 67, "circle"),
    new Clickable("Close Door", 963, 506, 67, 67, "circle"),
    new Clickable("Checklist", 695, 540, 142, 152),
];

// Configurar los manejadores de eventos para los clics
export function setupEventHandlers(canvas) {
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        buttons.forEach((button) => {
            if (button.isClicked(x, y)) {
                console.log(`Clicked on ${button.label}`);
            }
        });
    });
}

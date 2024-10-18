export function setupEventHandlers(canvas) {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Convertir posiciones relativas de la imagen a las áreas clickeables
        const buttons = getButtonAreas(canvas.width, canvas.height);

        buttons.forEach(button => {
            if (x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height) {
                alert(`Has hecho clic en el botón: ${button.label}`);
            }
        });
    });
}

function getButtonAreas(width, height) {
    // Aquí se definen las posiciones de los botones en la imagen original.
    // Las dimensiones se ajustan proporcionalmente al tamaño actual del canvas.
    return [
        {
            label: "Emergencia",
            x: width * 0.05,
            y: height * 0.85,
            width: width * 0.1,
            height: height * 0.1
        },
        {
            label: "Abrir Puerta",
            x: width * 0.75,
            y: height * 0.85,
            width: width * 0.1,
            height: height * 0.1
        },
        {
            label: "Cerrar Puerta",
            x: width * 0.85,
            y: height * 0.85,
            width: width * 0.1,
            height: height * 0.1
        }
    ];
}

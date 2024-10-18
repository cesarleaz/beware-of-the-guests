const scale = 1.1

export function applyParallax(canvas, backgroundTexture) {
    const ctx = canvas.getContext('2d');

    // Establecer la altura del canvas como el alto de la ventana
    const canvasHeight = window.innerHeight;

    // Mantener la relación de aspecto 16:9
    const canvasWidth = canvasHeight * (16 / 9);

    // Ajustar el canvas a la resolución deseada
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Relación de aspecto y ajuste de tamaño de la textura
    const textureAspectRatio = backgroundTexture.width / backgroundTexture.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;

    // Escalar la imagen en función de la variable 'scale'
    let backgroundWidth, backgroundHeight;

    if (textureAspectRatio > canvasAspectRatio) {
        // Si la textura es más ancha en comparación con el canvas, ajusta el ancho
        backgroundWidth = canvasWidth * scale;
        backgroundHeight = (canvasWidth / textureAspectRatio) * scale;
    } else {
        // Si la textura es más alta en comparación con el canvas, ajusta la altura
        backgroundHeight = canvasHeight * scale;
        backgroundWidth = (canvasHeight * textureAspectRatio) * scale;
    }

    // Variables para el parallax
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    // Profundidad del parallax
    const parallaxStrength = 1; // Controla la intensidad del desplazamiento

    // Variables para el desplazamiento del fondo
    let backgroundOffsetX = 0;
    let backgroundOffsetY = 0;

    // Capturar movimiento del mouse y actualizar las coordenadas
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left; // Calcula la posición del mouse relativa al canvas
        mouseY = event.clientY - rect.top;

        // Calcular el desplazamiento del fondo basado en la posición del mouse
        backgroundOffsetX = (mouseX / canvasWidth) * (backgroundWidth - canvasWidth) * parallaxStrength;
        backgroundOffsetY = (mouseY / canvasHeight) * (backgroundHeight - canvasHeight) * parallaxStrength;
    });

    // Función de renderizado
    function render() {
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Asegurarse de que el fondo no salga del canvas
        let drawX = -backgroundOffsetX;
        let drawY = -backgroundOffsetY;

        // Ajustar límites para que el fondo no se corte
        if (drawX > 0) drawX = 0; // No permitir que el fondo se desplace hacia la derecha
        if (drawX < -backgroundWidth + canvasWidth) drawX = -backgroundWidth + canvasWidth; // No permitir que el fondo se desplace hacia la izquierda

        if (drawY > 0) drawY = 0; // No permitir que el fondo se desplace hacia abajo
        if (drawY < -backgroundHeight + canvasHeight) drawY = -backgroundHeight + canvasHeight; // No permitir que el fondo se desplace hacia arriba

        // Dibujar la imagen de fondo con el efecto parallax
        ctx.drawImage(
            backgroundTexture,
            drawX,  // Ajustar para centrar el efecto
            drawY,  // Ajustar para centrar el efecto
            backgroundWidth,  // Ajustar el tamaño del dibujo según la escala
            backgroundHeight
        );

        // Repetir la animación en el siguiente frame
        requestAnimationFrame(render);
    }

    // Iniciar el render loop
    render();
}

window.addEventListener('resize', () => {
    const canvasHeight = window.innerHeight;
    const canvasWidth = canvasHeight * (16 / 9);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
});

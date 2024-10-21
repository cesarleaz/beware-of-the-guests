export const SPRITE = {}

export async function setupSprites(...sprites) {
    const loadSprites = sprites.map(sprite => {
        const [name, url] = sprite
        const image = new Image();
        image.src = url;
        return new Promise((resolve, reject) => {
            image.onload = () => {
                console.log('loaded')
                const slug = name.toUpperCase()
                SPRITE[slug] = image
                resolve()
            };
            image.onerror = () => {
                reject(new Error(`Error al cargar la imagen: ${url}`));
            };
        });
    });

    await Promise.all(loadSprites)
}

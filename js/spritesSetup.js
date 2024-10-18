const loadedSprites = new Map()

export const Sprite = (id) => loadedSprites.get(id)

export async function setupSprites(...sprites) {
    const loadSprites = sprites.map(sprite => {
        const [name, url] = sprite
        const image = new Image();
        image.src = url;
        console.log({ name, url })
        return new Promise((resolve, reject) => {
            image.onload = () => {
                console.log('loaded')
                loadedSprites.set(name, image)
                resolve()
            };
            image.onerror = () => {
                reject(new Error(`Error al cargar la imagen: ${url}`));
            };
        });
    });

    await Promise.all(loadSprites)

    return Sprite
}

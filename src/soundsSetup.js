export const sounds = new Map()

export async function setupSounds(...audios) {
    const loadSounds = audios.map(sound => {
        const [name, url] = sound
        const audio = new Audio(url);
        return new Promise((res, rej) => {
            audio.oncanplaythrough = () => {
                sounds.set(name, audio)
                res()
            };
            audio.onerror = () => {
                rej(new Error(`Failed load sound: ${url}`));
            };
        });
    });

    await Promise.all(loadSounds)
}

export const sounds = new Map()

export function setupSounds(...audios) {
    audios.forEach(audio => {
        const [name, url] = audio
        const sound = new Audio(url);
        sounds.set(name, sound)
    });
}

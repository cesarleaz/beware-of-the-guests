import { QUANTITY_DIALOG_EFFECT_SOUNDS } from "./config"
import { sounds } from "./soundsSetup"

export const $ = (selector) => document.querySelector(selector)

export const $$ = (selector) => document.querySelectorAll(selector)

const $dialog = $('#dialog')
let linesOfDialog = []
let dialogPage = 0
let handleCompleted = null
let disabledSounds = false
let lastEffectId

export function showDialog(lines, enabledSoundEffect = true) {
    dialogPage = 0
    linesOfDialog = lines
    $dialog.textContent = lines[0] + (lines.length > 1 ? '...' : '')
    disabledSounds = !enabledSoundEffect
    if (enabledSoundEffect)
        dialogEffectSound()

    return new Promise((res) => {
        handleCompleted = res
    })
}

$dialog.addEventListener('click', () => {
    if (dialogPage === linesOfDialog.length - 1) {
        stopDialogEffectSound()
        $dialog.textContent = ''
        handleCompleted?.()
    } else {
        dialogPage++
        if (!disabledSounds)
            dialogEffectSound()
        $dialog.innerText = linesOfDialog[dialogPage] + (linesOfDialog.length > dialogPage + 1 ? '...' : '')
    }
})

function stopDialogEffectSound() {
    if (lastEffectId) {
        const effect = sounds.get(`dialog${lastEffectId}`)
        effect.pause()
        sounds.currentTime = 0
    }
}

function dialogEffectSound() {
    const effectId = Math.round(Math.random() * QUANTITY_DIALOG_EFFECT_SOUNDS) + 1
    const effect = sounds.get(`dialog${effectId}`)
    stopDialogEffectSound()
    effect.play()
    lastEffectId = effectId
}

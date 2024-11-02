import { CONFIG, SPAW_AGENT_TIMELAPSE } from "./config";
import { sounds } from "./soundsSetup";
import { SPRITE } from "./spritesSetup";
import { $, showDialog } from './utils'

const ORIGINAL_WIDTH = 654
const ORIGINAL_HEIGHT = 318

export class Phone {
    static NotUsePhone = ORIGINAL_WIDTH / 2
    static UsingPhone = 0
    constructor(scale = 1, scene) {
        this.width = (ORIGINAL_WIDTH / 2) * scale;
        this.height = ORIGINAL_HEIGHT * scale;
        this.positionX = 210
        this.positionY = (scene.y + scene.height + scale + 2) - (this.height)
        this.x = 0
        this.y = 0
    }
    update(scene) {
        this.x = scene.x + this.positionX
        this.y = scene.y + this.positionY
    }
    draw(ctx) {
        let spriteX

        if (CONFIG.USING_PHONE)
            spriteX = Phone.UsingPhone
        else spriteX = Phone.NotUsePhone

        ctx.drawImage(
            SPRITE.PHONE,
            spriteX,
            0,
            ORIGINAL_WIDTH / 2,
            ORIGINAL_HEIGHT,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

const $phone = $('#phone')
let numberToCall = ''

$phone.addEventListener('click', e => {
    const number = e.target.dataset.number
    const effect = sounds.get('grab-the-phone')

    if (effect.played) {
        effect.pause()
        effect.currentTime = 0
    }

    if (number) {
        const numberId = number > 7 ? (Math.round(Math.random() * 7) + 1) : number
        const numberSound = sounds.get(`number${numberId}`)
        numberSound.play()
        numberToCall += number
        return;
    }

    const callSound = sounds.get('call')

    if (e.target.id === 'phone-confirm' && callSound.played) {
        callSound.onended = handleCall
        callSound.play()
    } else if (e.target.id === 'phone-back') {
        numberToCall = ''
    }
})


async function handleCall() {
    console.log(numberToCall)
    if (numberToCall === '3312' && !CONFIG.EMERGENCY) {
        showDialog([
            'You have just contacted the Unit Extermination of Substitute',
            'We have not received any alarm',
            'This number is not for jokes'
        ])
        return;
    }

    if (numberToCall === '3312' && CONFIG.EMERGENCY) {
        await showDialog([
            'You have just contacted the Unit Extermination of Substitute',
            'We have received your alert. We will send an agent',
            'Please wait while the cleaning protocol is carried out'
        ])
        setTimeout(() => {
            const alarm = sounds.get('alarm')
            alarm.loop = false
            alarm.currentTime = 0
            CONFIG.SPAWN_AGENT = true
            CONFIG.EMERGENCY = false
        }, SPAW_AGENT_TIMELAPSE * 1000)
    }

    numberToCall = ''
}

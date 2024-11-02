const DEFAULT_CONFIG = {
    EMERGENCY: false,
    CLOSED_DOOR: true,
    PLAYING: false,
    CONTINUE_WORKING: false,
    BUTTON_DOOR_WIDTH: 60,
    BUTTON_DOOR_Y: 470,
    OPEN_DOOR_X: 810,
    CLOSE_DOOR_X: 890,
    IS_INITIAL: true,
    SPAWN_AGENT: false,
    USING_PHONE: false
}

export const CONFIG = structuredClone(DEFAULT_CONFIG)

export const QUANTITY_DIALOG_EFFECT_SOUNDS = 9
export const SPAW_AGENT_TIMELAPSE = 5 // In segs
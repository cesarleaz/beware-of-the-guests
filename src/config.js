const DEFAULT_CONFIG = {
    EMERGENCY: false,
    CLOSED_DOOR: true,
    PLAYING: true,
    CONTINUE_WORKING: true,
    BUTTON_DOOR_WIDTH: 60,
    BUTTON_DOOR_Y: 470,
    OPEN_DOOR_X: 810,
    CLOSE_DOOR_X: 890
}

export const CONFIG = structuredClone(DEFAULT_CONFIG)

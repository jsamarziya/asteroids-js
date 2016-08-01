"use strict";

class InputManager {
    constructor() {
        this.keyMap = {};
    }

    addEventListeners(window, document){
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
        window.addEventListener('blur', this.clearKeysDown.bind(this));
    }

    keyDown(event) {
        Object.values(this.keyMap).forEach(key => {
            key.matches(event) && key.fireKeyDown();
        });
        InputManager.preventDefaultEventActionIfRequired(event);
    }

    keyUp(event) {
        Object.values(this.keyMap).forEach(key => {
            key.matches(event) && key.fireKeyUp();
        });
        InputManager.preventDefaultEventActionIfRequired(event);
    }

    clearKeysDown() {
        Object.values(this.keyMap).forEach(key => {
            key.fireKeyUp();
        });
    }

    static preventDefaultEventActionIfRequired(event) {
        if (InputManager.shouldPreventDefaultEventAction(event)) {
            event.preventDefault();
        }
    }

    static shouldPreventDefaultEventAction(event) {
        return event.key.startsWith("Arrow") || event.key == " ";
    }
}

"use strict";

class Key {
    constructor(key, alt, ctrl, meta, shift) {
        this.key = key;
        this.alt = !!alt;
        this.ctrl = !!ctrl;
        this.meta = !!meta;
        this.shift = !!shift;
        this.keyDownListeners = [];
        this.keyUpListeners = [];
        this.isKeyDown = false;
        this.autoRepeatEnabled = false;
    }

    addKeyDownListener(listener) {
        this.keyDownListeners.push(listener);
    }

    addKeyUpListener(listener) {
        this.keyUpListeners.push(listener);
    }

    matches(event) {
        return this.key == event.key
            && this.alt == event.altKey
            && this.ctrl == event.ctrlKey
            && this.meta == event.metaKey
            && this.shift == event.shiftKey;
    }

    fireKeyDown() {
        if (this.autoRepeatEnabled || !this.isKeyDown) {
            this.isKeyDown = true;
            this.keyDownListeners.forEach(listener => {
                listener();
            });
        }
    }

    fireKeyUp() {
        this.isKeyDown = false;
        this.keyUpListeners.forEach(listener => {
            listener();
        });
    }
}
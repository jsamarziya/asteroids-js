"use strict";

/**
 * The model of a specific key which can be typed on a keyboard.
 */
class Key {
    /**
     * Constructs a new Key.
     * @param {string} key the key character
     * @param {boolean} [alt=false] the Alt key state
     * @param {boolean} [ctrl=false] the Ctrl key state
     * @param {boolean} [meta=false] the Meta key state
     * @param {boolean} [shift=false] the Shift key state
     */
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

    /**
     * Adds a callback function to the list of callbacks invoked when a keyDown event occurs.
     * @param {function} listener the callback
     */
    addKeyDownListener(listener) {
        this.keyDownListeners.push(listener);
    }

    /**
     * Adds a callback function to the list of callbacks invoked when a keyUp event occurs.
     * @param {function} listener the callback
     */
    addKeyUpListener(listener) {
        this.keyUpListeners.push(listener);
    }

    /**
     * Returns true if the specified keyboard event matches this key.
     * @param {KeyboardEvent} event the event
     * @returns {boolean} true if the event matches this key, false otherwise
     */
    matches(event) {
        return this.key == event.key
            && this.alt == event.altKey
            && this.ctrl == event.ctrlKey
            && this.meta == event.metaKey
            && this.shift == event.shiftKey;
    }

    /**
     * Calls all of the registered keyDown listener callback functions.
     */
    fireKeyDown() {
        if (this.autoRepeatEnabled || !this.isKeyDown) {
            this.isKeyDown = true;
            this.keyDownListeners.forEach(listener => {
                listener();
            });
        }
    }

    /**
     * Calls all of the registered keyUp listener callback functions.
     */
    fireKeyUp() {
        this.isKeyDown = false;
        this.keyUpListeners.forEach(listener => {
            listener();
        });
    }
}
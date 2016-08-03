"use strict";

/**
 * Manages handling of keyboard events.
 */
class InputManager {
    /**
     * Constructs a new InputManager.
     */
    constructor() {
        this.keyMap = {};
    }

    /**
     * Adds event listeners to allow this input manager to handle events.
     * @param {Window} window the window to add event listeners to
     * @param {Document} document the document to add event listeners to
     */
    addEventListeners(window, document){
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
        window.addEventListener('blur', this.clearKeysDown.bind(this));
    }

    /**
     * The callback function used to handle keyDown events.
     * @param {KeyboardEvent} event the event
     */
    keyDown(event) {
        Object.values(this.keyMap).forEach(key => {
            key.matches(event) && key.fireKeyDown();
        });
        InputManager.preventDefaultEventActionIfRequired(event);
    }

    /**
     * The callback function used to handle keyUp events.
     * @param {KeyboardEvent} event the event
     */
    keyUp(event) {
        Object.values(this.keyMap).forEach(key => {
            key.matches(event) && key.fireKeyUp();
        });
        InputManager.preventDefaultEventActionIfRequired(event);
    }

    /**
     * Fires a keyUp for all registered keys.
     */
    clearKeysDown() {
        Object.values(this.keyMap).forEach(key => {
            key.fireKeyUp();
        });
    }

    /**
     * Prevents the default action of a keyboard event from occurring, if required.
     * @param {KeyboardEvent} event the event
     */
    static preventDefaultEventActionIfRequired(event) {
        if (InputManager.shouldPreventDefaultEventAction(event)) {
            event.preventDefault();
        }
    }

    /**
     * Returns true if the default action of the specified keyboard event should be prevented.
     * @param {KeyboardEvent} event the event
     * @returns {boolean} true if the default action should be prevented, false otherwise
     */
    static shouldPreventDefaultEventAction(event) {
        return event.key.startsWith("Arrow") || event.key == " ";
    }
}

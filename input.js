function InputManager(window) {
    this.keysDown = {};

    window.document.addEventListener('keydown', this.keyDown.bind(this));

    window.document.addEventListener('keyup', this.keyUp.bind(this));

    window.addEventListener('blur', this.clearKeysDown.bind(this));
}

InputManager.prototype.clearKeysDown = function () {
    this.keysDown = {};
};

InputManager.prototype.keyDown = function (event) {
    this.keysDown[event.key] = true;
    this.preventDefaultEventActionIfRequired(event);
};

InputManager.prototype.keyUp = function (event) {
    delete this.keysDown[event.key];
    this.preventDefaultEventActionIfRequired(event);
};

InputManager.prototype.preventDefaultEventActionIfRequired = function (event) {
    if (this.shouldPreventDefaultEventAction(event)) {
        event.preventDefault();
    }
};

InputManager.prototype.shouldPreventDefaultEventAction = function (event) {
    return event instanceof KeyboardEvent && event.key.startsWith("Arrow");
};

InputManager.prototype.isKeyDown = function (key) {
    return key in this.keysDown;
};

InputManager.prototype.getKeysDown = function () {
    return Object.keys(this.keysDown).reduce((p, c) => {
        return p + c;
    }, "");
};

function InputManager() {
    this.keyMap = {};
    document.addEventListener('keydown', this.keyDown.bind(this));
    document.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('blur', this.clearKeysDown.bind(this));
}

InputManager.prototype.keyDown = function (event) {
    Object.values(this.keyMap).forEach(key => {
        key.matches(event) && key.fireKeyDown();
    });
    this.preventDefaultEventActionIfRequired(event);
};

InputManager.prototype.keyUp = function (event) {
    Object.values(this.keyMap).forEach(key => {
        key.matches(event) && key.fireKeyUp();
    });
    this.preventDefaultEventActionIfRequired(event);
};

InputManager.prototype.clearKeysDown = function () {
    Object.values(this.keyMap).forEach(key => {
        key.fireKeyUp();
    });
};

InputManager.prototype.preventDefaultEventActionIfRequired = function (event) {
    if (this.shouldPreventDefaultEventAction(event)) {
        event.preventDefault();
    }
};

InputManager.prototype.shouldPreventDefaultEventAction = function (event) {
    return event.key.startsWith("Arrow");
};

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
    event.preventDefault();
};

InputManager.prototype.keyUp = function (event) {
    delete this.keysDown[event.key];
    event.preventDefault();
};

InputManager.prototype.isKeyDown = function (key) {
    return key in this.keysDown;
};

InputManager.prototype.getKeysDown = function () {
    return Object.keys(this.keysDown).reduce((p, c) => {
        return p + c;
    }, "");
};

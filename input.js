function InputManager() {
    this.keyMap = this.createKeyMap();
    document.addEventListener('keydown', this.keyDown.bind(this));
    document.addEventListener('keyup', this.keyUp.bind(this));
    window.addEventListener('blur', this.clearKeysDown.bind(this));
}

InputManager.prototype.createKeyMap = function () {
    return {
        fullScreen: this.createRequestFullScreenModeKey()
    };
};

InputManager.prototype.createRequestFullScreenModeKey = function () {
    const key = new Key("f");
    key.addKeyDownListener(function () {
        asteroids.requestFullScreen();
    });
    return key;
};

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

function Key(key, alt, ctrl, meta, shift) {
    this.key = key;
    this.alt = !!alt;
    this.ctrl = !!ctrl;
    this.meta = !!meta;
    this.shift = !!shift;
    this.keyDownListeners = [];
    this.keyUpListeners = [];
}

Key.prototype.addKeyDownListener = function (listener) {
    this.keyDownListeners.push(listener);
};

Key.prototype.addKeyUpListener = function (listener) {
    this.keyUpListeners.push(listener);
};

Key.prototype.matches = function (event) {
    return this.key == event.key
        && this.alt == event.altKey
        && this.ctrl == event.ctrlKey
        && this.meta == event.metaKey
        && this.shift == event.shiftKey;
};

Key.prototype.fireKeyDown = function () {
    this.keyDownListeners.forEach(listener => {
        listener();
    });
};

Key.prototype.fireKeyUp = function () {
    this.keyUpListeners.forEach(listener => {
        listener();
    });
};
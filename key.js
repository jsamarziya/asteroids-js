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

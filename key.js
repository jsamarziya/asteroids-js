class Key {
    constructor(key, alt, ctrl, meta, shift) {
        this.key = key;
        this.alt = !!alt;
        this.ctrl = !!ctrl;
        this.meta = !!meta;
        this.shift = !!shift;
        this.keyDownListeners = [];
        this.keyUpListeners = [];
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
        this.keyDownListeners.forEach(listener => {
            listener();
        });
    }

    fireKeyUp() {
        this.keyUpListeners.forEach(listener => {
            listener();
        });
    }
}
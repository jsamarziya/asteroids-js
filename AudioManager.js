"use strict";

/**
 * Manages audio system.
 */
class AudioManager {
    /**
     * Constructs a new AudioManager.
     */
    constructor() {
        this.sounds = {};
    }

    /**
     * Adds a sound to this manager.
     * @param {String} name the name of the sound
     * @param {Howl} sound the sound
     */
    addSound(name, sound) {
        this.sounds[name] = sound;
    }

    play(sound) {
        this.sounds[sound].play();
    }

    stop(sound) {
        this.sounds[sound].stop();
    }

    pause() {

    }

    resume() {

    }
}

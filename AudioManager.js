"use strict";

/**
 * Manages audio system.
 */
class AudioManager {
    /**
     * Constructs a new AudioManager.
     */
    constructor() {
        this.soundRecords = {};
        this.pauseSound = null;
        this.resumeSound = null;
    }

    /**
     * Adds a sound to this manager.
     * @param {String} name the name of the sound
     * @param {Howl} sound the sound
     */
    addSound(name, sound) {
        let soundRecord = {'name': name, 'sound': sound, 'playing': []};
        this.soundRecords[name] = soundRecord;
        if (!sound.loop()) {
            sound.on("end", function (id) {
                remove(soundRecord.playing, id);
            });
        }
    }

    /**
     * Sets the sound that is played when pausing.
     * @param {Howl} sound the pause sound
     */
    setPauseSound(sound) {
        this.pauseSound = sound;
    }

    /**
     * Sets the sound that is played when resuming.
     * @param {Howl} sound the resume sound
     */
    setResumeSound(sound) {
        this.resumeSound = sound;
    }

    /**
     * Plays the specified sound.
     * @param {String} name the name of the sound
     */
    play(name) {
        let record = this.soundRecords[name];
        if (record !== null) {
            let id = record.sound.play();
            record.playing.push(id);
        }
    }

    /**
     * Stops playing the specified sound.
     * @param {String} name the name of the sound
     */
    stop(name) {
        let record = this.soundRecords[name];
        if (record !== null) {
            record.sound.stop();
            record.playing.length = 0;
        }
    }

    /**
     * Pauses the playing of all sounds.
     */
    pause() {
        Object.values(this.soundRecords).forEach(record => record.sound.pause());
        if (this.pauseSound !== null) {
            this.pauseSound.play();
        }
    }

    /**
     * Resumes the playing of sounds.
     */
    resume() {
        if (this.resumeSound !== null) {
            this.resumeSound.play();
        }
        Object.values(this.soundRecords).forEach(record => {
            record.playing.forEach(id => {
                record.sound.play(id)
            });
        });
    }
}
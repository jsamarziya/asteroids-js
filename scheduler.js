"use strict";

class Scheduler {
    constructor() {
        this.time = 0;
        this.tasks = [];
    }

    advanceTime(dt) {
        this.time += dt;
        this.fireTasks();
    }

    schedule(callback, delay) {
        this.tasks.push({callback: callback, atTime: this.time + delay});
    }

    fireTasks() {
        this.tasks.forEach((task, index, array) => {
            if (this.time >= task.atTime) {
                array.splice(index, 1);
                task.callback();
            }
        });
    }
}
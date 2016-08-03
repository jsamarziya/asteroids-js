"use strict";

/**
 * Manages the scheduling and execution of tasks to be run at a future time.
 */
class Scheduler {
    /**
     * Constructs a new Scheduler.
     */
    constructor() {
        this.time = 0;
        this.tasks = [];
    }

    /**
     * Advances the current time.
     * @param {number} dt the amount of time to advance
     */
    advanceTime(dt) {
        this.time += dt;
        this.fireTasks();
    }

    /**
     * Schedules a callback function to be executed after the specified delay.
     * @param {function} callback the callback function
     * @param {number} delay the amount of time to wait before executing the task
     */
    schedule(callback, delay) {
        this.tasks.push({callback: callback, atTime: this.time + delay});
    }

    /**
     * Executes the tasks that are ready to be executed.
     */
    fireTasks() {
        this.tasks.forEach((task, index, array) => {
            if (this.time >= task.atTime) {
                array.splice(index, 1);
                task.callback();
            }
        });
    }
}
"use strict";

/**
 * The number of radians in a full circle.
 * @type {number}
 */
const FULL_CIRCLE = 2 * Math.PI;

/**
 * Converts the specified angle (in degrees) into radians.
 * @param {number} degrees the angle
 */
function toRadians(degrees) {
    return FULL_CIRCLE * degrees / 360;
}

/**
 * Inserts an element into an array that is in sorted order.
 * @param {Array} array the array
 * @param {*} item the item to insert
 * @param {function} comparator the function that defines the sort order
 */
function insertSorted(array, item, comparator) {
    let min = 0;
    let max = array.length;
    let index = Math.floor((min + max) / 2);
    while (max > min) {
        if (comparator(item, array[index]) < 0) {
            max = index;
        } else {
            min = index + 1;
        }
        index = Math.floor((min + max) / 2);
    }
    array.splice(index, 0, item);
}

/**
 * Removes the first instance of the specified item from an array.
 * @param {Array} array the array
 * @param {*} item the item to remove
 */
function remove(array, item) {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}

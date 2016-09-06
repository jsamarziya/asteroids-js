"use strict";

/**
 * The number of radians in a full circle.
 * @type {number}
 */
const FULL_CIRCLE = 2 * Math.PI;

/**
 * Converts the specified angle (in degrees) into radians.
 * @param degrees the angle
 */
function toRadians(degrees){
    return FULL_CIRCLE * degrees / 360;
}

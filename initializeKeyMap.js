"use strict";

function initializeKeyMap(asteroids) {
    asteroids.inputManager.keyMap = {
        drawDebug: createDrawDebugKey(),
        fullScreen: createRequestFullScreenModeKey(),
        pause: createPauseKey(),
        shoot: createShootKey(),
        showDebug: createShowDebugKey(),
        thrust: createThrustKey(),
        turnShipLeft: createTurnShipLeftKey(),
        turnShipRight: createTurnShipRightKey(),
    };

    function createDrawDebugKey() {
        const key = new Key("D");
        key.shift = true;
        key.addKeyDownListener(function () {
            asteroids.toggleDrawDebug();
        });
        return key;
    }

    function createRequestFullScreenModeKey() {
        const key = new Key("f");
        key.addKeyDownListener(function () {
            asteroids.requestFullScreenMode();
        });
        return key;
    }

    function createPauseKey() {
        const key = new Key("p");
        key.addKeyDownListener(function () {
            asteroids.togglePaused();
        });
        return key;
    }

    function createShootKey() {
        const key = new Key(" ");
        key.addKeyDownListener(function () {
            asteroids.ship.shoot();
        });
        return key;
    }

    function createShowDebugKey() {
        const key = new Key("d");
        key.addKeyDownListener(function () {
            asteroids.toggleShowDebug();
        });
        return key;
    }

    function createThrustKey() {
        const key = new Key("ArrowUp");
        key.addKeyDownListener(function () {
            asteroids.ship.setThrust(true);
        });
        key.addKeyUpListener(function () {
            asteroids.ship.setThrust(false);
        });
        return key;
    }

    function createTurnShipLeftKey() {
        const key = new Key("ArrowLeft");
        key.addKeyDownListener(function () {
            asteroids.ship.setTurnLeft(true);
        });
        key.addKeyUpListener(function () {
            asteroids.ship.setTurnLeft(false);
        });
        return key;
    }

    function createTurnShipRightKey() {
        const key = new Key("ArrowRight");
        key.addKeyDownListener(function () {
            asteroids.ship.setTurnRight(true);
        });
        key.addKeyUpListener(function () {
            asteroids.ship.setTurnRight(false);
        });
        return key;
    }
}
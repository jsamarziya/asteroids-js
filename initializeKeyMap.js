"use strict";

/**
 * Creates the keys used in the Asteroids game and adds them to the input manager's key map.
 * @param {Asteroids} asteroids the asteroids game
 */
function initializeKeyMap(asteroids) {
    asteroids.inputManager.keyMap = {
        drawDebug: createDrawDebugKey(),
        fullScreen: createRequestFullScreenModeKey(),
        hyperspace: createHyperspaceKey(),
        newGame: createNewGameKey(),
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
        key.addKeyPressListener(function () {
            asteroids.toggleDrawDebug();
        });
        return key;
    }

    function createRequestFullScreenModeKey() {
        const key = new Key("f");
        key.addKeyPressListener(function () {
            asteroids.requestFullScreenMode();
        });
        return key;
    }

    function createHyperspaceKey() {
        const key = new Key("ArrowDown");
        key.addKeyDownListener(function () {
            const ship = asteroids.ship;
            if (ship) {
                ship.initiateHyperspace();
            }
        });
        return key;
    }

    function createNewGameKey() {
        const key = new Key("s");
        key.addKeyPressListener(function () {
            asteroids.startNewGame();
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
            const ship = asteroids.ship;
            if (ship) {
                ship.shoot();
            }
        });
        return key;
    }

    function createShowDebugKey() {
        const key = new Key("d");
        key.addKeyPressListener(function () {
            asteroids.toggleShowDebug();
        });
        return key;
    }

    function createThrustKey() {
        const key = new Key("ArrowUp");
        key.addKeyDownListener(function () {
            const ship = asteroids.ship;
            if (ship) {
                ship.setThrust(true);
            }
        });
        key.addKeyUpListener(function () {
            const ship = asteroids.ship;
            if (ship) {
                ship.setThrust(false);
            }
        });
        return key;
    }

    function createTurnShipLeftKey() {
        const key = new Key("ArrowLeft");
        key.addKeyDownListener(function () {
            const ship = asteroids.ship;
            if (ship) {
                ship.setTurnLeft(true);
            }
        });
        key.addKeyUpListener(function () {
            const ship = asteroids.ship;
            if (ship) {
                ship.setTurnLeft(false);
            }
        });
        return key;
    }

    function createTurnShipRightKey() {
        const key = new Key("ArrowRight");
        key.addKeyDownListener(function () {
            const ship = asteroids.ship;
            if (ship) {
                ship.setTurnRight(true);
            }
        });
        key.addKeyUpListener(function () {
            const ship = asteroids.ship;
            if (ship) {
                ship.setTurnRight(false);
            }
        });
        return key;
    }
}
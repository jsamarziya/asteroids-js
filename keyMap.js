function initializeKeyMap() {
    asteroids.inputManager.keyMap = {
        fullScreen: createRequestFullScreenModeKey(),
        pause: createPauseKey(),
        showDebug: createShowDebugKey(),
        thrust: createThrustKey(),
        turnShipLeft: createTurnShipLeftKey(),
        turnShipRight: createTurnShipRightKey(),
    };

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
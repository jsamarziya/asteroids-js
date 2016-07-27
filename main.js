"use strict";

(function () {
    window.asteroids = new Asteroids(
        document.getElementById("canvasDiv"),
        document.getElementById("gameCanvas"),
        document.getElementById("debugCanvas"));
    initializeKeyMap(window.asteroids);
    window.asteroids.inputManager.addEventListeners(window, document);
    window.asteroids.start();
})();
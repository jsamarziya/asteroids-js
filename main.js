"use strict";

(function () {
    window.asteroids = new Asteroids(
        document.getElementById("canvasDiv"),
        document.getElementById("gameCanvas"),
        document.getElementById("overlayCanvas"),
        document.getElementById("debugCanvas"));
    window.addEventListener("resize", function () {
        window.asteroids.resizeDisplayElementsToWindow(window);
    });
    initializeKeyMap(window.asteroids);
    window.asteroids.inputManager.addEventListeners(window, document);
    window.asteroids.resizeDisplayElementsToWindow(window);
    window.asteroids.start();
})();
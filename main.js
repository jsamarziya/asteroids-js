(function () {
    window.asteroids = new Asteroids(
        document.getElementById("canvasdiv"),
        document.getElementById("gameCanvas"),
        document.getElementById("debugCanvas"));
    initializeKeyMap();
    window.asteroids.run();
})();
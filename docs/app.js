const socket = io();

const atb = document.getElementById("AtB");
const bta = document.getElementById("BtA");
const body = document.body;
let userADirection, userBDirection;
let userALocation = {};
let userBLocation = {};


window.addEventListener("deviceorientationabsolute", (event) => { //deviceorientationabsolute allows for absolute direction from true north, does not work on IOS.
    event.absolute = true;
    userADirection = event.alpha; //Z-Rotation of the device
    socket.emit("direction", userADirection); //Send direction to server

    //lookAt(userADirection, userBDirection, userALocation.x, userALocation.y, userBLocation.x, userBLocation.y);
    lookAt(userADirection, 135, userALocation.x, userALocation.y, 55.592595, 13.013424); //Fake location in Folkets Park

    isLookingAt.aToB ? body.style.backgroundColor = "#FF8474" : body.style.backgroundColor = "#9F5F80";

    if (isLookingAt.aToB) {
        body.style.backgroundColor = "#FF8474";
    } else if (isLookingAt.bToA) {
        body.style.backgroundColor = "#9F5F80";
    } else {
        body.style.backgroundColor = "#583d72"
    }

    atb.innerHTML = "A sees B: " + isLookingAt.aToB;
    bta.innerHTML = "B sees A: " + isLookingAt.bToA;
}, true);

socket.on("direction", (dir) => { //Receive friends direction from the server
    userBDirection = dir;
});

function success(pos) {
    userALocation.x = pos.coords.longitude;
    userALocation.y = pos.coords.latitude;

    socket.emit("latLon", { lat: userALocation.y, lon: userALocation.x }); //Send your location to the server

    socket.on("latLon", (location) => { //Receive friends location from server
        userBLocation.x = location.lon;
        userBLocation.y = location.lat;
    })
}

function error(err) {
    console.warn("ERROR with geolocation");
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}

const id = navigator.geolocation.watchPosition(success, error, options);

let isLookingAt = {
    aToB: false,
    bToA: false
}

function lookAt(alpha, beta, x1, y1, x2, y2) { //Input test values
    const range = 10;
    let gamma = (Math.tan((y2 - y1) / (x2 - x1)) * 180) / Math.PI
    alpha -= 180;
    beta -= 180;
    gamma -= 180;

    if (alpha >= gamma - range + 180 && alpha <= gamma + range + 180) { //A is looking at B
        isLookingAt.aToB = true;
    } else {
        isLookingAt.aToB = false;
    }
    if (beta >= gamma - range + 180 && beta <= gamma + range + 180) { //B is looking at A
        isLookingAt.bToA = true;
    } else {
        isLookingAt.bToA = false;
    }
}

/* function lookAtEachOther(alpha, beta) { //It just works, not 100% sure how. Not used
    const range = 10;
    alpha -= 180;
    beta -= 180;
    if (alpha >= beta - range + 180 && alpha <= beta + range + 180) {
        return true;
    } else {
        return false;
    }
} */
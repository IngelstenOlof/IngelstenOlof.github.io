const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");
const port = 3000;

app.use(express.static(__dirname + "/public"));

server.listen(port, () => {
    console.log("Port open at: " + port);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname, "public", "index.html");
});

io.on("connection", (socket) => {
    console.log("User connected.");

    socket.on("direction", (dir) => { //Broadcast directions
        socket.broadcast.emit("direction", dir);
    });

    socket.on("latLon", (location) => { //Broadcast locations
        socket.broadcast.emit("latLon", location);
    })

})
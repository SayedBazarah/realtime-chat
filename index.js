var express = require("express");
var app = express();
var port = process.env.PORT || 3700;

// Set view of '/' end point
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("login");
});
app.get("/chat", function (req, res) {
  res.render("page");
});

// use our puclic/chat.js file as listener
app.use(express.static(__dirname + "/public"));

// Set port
var midPort = app.listen(port, function () {
  console.log("Node.js listening on port " + port);
});

var users = [];
var io = require("socket.io").listen(midPort);
// set up socket connection
io.sockets.on("connection", function (socket) {
  try {
    let username = JSON.parse(socket.handshake.query?.state);
    if (!users.includes(username.username) && username.username)
      users.push(username.username);
    console.log(users);
  } catch {
    console.log("no user added ");
  }

  socket.emit("message", { message: "welcome to realtime chat" });
  io.sockets.emit("users", users);

  socket.on("disconnect", () => {
    console.log(`on disconnect - ${socket.id}  `);
  });

  socket.on("send", function (data) {
    io.sockets.emit("message", data);
  });
});

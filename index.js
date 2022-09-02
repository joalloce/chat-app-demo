import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

dotenv.config();

const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

const server = http.createServer(app);

const io = new Server(server);

let users = [];

io.on("connection", (socket) => {
  // disconnect
  socket.on("disconnect", () => {
    let user = getUserBySocketID(socket.id);
    io.emit("notification", `${user} left the chat`);
    io.emit("users online", users);
    users = users.filter((u) => u.id !== socket.id);
  });

  // new message
  socket.on("chat message", (message) => {
    let user = getUserBySocketID(socket.id);
    let newMessage = `${user}: ${message}`;
    io.emit("chat message", newMessage);
  });

  // new user connected
  socket.on("new user", (user) => {
    users = [...users, { id: socket.id, user }];
    io.emit("users online", users);
    io.emit("notification", `${user} joined the chat`);
  });
});

app.use(express.static(path.join(__dirname, "public")));

server.listen(APP_PORT, () => {
  console.log("Listening on port", APP_PORT);
});

// get username from socket id
function getUserBySocketID(id) {
  let user = null;

  users.forEach((u) => {
    if (u.id === id) {
      user = u.user;
    }
  });

  return user;
}

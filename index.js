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
  console.log("socket connected", socket.id);
  // disconnect
  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    users = users.filter((u) => u.id !== socket.id);
    io.emit("users online", users);
  });
  // new message
  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });
  // new user connected
  socket.on("new user", (user) => {
    users = [...users, { id: socket.id, user }];
    io.emit("users online", users);
  });
});

app.use(express.static(path.join(__dirname, "public")));

server.listen(APP_PORT, () => {
  console.log("Listening on port", APP_PORT);
});

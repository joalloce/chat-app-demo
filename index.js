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

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
  socket.on("chat message", (message) => {
    io.emit("chat message", message);
  });
});

app.use(express.static(path.join(__dirname, "public")));

server.listen(APP_PORT, () => {
  console.log("Listening on port", APP_PORT);
});

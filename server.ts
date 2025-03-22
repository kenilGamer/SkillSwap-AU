import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for testing only)
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message); // Broadcast to all clients

  });

  socket.on("typing", (data) => {
    io.emit("typing", data); // Broadcast to all clients
  })
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));

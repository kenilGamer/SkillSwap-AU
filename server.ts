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

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", (message) => {
    io.to(message.chatId).emit("receiveMessage", message); // Only to the relevant chat room
  });

  socket.on("typing", (data) => {
    io.to(data.chatId).emit("typing", data); // Only to the relevant chat room
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));

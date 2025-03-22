"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message); // Broadcast to all clients
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
server.listen(4000, () => console.log("Server running on port 4000"));

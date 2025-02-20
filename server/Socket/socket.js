const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const userSocketmap = {}; // {userId, socketId}

function getReceiverSocketId(receiverId) {
  return userSocketmap[receiverId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId || userId === "undefined") {
    console.warn("Invalid userId received:", userId);
    return;
  }
  userSocketmap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketmap));
  socket.on("disconnect", () => {
    delete userSocketmap[userId],
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };

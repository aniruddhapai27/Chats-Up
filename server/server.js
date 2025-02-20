const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRouter = require("./Routes/authRoutes");
const messageRouter = require("./Routes/messageRoutes");
const userRouter = require("./Routes/userRoutes");
const cookieParser = require("cookie-parser");
const { app, io, server } = require("./Socket/socket");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
const MONGO_URL = process.env.MONGO_URL;
try {
  mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// define routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

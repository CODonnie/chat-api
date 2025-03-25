import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import DBconnect from "./config/db";
import authRouter from "./routes/authRoutes";
import { workspaceRoutes } from "./routes/workspaceRoutes";
import { notificationRouter } from "./routes/notificationRoutes";
import { channelRouter } from "./routes/channelRoutes";
import { messageRouter } from "./routes/messageRoutes";
import { Message } from "./models/allModels";

//init
dotenv.config();
DBconnect();
const app = express();
const port = process.env.PORT || 5433;

//middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//route
app.use("/api/auth", authRouter);
app.use("/api", workspaceRoutes);
app.use("/api", notificationRouter);
app.use("/api/channel", channelRouter);
app.use("/api/message", messageRouter);

//errorMiddleware
app.use(errorHandler);
app.use(notFound);

//create server
const server = http.createServer(app);

//initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

//Socket.IO connection
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("joinChannel", async (channelId) => {
    socket.join(channelId);
    console.log(`✅ User ${socket.id} joined channel ${channelId}`);

    const messages = await Message.find({ channel: channelId })
      .populate("sender", "name email")
      .sort({ createdAt: "asc" });
    socket.emit("messageHistory", messages);
  });

  socket.on("sendMessage", (data) => {
    const { sender, channelId, message } = data;
    io.to(channelId).emit("receiveMessage", { sender, message });
    console.log(`📩 Message sent in channel ${channelId}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

//server
server.listen(port, () => console.log(`app running on port ${port}`));

export { app, server, io };

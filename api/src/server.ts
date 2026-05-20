import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from './app.js';

const PORT = Number(process.env.PORT) || 8086;

const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  path: "/socket",
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("message", {
    text: "Connected to server",
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
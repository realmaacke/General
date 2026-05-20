import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from './app.js';

import si, { cpu } from "systeminformation";


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

  const emitMetrics = async () => {
    try {
      const [cpu, mem, fs] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
      ]);

      socket.emit("metrics", {
        cpu: {
          usage: cpu.currentLoad, // %
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          usage: (mem.used / mem.total) * 100,
        },
        disks: fs.map((disk) => ({
          filesystem: disk.fs,
          mount: disk.mount,
          size: disk.size,
          used: disk.used,
          available: disk.available,
          usage: disk.use, // %
        })),
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to collect metrics:", error);
    }
  };

  // Send immediately
  void emitMetrics();

  // Send every second
  const interval = setInterval(() => {
    void emitMetrics();
  }, 1000);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
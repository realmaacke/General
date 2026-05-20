import http from "http";
import { Server } from "socket.io";

import app from './app.js';

const port = Number(process.env.PORT) || 8086;

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: [
      "https://petterssonhome.se",
      "https://www.petterssonhome.se"
    ],
  },
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  socket.emit("connected", { ok: true });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server + Socket.IO running on port: ${port}`);
});
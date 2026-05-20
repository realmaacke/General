import { io, Socket } from "socket.io-client";

export const socket: Socket = io({
    path: "/api/socket",
    transports: ["websocket"],
    autoConnect: true,
});
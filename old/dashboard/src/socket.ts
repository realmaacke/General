import { io, Socket } from "socket.io-client";

export const socket: Socket = io({
    path: "/api/socket",
    transports: ["websocket"],
    autoConnect: true,
});

// Use only when testing on local
// export const socket: Socket = io("https://petterssonhome.se", {
//     path: "/api/socket",
//     transports: ["websocket"],
//     autoConnect: true,
// });
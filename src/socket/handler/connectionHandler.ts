import { Socket } from "socket.io-client";
export const connectionFn = (socket: Socket) => {
  socket.on("connection", () => {});
};
export const connectionErrorFn = (socket: Socket) => {
  socket.on("connect_error", () => {});
};

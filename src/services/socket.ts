import { io } from "socket.io-client";

const URL = import.meta.env.PROD
  ? "localhost:3333"
  : "192.168.2.6:3333";

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
});

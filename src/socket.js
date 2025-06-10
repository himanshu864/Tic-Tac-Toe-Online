import { io } from "socket.io-client";

// const URL = "http://localhost:3000";
const URL = "http://192.168.151.52:3000";

export const socket = io(URL);

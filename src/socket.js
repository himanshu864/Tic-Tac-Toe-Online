import { io } from "socket.io-client";

const SOCKET_URL = "https://3.110.20.10:3000";

export const socket = io(SOCKET_URL);

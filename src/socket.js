import { io } from "socket.io-client";

const SOCKET_URL = "https://ttt.himanshudevs.live";

export const socket = io(SOCKET_URL);

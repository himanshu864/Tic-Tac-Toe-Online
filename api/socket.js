import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { initialGrid, winCheck, blinkIt } from "../src/utils/GameUtils";

const lonelyRooms = new Set(); // set of active rooms full of waiting strangers
const socketsMap = new Map(); // map roomID to set of socketIDs
const roomMap = new Map(); // map socketID to roomID
const gameState = new Map(); // map roomID to {grid, playerTurn}

const createRoom = (socket) => {
  const room = uuidv4();
  socket.join(room);
  socketsMap.set(room, new Set([socket.id]));
  roomMap.set(socket.id, room);
  gameState.set(room, {
    X: socket.id,
    O: null,
    playerTurn: "X",
    grid: initialGrid,
    state: -1,
    scores: [0, 0],
    blinkers: new Array(9).fill(false),
  });
  return room;
};

const joinRoom = (socket, room) => {
  socket.join(room);
  socketsMap.get(room).add(socket.id);
  roomMap.set(socket.id, room);

  const gs = gameState.get(room);
  gameState.set(room, { ...gs, O: socket.id });

  socket.broadcast.to(room).emit("opponent-join");
};

const leaveRoom = (socket) => {
  const room = roomMap.get(socket.id);
  roomMap.delete(socket.id);
  socket.leave(room);
  return room;
};

export default function handler(req, res) {
  // Only initialize once
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      socket.on("create-room", (cb) => {
        const room = createRoom(socket);
        cb(null, room);
      });

      socket.on("join-room", (room, cb) => {
        if (!room || !socketsMap.has(room) || socketsMap.get(room).size === 2) {
          return cb({ error: "Invalid room or room is full" });
        }
        joinRoom(socket, room);
        cb(null);
      });

      socket.on("random-room", (cb) => {
        if (lonelyRooms.size === 0) {
          const room = createRoom(socket);
          lonelyRooms.add(room);
          cb(null, true);
        } else {
          const room = lonelyRooms.values().next().value;
          lonelyRooms.delete(room);
          joinRoom(socket, room);
          cb(null, false);
        }
      });

      socket.on("my-turn", (row, col) => {
        const room = roomMap.get(socket.id);
        const gs = gameState.get(room);

        const newGrid = JSON.parse(JSON.stringify(gs.grid));
        const isInitialPlayer = gs.X === socket.id;
        newGrid[row][col] = isInitialPlayer ? 0 : 1;

        const newState = winCheck(newGrid);
        const newBlinkers = blinkIt(newGrid);
        const newScores = [...gs.scores];
        if (newState === 0 || newState === 1)
          newScores[isInitialPlayer ? 0 : 1]++;

        const updatedGameState = {
          ...gs,
          grid: newGrid,
          playerTurn: gs.playerTurn === "X" ? "O" : "X",
          state: newState,
          scores: newScores,
          blinkers: newBlinkers,
        };

        gameState.set(room, updatedGameState);
        io.to(room).emit("player-turn", updatedGameState);
      });

      socket.on("game-restart", () => {
        const room = roomMap.get(socket.id);
        const gs = gameState.get(room);
        const restartedGameState = {
          ...gs,
          grid: initialGrid,
          state: -1,
          blinkers: new Array(9).fill(false),
        };

        gameState.set(room, restartedGameState);
        io.to(room).emit("game-start", restartedGameState);
      });

      socket.on("betrayal", () => {
        leaveRoom(socket);
      });

      socket.on("disconnect", () => {
        // console.log(`Socket disconnected: ${socket.id}`);
        if (!roomMap.has(socket.id)) return;

        const room = leaveRoom(socket);

        if (lonelyRooms.has(room)) lonelyRooms.delete(room);
        if (socketsMap.has(room)) {
          if (socketsMap.get(room).size === 2)
            socket.broadcast.to(room).emit("opponent-left");
          socketsMap.delete(room);
          gameState.delete(room);
        }
      });
    });

    // attach to res so we don’t re-init on every call
    res.socket.server.io = io;
  }
  // we have to end the response or Vercel will hang
  res.end();
}

import express from 'express'
import http from 'http'
import { Server } from 'socket.io';
import { validate as isUuid } from 'uuid';
import ACTIONS from './src/Actions.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static('dist'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})


const userSocketMap = {};
const validRooms = new Set();
const roomCode = {};   // latest code of every room

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username, isNewRoom }) => {
        if (!validRooms.has(roomId)) {
            // only a real "create new room" action (with a UUID) may create a room
            if (isNewRoom && isUuid(roomId)) {
                validRooms.add(roomId);
            } else {
                return socket.emit(ACTIONS.JOIN_ERROR, {
                    message: 'Invalid Room ID. Please check the ID or create a new room.'
                });
            }
        }

        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });

        // give the newcomer the existing code
        if (roomCode[roomId] !== undefined) {
            socket.emit(ACTIONS.CODE_CHANGE, { code: roomCode[roomId] });
        }
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        if (!socket.rooms.has(roomId)) return;   // must be inside the room
        roomCode[roomId] = code;
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        [...socket.rooms].forEach((roomId) => {
            if (roomId === socket.id) return;
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
            const roomClients = io.sockets.adapter.rooms.get(roomId);
            if (roomClients && roomClients.size <= 1) {   // last person leaving
                validRooms.delete(roomId);
                delete roomCode[roomId];
            }
        });
        delete userSocketMap[socket.id];
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Listening on port ${PORT}`));
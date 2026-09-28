import express from 'express'
import http from 'http'
import {Server} from 'socket.io';
import ACTIONS from './src/Actions.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('socket; connected', socket.id)
    
})
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Listening on port $(PORT)'))
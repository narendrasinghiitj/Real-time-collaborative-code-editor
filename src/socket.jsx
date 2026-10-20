import {io} from 'socket.io-client'

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectAttempts: 'Infinity',
        timeout: 60000,
        transports: ['websocket'],
    };
    return io('wss://real-time-collaborative-code-editor-s9qa.onrender.com', options);
}
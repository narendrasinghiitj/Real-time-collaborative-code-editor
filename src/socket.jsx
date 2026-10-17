import {io} from 'socket.io-client'

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io('http://onrender.com', options);
}
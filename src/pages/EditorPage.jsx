import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from '../components/Clinet';
import Editor from '../components/editor';
import LogoProject from '../components/LogoProject.png'
import ACTIONS from "../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { initSocket } from "../socket";

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [socketReady, setSocketReady] = useState(false);

    // Step 1: create the socket and register listeners
    useEffect(() => {
        if (!location.state) return;
        let cancelled = false;   // protects against StrictMode double-run
        let socket;

        const init = async () => {
            socket = await initSocket();
            if (cancelled) {
                socket.disconnect();
                return;
            }
            socketRef.current = socket;

            const handleErrors = (e) => {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            };
            socket.on('connect_error', handleErrors);
            socket.on('connect_failed', handleErrors);

            socket.on(ACTIONS.JOIN_ERROR, ({ message }) => {
                toast.error(message);
                reactNavigator('/');
            });

            socket.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (socketId !== socket.id) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
            });

            socket.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter((c) => c.socketId !== socketId));
            });

            setSocketReady(true);   // now <Editor> can mount
        };
        init();

        return () => {
            cancelled = true;
            if (socket) socket.disconnect();
            socketRef.current = null;
            setSocketReady(false);
        };
    }, []);

    // Step 2: join only after Editor is mounted and listening
    useEffect(() => {
        if (!socketReady) return;
        socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username,
            isNewRoom: location.state?.isNewRoom,
        });
    }, [socketReady]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID has been copied to your clipboard");
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src={LogoProject} alt="makeyourcode-logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>Copy Room Id</button>
                <button className="btn leaveBtn" onClick={leaveRoom}>LEAVE</button>
            </div>
            <div className="editorWrap">
                {socketReady && <Editor socketRef={socketRef} roomId={roomId} />}
            </div>
        </div>
    );
};

export default EditorPage;
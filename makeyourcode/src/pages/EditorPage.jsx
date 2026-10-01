import React, {useState, useRef, useEffect} from "react";
import toast from "react-hot-toast";
import Client from '../components/Clinet';
import Editor from '../components/editor';
import LogoProject from '../components/LogoProject.png'
import ACTIONS from "../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { initSocket } from "../socket";


const EditorPage = () =>{
    const socketRef = useRef(null);
    const location = useLocation();
    const {roomId} = useParams();
    const reactNavigator = useNavigate();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error',e);
                toast.error('Socket connection failed, try again later.')
                reactNavigator('/')
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({clients,username,socketId}) => {
                if(username !== location.state?.username){
                    toast.success('\${username} joined the room,');
                    console.log('${username} joined');
                }
                setClients(clients)
            })

            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
                toast.success('\${username} left the room.');
                setClients((prev) => {
                    return prev.filter((client) => client.socketId !== socketId)
                })
            })
        }
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    },[]);
    const [clients, setClients] = useState([]);
    if(!location.state){
        return <Navigate to="/"/>
    }
    
    return <div className="mainWrap">
        <div className="aside">
            <div className="asideInner">
                <div className="logo">
                    <img src="{LogoProject}" className="logoImage"  alt="logo"  />
                </div>
                <h3 className="">Connected</h3>
                <div className="clientList">
                    {clients.map((client) => (
                        <Client key={client.socketId } username={client.username}/>
                    ))}
                </div>
            </div>
            <button className="btn copyBtn">Copy Room Id</button>
            <button className="btn leaveBtn">LEAVE</button>

        </div>
        <div className="editorWrap">
            <Editor />
        </div>
    </div>;
};

export default EditorPage;
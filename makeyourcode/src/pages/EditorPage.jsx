import React, {useState, useRef, useEffect} from "react";
import Client from '../components/Clinet';
import Editor from '../components/editor';
import LogoProject from '../components/LogoProject.png'
import ACTIONS from "../Actions";
import { useLocation } from "react-router-dom";
import { initSocket } from "../socket";

const EditorPage = () =>{
    const socketRef = useRef(null);
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
        }
        init();
    },[]);
    const [clients, setClients] = useState([
        {socketId: 1, username: 'narendra'},
        {socketId: 2, username: 'Arjun'},
        {socketId: 3, username: 'Payal'}
    ]);
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
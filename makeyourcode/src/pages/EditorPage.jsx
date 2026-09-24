import React, {useState} from "react";
import Client from '../components/Clinet';
import Editor from '../components/editor';

const EditorPage = () =>{
    const [clients, setClients] = useState([
        {socketId: 1, username: 'narendra'},
        {socketId: 2, username: 'Arjun'},
        {socketId: 3, username: 'Payal'}
    ]);
    return <div className="mainWrap">
        <div className="aside">
            <div className="asideInner">
                <div className="logo">
                    <img src="" alt="logo" className="logoImage" />
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
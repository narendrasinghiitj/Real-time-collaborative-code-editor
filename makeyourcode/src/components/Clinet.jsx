import React, {useState} from 'react'
import Avatar from 'react-avatar'
const Client = ({username}) => {
    
    return (
        <div>
            <div className="client">
                <Avatar name={username} size={50} round="14px"/>
                <span className="userName">{username}</span>
            </div>
        </div>
    )
}

export default Client
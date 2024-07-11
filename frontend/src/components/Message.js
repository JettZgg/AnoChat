import React from 'react';

const Message = ({ msg }) => (
    <div className="message">
        <div className="message-header">
            <strong>{msg.username}</strong>
            <span>{msg.timestamp}</span>
        </div>
        <div className="message-content">
            <p>{msg.text}</p>
        </div>
    </div>
);

export default Message;

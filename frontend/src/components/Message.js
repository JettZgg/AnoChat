import React from 'react';

const Message = ({ msg }) => {
    const formattedText = msg.text.replace(/\n/g, '<br />');

    return (
        <div className="message">
            <div className="message-header">
                <strong>{msg.username}</strong>
                <span>{msg.timestamp}</span>
            </div>
            <div className="message-content">
                <p dangerouslySetInnerHTML={{ __html: formattedText }} />
            </div>
        </div>
    );
};

export default Message;

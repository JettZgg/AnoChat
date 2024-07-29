import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <div className="flex flex-col space-y-2">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`p-2 rounded-lg ${message.isSelf
                            ? 'bg-blue-500 text-white self-end'
                            : 'bg-gray-200 self-start'
                        }`}
                >
                    <p className="text-sm font-bold">{message.username}</p>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { generateHashName } from '../utils/utils';
import Message from './Message';
import ChatInput from './ChatInput';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const { sendMessage } = useWebSocket('ws://192.168.0.54:8000/ws', setMessages);

    useEffect(() => {
        const fetchUsername = async () => {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const ip = data.ip;
            const port = Math.floor(Math.random() * 65535);
            const name = generateHashName(ip, port);
            setUsername(name);
        };

        fetchUsername();
    }, []);

    return (
        <div className="container">
            <h1>Anonymous Chat</h1>
            <div className="messages">
                {messages.map((msg, index) => (
                    <Message key={index} msg={msg} />
                ))}
            </div>
            <ChatInput sendMessage={sendMessage} username={username} />
        </div>
    );
};

export default Chat;

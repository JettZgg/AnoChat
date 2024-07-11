import React, { useState, useEffect, useRef } from 'react';
import { generateHashName } from './utils';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const websocket = useRef(null);

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

        const connectWebSocket = () => {
            websocket.current = new WebSocket('ws://192.168.0.54:8000/ws');

            websocket.current.onopen = () => {
                console.log("WebSocket connection opened");
            };

            websocket.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, message]);
            };

            websocket.current.onclose = (event) => {
                console.log("WebSocket connection closed", event);
                websocket.current = null;
                setTimeout(connectWebSocket, 3000);  // Increased retry interval
            };

            websocket.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                websocket.current.close();
            };
        };

        setTimeout(() => {
            if (!websocket.current) {
                connectWebSocket();
            }
        }, 1000);  // Delay before connecting

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && websocket.current) {
            const message = {
                username,
                text: input,
                timestamp: new Date().toLocaleString()
            };
            websocket.current.send(JSON.stringify(message));
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    };

    return (
        <div className="container">
            <h1>Anonymous Chat</h1>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <div className="message-header">
                            <strong>{msg.username}</strong>
                            <span>{msg.timestamp}</span>
                        </div>
                        <div className="message-content">
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form className="input-container" onSubmit={sendMessage}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="3"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (content) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ content, isSelf: true });
            socket.send(message);
            setMessages(prev => [...prev, JSON.parse(message)]);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow overflow-auto p-4">
                <MessageList messages={messages} />
                <div ref={messagesEndRef} />
            </div>
            <MessageInput onSendMessage={sendMessage} />
        </div>
    );
};

export default ChatPage;
import React, { useState } from 'react';

const ChatInput = ({ sendMessage, username }) => {
    const [input, setInput] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ username, text: input, timestamp: new Date().toLocaleString() });
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    return (
        <form className="input-container" onSubmit={handleSendMessage}>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows="3"
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default ChatInput;

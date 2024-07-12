import React, { useState } from 'react';

const ChatInput = ({ sendMessage, username }) => {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() || files.length) {
            const filePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result.split(',')[1] });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            const encodedFiles = await Promise.all(filePromises);

            const message = {
                username,
                text: input,
                timestamp: new Date().toLocaleString(),
                files: encodedFiles
            };
            sendMessage(message);
            setInput('');
            setFiles([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
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
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Send</button>
        </form>
    );
};

export default ChatInput;

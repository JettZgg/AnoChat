import React, { useState, useRef } from 'react';

const ChatInput = ({ sendMessage, username }) => {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

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
        const newFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        fileInputRef.current.value = '';
    };

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const renderFilePreview = (file, index) => {
        if (file.type.startsWith('image/')) {
            return (
                <div key={index} className="file-preview-item">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                    />
                    <button onClick={() => removeFile(index)}>×</button>
                </div>
            );
        } else {
            return (
                <div key={index} className="file-preview-item">
                    <span>[File: {file.name}]</span>
                    <button onClick={() => removeFile(index)}>×</button>
                </div>
            );
        }
    };

    return (
        <form className="input-container" onSubmit={handleSendMessage}>
            <div className="textarea-wrapper">
                <div className="file-preview">
                    {files.map((file, index) => renderFilePreview(file, index))}
                </div>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    rows="4"
                />
            </div>
            <label className="file-button">
                <i className="fas fa-paperclip"></i>
                <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    ref={fileInputRef}
                />
            </label>
            <button type="submit">Send</button>
        </form>
    );
};

export default ChatInput;

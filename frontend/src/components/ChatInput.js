import React, { useState, useRef } from 'react';

const ChatInput = ({ sendMessage, username }) => {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() || files.length) {
            const totalFiles = files.length;

            // Handle single file message directly
            if (totalFiles === 1) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    const encodedFile = { name: file.name, type: file.type, data: reader.result.split(',')[1] };
                    const message = {
                        username,
                        text: input,
                        timestamp: new Date().toLocaleString(),
                        files: [encodedFile],
                        isFinal: true // Indicate this is the final message
                    };
                    sendMessage(message); // Send the single file message directly
                    // Reset input fields
                    setInput('');
                    setFiles([]);
                    setUploadProgress(0);
                };
                reader.readAsDataURL(file);
                return;
            }

            let completedFiles = 0;
            const uploadedFiles = [];

            for (let file of files) {
                const filePromise = new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result.split(',')[1] });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const encodedFile = await filePromise;
                uploadedFiles.push(encodedFile);

                const message = {
                    username,
                    text: input,
                    timestamp: new Date().toLocaleString(),
                    files: [encodedFile],
                    isFinal: false // Indicate this is an individual file message
                };
                sendMessage(message); // Send each file individually to the backend
                completedFiles++;
                setUploadProgress(Math.floor((completedFiles / totalFiles) * 100));
            }

            // Reassemble the message with all files on the frontend
            const finalMessage = {
                username,
                text: input,
                timestamp: new Date().toLocaleString(),
                files: uploadedFiles,
                isFinal: true // Indicate this is the final reassembled message
            };

            // Send the reassembled message to the chat component
            sendMessage(finalMessage);

            // Reset input fields
            setInput('');
            setFiles([]);
            setUploadProgress(0);
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
                {uploadProgress > 0 && (
                    <div className="upload-progress">
                        {uploadProgress}%
                    </div>
                )}
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

import React from 'react';

const Message = ({ msg }) => {
    const formattedText = msg.text.replace(/\n/g, '<br />');

    const createObjectURL = (file) => {
        const byteCharacters = atob(file.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file.type });
        return URL.createObjectURL(blob);
    };

    return (
        <div className="message">
            <div className="message-header">
                <strong>{msg.username}</strong>
                <span>{msg.timestamp}</span>
            </div>
            <div className="message-content">
                <p dangerouslySetInnerHTML={{ __html: formattedText }} />
                {msg.files && msg.files.map((file, index) => (
                    file.type.startsWith('image/') ? (
                        <img key={index} src={`data:${file.type};base64,${file.data}`} alt={file.name} style={{ maxWidth: '100%' }} />
                    ) : (
                        <a key={index} href={createObjectURL(file)} download={file.name} target="_blank" rel="noopener noreferrer">
                            {file.name}
                        </a>
                    )
                ))}
            </div>
        </div>
    );
};

export default Message;

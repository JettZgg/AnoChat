import React, { useState } from 'react';

const Message = ({ msg }) => {
    const [showAllImages, setShowAllImages] = useState(false);
    const formattedText = msg.text.replace(/\n/g, '<br />');

    const renderImageGrid = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length <= 4) {
            return (
                <div className="image-grid-less">
                    {imageFiles.map((file, index) => (
                        <div key={`preview-${index}`} className="image-container">
                            <img src={`data:${file.type};base64,${file.data}`} alt={file.name} onClick={() => setShowAllImages(true)} />
                        </div>
                    ))}
                </div>
            );
        } else {
            const displayedImages = imageFiles.slice(0, 4);
            const remainingImagesCount = imageFiles.length - displayedImages.length;

            return (
                <div className="image-grid-more" onClick={() => setShowAllImages(true)}>
                    {displayedImages.map((file, index) => (
                        <div key={`preview-${index}`} className="image-container">
                            <img src={`data:${file.type};base64,${file.data}`} alt={file.name} />
                            {index === 3 && remainingImagesCount > 0 && (
                                <div className="more-images">+{remainingImagesCount}</div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
    };

    const renderFullImageGallery = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        return (
            <div className="full-image-gallery">
                <div className="gallery-header">
                    <span>{imageFiles.length} Photos</span>
                    <button onClick={() => setShowAllImages(false)}>Close</button>
                </div>
                <div className="gallery-content">
                    {imageFiles.map((file, index) => (
                        <div key={`full-${index}`} className="gallery-item">
                            <img src={`data:${file.type};base64,${file.data}`} alt={file.name} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderFile = (file, index) => {
        if (file.type.startsWith('image/')) {
            return null; // Images are handled in renderImageGrid
        } else {
            return (
                <div key={`file-${index}`} className="file-item">
                    <a href={`data:${file.type};base64,${file.data}`} download={file.name} target="_blank" rel="noopener noreferrer">
                        {file.name}
                    </a>
                </div>
            );
        }
    };

    return (
        <div className="message">
            <div className="message-header">
                <strong>{msg.username}</strong>
                <span>{msg.timestamp}</span>
            </div>
            <div className="message-content">
                <p dangerouslySetInnerHTML={{ __html: formattedText }} />
                {msg.files && msg.files.length > 0 && (
                    <>
                        {showAllImages 
                            ? renderFullImageGallery(msg.files)
                            : renderImageGrid(msg.files)
                        }
                        <div className="files-container">
                            {msg.files.map((file, index) => renderFile(file, index))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Message;

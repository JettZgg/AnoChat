import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url, onMessage) => {
    const websocket = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            websocket.current = new WebSocket(url);
    
            websocket.current.onopen = () => {
                console.log("WebSocket connection opened");
            };
    
            websocket.current.onmessage = (event) => {
                console.log("Received message:", event.data);
                const message = JSON.parse(event.data);
                onMessage(message);
            };
    
            websocket.current.onclose = (event) => {
                console.log("WebSocket connection closed:", event);
                console.log("CloseEvent code:", event.code);
                console.log("CloseEvent reason:", event.reason);
                websocket.current = null;
                setTimeout(connectWebSocket, 3000);  // Increased retry interval
            };
    
            websocket.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                websocket.current.close();
            };
        };
    
        if (!websocket.current) {
            connectWebSocket();
        }
    
        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, [url, onMessage]);
};

export default useWebSocket;

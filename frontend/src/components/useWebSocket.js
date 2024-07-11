import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url, onMessage) => {
    const websocket = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            websocket.current = new WebSocket(url);

            websocket.current.onopen = () => {
                console.log("WebSocket connection opened");
            };

            websocket.current.onmessage = onMessage;

            websocket.current.onclose = (event) => {
                console.log("WebSocket connection closed", event);
                websocket.current = null;
                setTimeout(connectWebSocket, 1000);  // 重试连接
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

    return websocket.current;
};

export default useWebSocket;

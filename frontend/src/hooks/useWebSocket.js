import { useRef, useEffect, useCallback } from 'react';

const useWebSocket = (url, setMessages) => {
    const websocket = useRef(null);
    const retryTimeout = useRef(null);
    const retryCount = useRef(0);
    const maxRetries = 5;

    const connectWebSocket = useCallback(() => {
        if (websocket.current && (websocket.current.readyState === WebSocket.OPEN || websocket.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        websocket.current = new WebSocket(url);

        websocket.current.onopen = () => {
            console.log("WebSocket connection opened");
            retryCount.current = 0; // Reset retry count on successful connection
        };

        websocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        websocket.current.onclose = (event) => {
            console.log("WebSocket connection closed", event);
            websocket.current = null;
            if (retryTimeout.current) {
                clearTimeout(retryTimeout.current);
            }
            if (retryCount.current < maxRetries) {
                retryCount.current += 1;
                const delay = Math.min(3000 * (2 ** retryCount.current), 30000); // Exponential backoff
                retryTimeout.current = setTimeout(connectWebSocket, delay);
            }
        };

        websocket.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            if (websocket.current && websocket.current.readyState !== WebSocket.OPEN) {
                websocket.current.close();
            }
        };
    }, [url, setMessages]);

    useEffect(() => {
        const initWebSocket = () => {
            if (!websocket.current || websocket.current.readyState === WebSocket.CLOSED) {
                connectWebSocket();
            }
        };

        const initialTimeout = setTimeout(initWebSocket, 100); // Initial delay before connecting

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
            if (retryTimeout.current) {
                clearTimeout(retryTimeout.current);
            }
            clearTimeout(initialTimeout);
        };
    }, [connectWebSocket]);

    const sendMessage = (message) => {
        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            websocket.current.send(JSON.stringify(message));
        }
    };

    return { websocket, sendMessage, connectWebSocket };
};

export default useWebSocket;

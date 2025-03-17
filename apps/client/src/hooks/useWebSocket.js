import { useState, useEffect, useRef } from "react";

function useWebSocket(url) {
  const connection = useRef(null);
  const [status, setStatus] = useState({ connected: false, error: false });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    connection.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected ✅");
      setStatus((prev) => ({ ...prev, connected: true, error: false }));
    };

    socket.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        setMessage(parsedMessage);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setMessage(event.data); // Fallback to raw message
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error ❌", event);
      setStatus((prev) => ({ ...prev, error: true }));
    };

    socket.onclose = () => {
      console.warn("WebSocket disconnected 🔴");
      setStatus({ connected: false, error: false });
    };

    return () => {
      socket.close();
    };
  }, [url]); // Removed `status` to prevent infinite loops

  return { status, message };
}

export { useWebSocket };

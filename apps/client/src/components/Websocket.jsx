import { useState, useEffect, useRef } from "react";

export default function Websocket() {
  const connection = useRef(null);
  const [status, setStatus] = useState("");
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");

    // Connection opened
    socket.addEventListener("open", (event) => {
      socket.send("Connection established");
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });

    connection.current = socket;

    return () => connection.current?.close();
  }, []);

  return (
    <div>
      <h1>Service Status: {status}</h1>
    </div>
  );
}

import { useWebSocket } from "../../hooks/useWebSocket";
import { useState, useEffect } from "react";

export default function WhatsAppStream() {
  const { message: changeStreamMessage } = useWebSocket(
    "ws://127.0.0.1:8000/db-stream/ws"
  );
  console.log("logsMessage", changeStreamMessage);
  const [changeStream, setChangeStream] = useState([]);
  useEffect(() => {
    if (changeStreamMessage) {
      setChangeStream((prevChangeStream) => [
        ...prevChangeStream,
        changeStreamMessage,
      ]);
    }
  }, [changeStreamMessage]);
  console.log(changeStream);
  return (
    <div>
      {/* <h2>WhatsApp Log Stream</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {logs.map((log, index) => (
          <div key={index}>
            <p>{log.message}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}

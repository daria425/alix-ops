import { useWebSocket } from "../../hooks/useWebSocket";
import { useState, useEffect } from "react";

export default function WhatsAppLogs() {
  const { message: logsMessage } = useWebSocket("ws://127.0.0.1:8000/logs/ws");
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    if (logsMessage && Array.isArray(logsMessage)) {
      setLogs((prevLogs) => [...prevLogs, ...logsMessage]);
    }
  }, [logsMessage]);
  console.log(logs);
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

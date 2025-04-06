import { useWebSocket } from "../../hooks/useWebSocket";
import { useData } from "../../hooks/useData";
import { useState, useEffect } from "react";

export default function WhatsAppStream() {
  const {
    data: prevDbChangeData,
    loading,
    fetchError,
  } = useData("/monitoring/whatsapp/activity", "timeframe=7200");
  const { message: changeStreamMessage } = useWebSocket(
    "ws://127.0.0.1:8000/db-stream/ws"
  );
  const [combinedData, setCombinedData] = useState([]);
  useEffect(() => {
    if (prevDbChangeData) {
      setCombinedData(prevDbChangeData.documents || []);
    }
  }, [prevDbChangeData]);
  useEffect(() => {
    if (changeStreamMessage) {
      setCombinedData((prevData) => [
        changeStreamMessage.document,
        ...prevData,
      ]);
    }
  }, [changeStreamMessage]);
  if (loading) return <div>Loading...</div>;
  if (fetchError) return <div>Error: {fetchError}</div>;

  return (
    <div>
      <h2>WhatsApp Log Stream</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {combinedData.map((doc, index) => (
          <div key={index}>
            <p>{doc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

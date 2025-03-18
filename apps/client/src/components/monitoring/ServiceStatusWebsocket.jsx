import { useWebSocket } from "../../hooks/useWebSocket";
import Services from "./Services";
export default function Websocket() {
  const { status, message } = useWebSocket("ws://127.0.0.1:8000/ws");
  const serviceResponses = message?.service_responses || [];
  const errorData = message?.error_data || [];

  return (
    <div>
      {serviceResponses.length > 0 ? (
        <Services serviceData={serviceResponses} />
      ) : (
        <p>Loading service data...</p>
      )}
    </div>
  );
}

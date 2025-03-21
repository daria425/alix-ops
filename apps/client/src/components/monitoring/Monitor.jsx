import ServiceStatusWebsocket from "./ServiceStatusWebsocket";
import LatencyWebSocket from "./LatencyWebsocket";
export default function Monitoring() {
  return (
    <div>
      <ServiceStatusWebsocket />
      <LatencyWebSocket />
    </div>
  );
}

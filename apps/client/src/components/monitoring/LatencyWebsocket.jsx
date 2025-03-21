import { useWebSocket } from "../../hooks/useWebSocket";

export default function LatencyWebSocket() {
  const { message } = useWebSocket("ws://127.0.0.1:8000/latency/ws");
  console.log(message);
}

import { useWebSocket } from "../../hooks/useWebSocket";
export default function Websocket() {
  const { status, message } = useWebSocket("ws://127.0.0.1:8000/ws");
  const serviceResponses = message?.service_responses || [];
  console.log(serviceResponses);

  return (
    <div>
      <h1>Service Status:{""} </h1>
      {/* {
        serviceResponses.length>0&&serviceResponses.map((serviceResponse, index) => (
          <div key={index}>
            <h2>{serviceResponse.serviceName}</h2>
            <p>{serviceResponse.status}</p>
          </div>
        ))
      } */}
    </div>
  );
}

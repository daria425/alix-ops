import axios from "axios";
const devHost = "127.0.0.1:8000";
const prodHost = "api-1-711319681683.europe-west2.run.app";
let base_url = `http://${devHost}/`;
let websocket_url = `ws://${devHost}/db-stream/ws`;
if (import.meta.env.MODE === "production") {
  base_url = `https://${prodHost}/`;
  websocket_url = `wss://${prodHost}/db-stream/ws`;
}
const apiConfig = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiConfig, base_url, websocket_url };

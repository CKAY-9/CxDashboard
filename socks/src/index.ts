import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import dotenv from "dotenv";
import path from "path";
import { handleMessage } from "./handlers";

dotenv.config({"path": path.join(__dirname + "/../.env")});

const server = createServer();
const wss = new WebSocketServer({server: server});

wss.on("connection", async (ws: WebSocket) => {
    ws.send(JSON.stringify({"id": "initialConnect"}));
    // Message handlers
    ws.on("message", async (data) => {
        try {
            const dParse = JSON.parse(data.toString());
            console.log(dParse);
            handleMessage(ws, dParse);
        } catch (e) {
            console.log(e);
        }
    });
});

const PORT = Number.parseInt(process.env.WS_PORT) || 3002;
server.listen(PORT, "0.0.0.0", async () => {
    console.log(`Started CxDashboard WebSocket server on port ${PORT}`);
});
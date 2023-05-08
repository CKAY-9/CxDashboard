import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import dotenv from "dotenv";
import path from "path";
import client, { db } from "./mongo";
import { Server } from "./server";

dotenv.config({"path": path.join(__dirname + "/../.env")});

const server = createServer();
const wss = new WebSocketServer({server: server});
const servers: Server[] = []

const dashIDToServer = (dashID: string) => {
    for (const server of servers) {
        if (server.dashID === dashID) {
            return server;
        }
    }

    return null;
}

wss.on("connection", (ws: WebSocket) => {
    ws.send(JSON.stringify({"id": "initialConnect"}));
    // Message handlers
    ws.on("message", (data) => {
        try {
            const dParse = JSON.parse(data.toString());
            console.log(dParse);
            switch (dParse.id) {
                case "clientConnect":
                    dashIDToServer(dParse.dashID).clients.push(ws);
                    ws.send(JSON.stringify({
                        "id": "connectionResponse",
                        "online": dashIDToServer(dParse.dashID).gameServer !== undefined
                    }));
                    break;
                case "gameConnect":
                    dashIDToServer(dParse.dashID).gameServer = ws;
                    for (const sock of dashIDToServer(dParse.dashID).clients) {
                        sock.send(JSON.stringify({
                            "id": "updateServerStatus",
                            "online": dashIDToServer(dParse.dashID).gameServer !== undefined
                        }));
                    }
                    break;
                case "updateServer":
                    dashIDToServer(dParse.dashID).updateInfo(dParse);
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    })
});

const fetchNewServers = async () => {
    await client.connect();

    const oldLength = servers.length;
    const newServers = await db.collection("servers").find({}).toArray();
    for (const _s of newServers) {
        for (const s of servers) {
            if (s.dashID === _s.dashID) {
                continue;
            }
            servers.push(new Server(_s.dashID));
        }
    }

    if (oldLength != servers.length) {
        console.log("Updated server list!");
    }

    await client.close();
}

const PORT = Number.parseInt(process.env.WS_PORT) || 3002;
server.listen(PORT, "0.0.0.0", async () => {
    await client.connect();
    const _servers = await db.collection("servers").find({}).toArray();
    for (const server of _servers) {
        if (!server.dashID) continue;
        servers.push(new Server(server.dashID));
        console.log("Registered Server!")
    }
    await client.close();
    console.log(`Started CxDashboard WebSocket server on port ${PORT}`);
    setInterval(async () => {
        await fetchNewServers();
    }, 1000 * 60);
});
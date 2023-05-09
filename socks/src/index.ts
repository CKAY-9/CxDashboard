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

const removeUser = (ws: WebSocket) => {
    for (const s of servers) {
        for (const c of s.clients) {
            if (c === ws) {
                const index = s.clients.indexOf(c);
                s.clients.splice(index);
                return;
            }
        }
    }
}

const userExists = (ws: WebSocket): boolean => {
    for (const s of servers) {
        for (const c of s.clients) {
            if (c === ws) {
                return true;
            }
        }
    }

    return false;
}

wss.on("connection", async (ws: WebSocket) => {
    if (!userExists(ws)) {
        ws.send(JSON.stringify({"id": "initialConnect"}));
    }
    // Message handlers
    ws.on("message", async (data) => {
        try {
            const dParse = JSON.parse(data.toString());
            let server = dashIDToServer(dParse.dashID);
            console.log(dParse);
            switch (dParse.id) {
                case "clientConnect":
                    if (userExists(ws)) break;
                    server.clients.push(ws);
                    ws.send(JSON.stringify({
                        "id": "connectionResponse",
                        "online": server.gameServer !== undefined
                    }));
                    break;
                case "gameConnect":
                    await fetchNewServers();
                    server = dashIDToServer(dParse.dashID);
                    server.gameServer = ws;
                    server.broadcast({
                        "id": "updateServerStatus",
                        "online": server.gameServer !== undefined
                    })
                    break;
                default: // Just broadcast any specific messages
                    server.broadcast(dParse);
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    });

    ws.on("close", () => {
        try {
            removeUser(ws);
        } catch (e) {
            console.log(e);
        }
    });
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
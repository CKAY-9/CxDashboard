import { WebSocket } from "ws";
import axios from "axios";
import { Server } from "./server";

const servers: Server[] = []

const generateServer = async (dashID: string) => {
    for (const s of servers) {
        if (s.dashID === dashID) {
            return;
        }
    }
    const newServer = new Server(dashID);
    servers.push(newServer);
}

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

const clientConnect = async (ws: WebSocket, dParse: any) => {
    await generateServer(dParse.dashID);
    let server = dashIDToServer(dParse.dashID);

    if (userExists(ws)) return;

    server.clients.push(ws);
    ws.send(JSON.stringify({
        "id": "connectionResponse",
        "online": server.gameServer !== undefined
    }));
}

const gameConnect = async (ws: WebSocket, dParse: any) => {
    generateServer(dParse.dashID);
    let server = dashIDToServer(dParse.dashID);
    
    server.gameServer = ws;

    const updateStatus = await axios({
        "url": process.env.API_URL + "/integration/updateServerStatus",
        "method": "POST",
        "data": {
            "dashID": dParse.dashID,
            "active": true
        }
    });

    server.broadcast({
        "id": "updateServerStatus",
        "online": server.gameServer !== undefined
    })
}

const gameDisconnect = async (ws: WebSocket, dParse: any) => {
    generateServer(dParse.dashID);
    let server = dashIDToServer(dParse.dashID);
    server.gameServer = undefined;

    const updateStatus = await axios({
        "url": process.env.API_URL + "/integration/updateServerStatus",
        "method": "POST",
        "data": {
            "dashID": dParse.dashID,
            "active": false
        }
    });

    server.broadcast({
        "id": "updateServerStatus",
        "online": server.gameServer !== undefined
    })
}

const gameCommand = async (ws: WebSocket, dParse: any) => {
    let server = dashIDToServer(dParse.dashID);
    server.gameServer.send(JSON.stringify({
        "id": "gameCommand",
        "dashID": dParse.dashID,
        "data": JSON.stringify({
            "command": dParse.command
        })
    }));
}

const defaultBehaviour = async (ws: WebSocket, dParse: any) => {
    await generateServer(dParse.dashID);
    let server = dashIDToServer(dParse.dashID);
    server.broadcast(dParse);
}

export const handleMessage = async (ws: WebSocket, dParse: any) => {
    switch (dParse.id) {
        case "clientConnect":
            await clientConnect(ws, dParse);
            break;
        case "gameConnect":
            await gameConnect(ws, dParse);
            break;
        case "gameDisconnect": 
            await gameDisconnect(ws, dParse);
            break;
        case "gameCommand":
            await gameCommand(ws, dParse);
            break;
        default: // Just broadcast any specific messages
            await defaultBehaviour(ws, dParse);
            break;
    }
}

import { WebSocket } from "ws";

export class Server {
    clients: WebSocket[] = [];
    gameServer: WebSocket | undefined = undefined;
    dashID: string = "";

    updateInfo = (info: any) => {
        for (const sock of this.clients) {
            sock.send(JSON.stringify(info));
        }
    }

    constructor(dashID: string) {
        this.dashID = dashID;
    }
}
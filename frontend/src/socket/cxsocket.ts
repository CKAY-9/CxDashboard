interface Event {
    id: string,
    do: Function
}

export class CxSocket {
    dashID: string = "";
    socket: WebSocket | null = null;

    events: Event[] = [];
    onOpen: Function = () => { }
    onClose: Function = () => { }
    onError: Function = () => { }

    constructor(dashID: string) {
        this.dashID = dashID;
    }

    send = (data: any) => {
        this.socket?.send(JSON.stringify(data));
    }

    connect = () => {
        const ws = process.env.NEXT_PUBLIC_DASHBOARD_WS || "ws://localhost:3002";
        this.socket = new WebSocket(ws);
        this.socket.onopen = this.onOpen();
        this.socket.onclose = this.onClose();
        this.socket.onerror = this.onError();
        this.socket.onmessage = (data) => {
            const dParse = JSON.parse(data.data.toString());
            for (const event of this.events) {
                if (event.id === dParse.id) {
                    event.do(dParse);
                }
            }
        }
    }
}
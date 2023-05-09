"use client";

import { NextPage } from "next";
import style from "./server.module.scss";
import { BaseSyntheticEvent, Component, ReactNode, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { CxSocket } from "@/socket/cxsocket";
import { GarrysMod } from "./garrysmod";
import { Minecraft } from "./minecraft";

export const SetServerName = (props: {dashID: string}) => {
    const [serverName, setServerName] = useState<string>("");
    const router = useRouter();

    const submit = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const req = await axios({
            "method": "POST",
            "url": process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/changeServerName",
            "data": {
                "dashID": props.dashID,
                "serverName": serverName
            },
            "headers": {
                "authorization": `${getCookie("token")}`
            }
        });

        router.refresh();
    }

    return (
        <div className={style.popup}>
            <div className={style.content}>
                <div style={{"textAlign": "center"}}>
                    <h2>Please set a name for this server</h2>
                    <span style={{"opacity": "0.5"}}>(This can be changed later)</span>
                </div>
                <form onSubmit={submit} style={{"display": "flex", "gap": "1rem"}}>
                    <input onChange={(e: BaseSyntheticEvent) => setServerName(e.target.value)} type="text" name="servername" id="servername" placeholder="Server Name" />
                    <input type="submit" value="Set Name" />
                </form>
            </div>
        </div>
    );
}

export class SocketComponent extends Component<any, any> {
    socket = new CxSocket("");

    constructor(props: {dashID: string, gameType: string, serverInfo: any}) {
        super(props);
        this.socket.dashID = props.dashID;
        this.state = {
            online: false,
            gameType: props.gameType,
            serverInfo: props.serverInfo,
            view: <></>
        }
    }

    componentDidMount(): void {
        this.socket.events.push(
            {
                "id": "initialConnect",
                "do": (data: any) => {
                    this.socket.send({
                        "id": "clientConnect",
                        "dashID": this.socket.dashID
                    });
                }
            },
            {
                "id": "connectionResponse",
                "do": (data: {id: string, online: boolean}) => {
                    console.log(data);
                    this.setState({online: data.online});
                }
            },
        )
        this.socket.connect();
        switch (this.state.gameType) {
            case "gmod":
                this.setState({view: <GarrysMod serverData={this.state.serverInfo} socket={this.socket}></GarrysMod>});
                break;
            case "mc":
                this.setState({view: <Minecraft serverData={this.state.serverInfo} socket={this.socket}></Minecraft>});
                break;
        }
    }

    render(): ReactNode {
        if (!this.state.online) {
            return (
                <section style={{"display": "flex", "alignItems": "center", "justifyContent": "center", "width": "100%"}}>
                    <h1 style={{"margin": "0", "fontSize": "4rem", "textAlign": "center"}}>Server currently offline!</h1>
                </section>
            )
        }

        return (
            <>
                {this.state.view}
            </>
        );
    }
}

const ServerPageClient: NextPage<{children: any}> = ({children}) => {
    return (
        <>
            {children}
        </>
    );
}

export default ServerPageClient;
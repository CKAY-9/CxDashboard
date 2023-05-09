"use client";

import { NextPage } from "next";
import style from "./server.module.scss";
import { BaseSyntheticEvent, Component, ReactNode, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { CxSocket } from "@/socket/cxsocket";
import Image from "next/image";
import { transGameToText } from "@/utils/information";

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

        window.location.reload();
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

// Garry's Mod
interface ServerData {
    gamemode: string,
    avgPing: number,
    id: string,
    plyCount: number,
    dashID: string,
    staffCount: 0,
    map: string
}

interface Message {
    steamID: string,
    text: string,
    name: string
}
export class GarrysMod extends Component<any, any> {
    constructor(props: {socket: CxSocket, serverData: ServerData}) {
        super(props);
        this.state = {
            serverInfo: {
                "avgPing": 0,
                "gamemode": "Loading...",
                "map": "Loading...",
                "plyCount": 0,
                "staffCount": 0,
                "dashID": "",
                "id": ""
            },
            serverData: props.serverData,
            messages: []
        }
        props.socket.events.push(
            {
                "id": "updateServer",
                "do": (data: any) => {
                    this.setState({serverInfo: data});
                }
            }
        );
        props.socket.events.push(
            {
                "id": "gmodmessage",
                "do": (data: any) => {
                    this.setState((prevState: any) => ({
                        messages: [...prevState.messages, data]
                    }));
                }
            }
        );
    }

    render(): ReactNode {
        return (
            <>
                <nav>
                    <section style={{"flex": "0", "minWidth": "20%"}}>
                        <h2>{this.state.serverData.serverName}</h2>
                        <h2>{transGameToText(this.state.serverData.game)}</h2>
                    </section>
                    <section className={style.overview}>
                        <div className={style.card}>
                            <div className={style.img}>
                                <Image src="/dashboard/ping.svg" alt="Dashboard Image" fill></Image>
                            </div>
                            <span>Average Ping: {Math.round(this.state.serverInfo.avgPing)}ms</span>
                        </div>
                        <div className={style.card}>
                            <div className={style.img}>
                                <Image src="/dashboard/map.svg" alt="Dashboard Image" fill></Image>
                            </div>
                            <span>Map: {this.state.serverInfo.map}</span>
                        </div>
                        <div className={style.card}>
                            <div className={style.img}>
                                <Image src="/dashboard/players.svg" alt="Dashboard Image" fill></Image>
                            </div>
                            <span>Player Count: {this.state.serverInfo.plyCount}</span>
                        </div>
                        <div className={style.card}>
                            <div className={style.img}>
                                <Image src="/dashboard/staff.svg" alt="Dashboard Image" fill></Image>
                            </div>
                            <span>Staff Count: {this.state.serverInfo.staffCount}</span>
                        </div>
                        <div className={style.card}>
                            <div className={style.img}>
                                <Image src="/dashboard/game.svg" alt="Dashboard Image" fill></Image>
                            </div>
                            <span>Gamemode: {this.state.serverInfo.gamemode}</span>
                        </div>
                    </section>
                </nav>
                <section className={style.panel}>
                    <h1>Chat</h1>
                    <section className={style.chat}>
                        {this.state.messages.map((message: Message, index: number) => {
                            return (
                                <div key={index} className={style.message}>
                                    <h2>{message.name} <span>({message.steamID})</span></h2>
                                    <p>{message.text}</p>
                                </div>
                            )
                        })}
                    </section>

                    <h1>Commands</h1>
                    <section>
                        <button>Run custom command</button>
                    </section>
                </section>
            </>
        );
    }
}

export class SocketComponent extends Component<any, any> {
    socket = new CxSocket("");

    constructor(props: {dashID: string, gameType: string, serverInfo: ServerData}) {
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
            {
                "id": "updateServerStatus",
                "do": (data: {id: string, online: boolean}) => {
                    console.log(data);
                    this.setState({online: data.online});
                }
            }
        )
        this.socket.connect();
        switch (this.state.gameType) {
            case "gmod":
                this.setState({view: <GarrysMod serverData={this.state.serverInfo} socket={this.socket}></GarrysMod>});
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
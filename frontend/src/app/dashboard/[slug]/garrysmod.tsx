import Image from "next/image";
import style from "./server.module.scss";
import { Component, ReactNode } from "react";
import { CxSocket } from "@/socket/cxsocket";
import { transGameToText } from "@/utils/information";

interface ServerData {
    gamemode: string,
    avgPing: number,
    id: string,
    plyCount: number,
    dashID: string,
    staffCount: number,
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
            messages: [],
            logs: []
        }

        props.socket.events.push(
            {
                "id": "gmodmessage",
                "do": (data: any) => {
                    this.setState((prevState: any) => ({
                        messages: [...prevState.messages, data]
                    }));
                }
            },
            {
                "id": "updateServerStatus",
                "do": (data: {id: string, online: boolean}) => {
                    this.setState({online: data.online});
                }
            },
            {
                "id": "updateServer",
                "do": (data: ServerData) => {
                    this.setState({serverInfo: data});
                }
            },
            {
                "id": "sendGameLog",
                "do": (data: {id: string, log: string}) => {
                    this.setState((prevState: any) => ({
                        logs: [...prevState.logs, data.log]  
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
                    <section className={style.board}>
                        {this.state.messages.map((message: Message, index: number) => {
                            return (
                                <div key={index} className={style.message}>
                                    <h2>{message.name} <span>({message.steamID})</span></h2>
                                    <p>{message.text}</p>
                                </div>
                            )
                        })}
                    </section>
                    <h1>Logs</h1>
                    <section className={style.board}>
                        {this.state.logs.map((log: string, index: number) => {
                            return (
                                <div key={index}>
                                    {log}
                                </div>
                            );
                        })}
                    </section>
                </section>
            </>
        );
    }
}

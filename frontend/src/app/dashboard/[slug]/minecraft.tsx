import Image from "next/image";
import style from "./server.module.scss";
import { Component, ReactNode } from "react";
import { CxSocket } from "@/socket/cxsocket";
import { transGameToText } from "@/utils/information";

interface ServerData {
    avgPing: number,
    id: string,
    plyCount: number,
    dashID: string,
    tps: number,
    staffCount: number,
}

interface Message {
    username: string,
    content: string,
    uuid: string
}
export class Minecraft extends Component<any, any> {
    constructor(props: {socket: CxSocket, serverData: ServerData}) {
        super(props);
        this.state = {
            serverInfo: {
                avgPing: 0,
                id: "",
                plyCount: 0,
                dashID: "",
                tps: 0,
                staffCount: 0,
            },
            serverData: props.serverData,
            messages: []
        }
        props.socket.events.push(
            {
                "id": "updateServerStatus",
                "do": (data: {id: string, online: boolean}) => {
                    this.setState({online: data.online});
                }
            },
            {
                "id": "mcmessage",
                "do": (data: any) => {
                    console.log(data);
                    this.setState((prevState: any) => ({
                        messages: [...prevState.messages, data]
                    }));
                }
            },
            {
                "id": "updateServer",
                "do": (data: ServerData) => {
                    this.setState({serverInfo: data});
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
                                <Image src="/dashboard/tick.svg" alt="Dashboard Image" fill></Image>
                            </div>
                            <span>Ticks per Second: {Math.round(this.state.serverInfo.tps)}</span>
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
                    </section>
                </nav>
                <section className={style.panel}>
                    <h1>Chat</h1>
                    <section className={style.chat}>
                        {this.state.messages.map((message: Message, index: number) => {
                            return (
                                <div key={index} className={style.message}>
                                    <section style={{"margin": "1rem 0 0 0", "display": "flex", "alignItems": "center", "gap": "1.5rem"}}>
                                        <div style={{"position": "relative", "width": "3rem", "height": "3rem"}}>
                                            <Image style={{"borderRadius": "50%"}} src={`https://mc-heads.net/avatar/${message.uuid}`} alt="Minecraft Head" fill></Image>
                                        </div>
                                        <h2>{message.username} <span>({message.uuid})</span></h2>
                                    </section>
                                    <p>{message.content}</p>
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
"use client";

import { NextPage } from "next";
import style from "./server.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { CxSocket } from "@/socket/cxsocket";
import Image from "next/image";

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

        if (req.status === 200) {
            router.refresh();
        }
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

export const GarrysMod = (props: {socket: CxSocket}) => {
    interface ServerData {
        gamemode: string,
        avgPing: number,
        id: string,
        plyCount: number,
        dashID: string,
        staffCount: 0,
        map: string
    }

    const [serverInfo, setServerInfo] = useState<ServerData>({
        "avgPing": 0,
        "gamemode": "Loading...",
        "map": "Loading...",
        "plyCount": 0,
        "staffCount": 0,
        "dashID": "",
        "id": ""
    });

    props.socket.events.push(
        {
            "id": "updateServer",
            "do": (data: any) => {
                console.log(data);
                setServerInfo(data);
            }
        }
    );

    return (
        <>
            <section className={style.panel}>
                <h1>General Information</h1>
                <section className={style.overview}>
                    <div className={style.card}>
                        <div className={style.img}>
                            <Image src="/dashboard/ping.svg" alt="Dashboard Image" fill></Image>
                        </div>
                        <span>Average Ping: {Math.round(serverInfo?.avgPing)}ms</span>
                    </div>
                    <div className={style.card}>
                        <div className={style.img}>
                            <Image src="/dashboard/map.svg" alt="Dashboard Image" fill></Image>
                        </div>
                        <span>Map: {serverInfo?.map}</span>
                    </div>
                    <div className={style.card}>
                        <div className={style.img}>
                            <Image src="/dashboard/players.svg" alt="Dashboard Image" fill></Image>
                        </div>
                        <span>Player Count: {serverInfo?.plyCount}</span>
                    </div>
                    <div className={style.card}>
                        <div className={style.img}>
                            <Image src="/dashboard/staff.svg" alt="Dashboard Image" fill></Image>
                        </div>
                        <span>Staff Count: {serverInfo?.staffCount}</span>
                    </div>
                    <div className={style.card}>
                        <div className={style.img}>
                            <Image src="/dashboard/game.svg" alt="Dashboard Image" fill></Image>
                        </div>
                        <span>Gamemode: {serverInfo?.gamemode}</span>
                    </div>
                </section>
            </section>
        </>
    );
}

export const SocketComponent = (props: {dashID: string, gameType: string}) => {
    const [online, setOnline] = useState<boolean>(false);

    const socket: CxSocket = new CxSocket(props.dashID);

    const views: any = {
        "gmod": <GarrysMod socket={socket}></GarrysMod>
    }
    
    socket.events.push(
        {
            "id": "initialConnect",
            "do": (data: any) => {
                socket.send({
                    "id": "clientConnect",
                    "dashID": props.dashID
                });
            }
        },
        {
            "id": "connectionResponse",
            "do": (data: {id: string, online: boolean}) => {
                setOnline(data.online)
            }
        },
        {
            "id": "updateServerStatus",
            "do": (data: {id: string, online: boolean}) => {
                setOnline(data.online)
            }
        }
    )
    socket.connect();

    if (!online) {
        return (
            <section style={{"display": "flex", "alignItems": "center", "justifyContent": "center", "width": "100%"}}>
                <h1 style={{"margin": "0", "fontSize": "4rem", "textAlign": "center"}}>Server currently offline!</h1>
            </section>
        )
    }

    return (
        <>
            {views[props.gameType]}
        </>
    );
}

const ServerPageClient: NextPage<{children: any}> = ({children}) => {
    return (
        <>
            <style jsx global>{`
                body {
                    overflow: hidden;
                }
            `}</style>
            {children}
        </>
    );
}

export default ServerPageClient;
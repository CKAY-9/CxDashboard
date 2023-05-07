"use client";

import { NextPage } from "next";
import style from "./server.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { CxSocket } from "@/socket/cxsocket";

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

export const SocketComponent = (props: {dashID: string}) => {
    const [online, setOnline] = useState<boolean>(false);
    const [serverInfo, setServerInfo] = useState<any>({});
    const socket: CxSocket = new CxSocket(props.dashID);
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
        },
        {
            "id": "updateServer",
            "do": (data: any) => {
                setServerInfo(data);
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
        <section className={style.panel}>
            <h1>General Information</h1>
            <section className={style.overview}>
                {Object.entries(serverInfo).map(([k, v]: any, i) => {
                    if (k === "id" || k === "dashID") return;
                    return (
                        <div key={i} className={style.card}>
                            <h1>{k}</h1>
                            <span>{v}</span>
                        </div>
                    )
                })}
            </section>
        </section>
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
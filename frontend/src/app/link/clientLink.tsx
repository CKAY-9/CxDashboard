"use client";

import { NextPage } from "next";
import style from "./link.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import { getCookie } from "@/utils/cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

interface GameProps {
    changeDashID: any;
}

const GMod = (props: GameProps) => {
    return (
        <>
            <title>Link - Garry&apos;s Mod</title>
            <ul style={{"textAlign": "left", "listStyle": "numeric"}}>
                <li>Download the CxDashboard Addon</li>
                <li>Edit the <code>cxdb/lua/dashboard_config.lua</code> file</li>
                <li>Restart your server</li>
                <li>Paste the unique server ID generated in the server console</li>
            </ul>
            <input onChange={(e: BaseSyntheticEvent) => props.changeDashID(e.target.value)} type="text" name="serverID" id="serverID" placeholder="Server ID" />
            <input type="submit" value="Connect Garry's Mod Server" style={{"width": "fit-content"}} />
        </>
    )
}

const Minecraft = (props: GameProps) => {
    return (
        <>
            <title>Link - Minecraft</title>
            <ul style={{"textAlign": "left", "listStyle": "numeric"}}>
                <li>Download the CxDashboard Plugin</li>
                <li>Edit the generated <code>plugins/cxdb/dashboardConfig.yml</code> file</li>
                <li>Restart your server</li>
                <li>Paste the unique server ID generated in the server console</li>
            </ul>
            <input onChange={(e: BaseSyntheticEvent) => props.changeDashID(e.target.value)}  type="text" name="serverID" id="serverID" placeholder="Server ID" />
            <input type="submit" value="Connect Minecraft Server" style={{"width": "fit-content"}} />
        </>
    )
}

const ClientLink: NextPage<{children: any}> = ({children}) => {
    const [game, setGame] = useState<string>("gmod");
    const [dashID, setDashID] = useState<string>("");

    const router = useRouter();

    const views: any = {
        "gmod": <GMod changeDashID={setDashID}></GMod>,
        "mc": <Minecraft changeDashID={setDashID}></Minecraft>
    }

    const changeView = (e: BaseSyntheticEvent) => {
        const view = document.getElementById("view");
        if (view === null) return;
        view.style.opacity = "0";
        setTimeout(() => {
            setGame(e.target.value);
            view.style.opacity = "1";
        }, 250);
    }

    const link = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const token = getCookie("token");
        if (token === null || token === undefined) {
            router.push("/login");
        }
        const request = await axios({
            "method": "POST",
            "url": process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/link",
            "data": {
                "dashID": dashID
            },
            "headers": {
                "authorization": `${token}`
            }
        });

        if (request.status === 200) {
            window.location.href = "/dashboard";
            router.push(`/dashboard`);
        }
    }
    
    return (
        <>
            <title>Link</title>
            {children}
            <main className={style.linkContainer}>
                <h1>Link your game server!</h1>
                <form onSubmit={link}>
                    <label htmlFor="Game">Select Game</label>
                    <select onChange={(e: BaseSyntheticEvent) => changeView(e)} name="game" id="game" defaultValue="gmod">
                        <option value="gmod">Garry&apos;s Mod</option>
                        <option value="mc">Minecraft</option>
                    </select>

                    <section id="view" className={style.view}>
                        {views[game]}
                    </section>
                </form>
            </main>
        </>
    );
}

export default ClientLink;
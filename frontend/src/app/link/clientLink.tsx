"use client";

import { NextPage } from "next";
import style from "./link.module.scss";
import { BaseSyntheticEvent, useState } from "react";

const GMod = () => {
    return (
        <>
            <title>Link - Garry's Mod</title>
            <ul style={{"textAlign": "left", "listStyle": "numeric"}}>
                <li>Download the CxDashboard Addon</li>
                <li>Edit the <code>cxdb/lua/dashboard_config.lua</code> file</li>
                <li>Restart your server</li>
                <li>Paste the unique server ID generated in the server console</li>
            </ul>
            <input type="text" name="serverID" id="serverID" placeholder="Server ID" />
            <input type="submit" value="Connect Garry's Mod Server" style={{"width": "fit-content"}} />
        </>
    )
}

const Minecraft = () => {
    return (
        <>
            <title>Link - Minecraft</title>
            <ul style={{"textAlign": "left", "listStyle": "numeric"}}>
                <li>Download the CxDashboard Plugin</li>
                <li>Edit the generated <code>plugins/cxdb/dashboardConfig.yml</code> file</li>
                <li>Restart your server</li>
                <li>Paste the unique server ID generated in the server console</li>
            </ul>
            <input type="text" name="serverID" id="serverID" placeholder="Server ID" />
            <input type="submit" value="Connect Minecraft Server" style={{"width": "fit-content"}} />
        </>
    )
}

const ClientLink: NextPage<{children: any}> = ({children}) => {
    const [game, setGame] = useState<string>("gmod");
    const views: any = {
        "gmod": <GMod></GMod>,
        "mc": <Minecraft></Minecraft>
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
    
    return (
        <>
            <title>Link</title>
            {children}
            <main className={style.linkContainer}>
                <h1>Link your game server!</h1>
                <form>
                    <label htmlFor="Game">Select Game</label>
                    <select onChange={(e: BaseSyntheticEvent) => changeView(e)} name="game" id="game" defaultValue="gmod">
                        <option value="gmod">Garry's Mod</option>
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
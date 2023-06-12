"use client";

import {ServerInfo, User} from "@/api/interfaces";
import axios from "axios";
import {BaseSyntheticEvent, useState} from "react";
import style from "./config.module.scss";

export const ConfigSite = (props: {serverData: ServerInfo, userData: User}) => {
    const [serverName, setServerName] = useState<string>(props.serverData.serverName);

    const updateServer = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const req = await axios({
            url: process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/update",
            method: "POST",
            data: {
                "serverName": serverName,
                "dashID": props.serverData.dashID
            },
            headers: {
                "authorization": `${props.userData.token}` 
            }
        });

        // TODO: Alert System
    }

    return (
        <>
            <form className={style.form} onSubmit={updateServer}>
                <input name="serverName" type="text" defaultValue={props.serverData.serverName} onChange={
                    (e: BaseSyntheticEvent) => setServerName(e.target.value) 
                }></input>
                <input type="submit" value="Update"></input>
            </form>
        </>
    )        
}

const ConfigClient = ({children}: any) => {
    return (
        <>
            {children}
        </>
    )
}

export default ConfigClient;

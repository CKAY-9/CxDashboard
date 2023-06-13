"use client";

import {
    ServerInfo, 
    User
} from "@/api/interfaces";
import Footer from "@/components/footer/footer";
import {CxSocket} from "@/socket/cxsocket";
import axios from "axios";
import Link from "next/link";
import {
    BaseSyntheticEvent, 
    useState
} from "react";
import style from "./config.module.scss";

export const ConfigSite = (props: {serverData: ServerInfo, userData: User}) => {
    const [serverName, setServerName] = useState<string>(props.serverData.serverName);
    const [users, setUsers] = useState<string[]>(props.serverData.allowedUsers);
    const [newUserID, setNewUserID] = useState<string>("");

    const updateServer = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const req = await axios({
            url: process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/update",
            method: "POST",
            data: {
                "serverName": serverName,
                "dashID": props.serverData.dashID,
                "users": users
            },
            headers: {
                "authorization": `${props.userData.token}` 
            }
        });
        // TODO: Alert System
    }    

    const appendNewUser = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        setUsers((old) => [...old, newUserID]); 
    
        const inputElm = document.getElementById("newUserID");
        if (inputElm !== null) {
            (inputElm as HTMLInputElement).value = "";        
        }
    }

    const removeServer = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        const req = await axios({
            url: process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/remove",
            method: "POST",
            data: {
                "dashID": props.serverData.dashID    
            },
            headers: {
                "authorization": `${props.userData.token}` 
            }
        });

        const socket = new CxSocket(props.serverData.dashID);
        socket.onOpen = () => {
            if (socket.socket === null) return;
            socket.socket.send(JSON.stringify({
                "id": "forceExitServer",
                "dashID": props.serverData.dashID
            }));   
            socket.socket.close();
        }

        if (req.status === 200) {
            window.location.href = "/dashboard";
        }
    }

    return (
        <>
            <form className={style.form} onSubmit={updateServer}>
                <section>
                    <h2>General</h2> 
                    <input name="serverName" type="text" defaultValue={props.serverData.serverName} onChange={
                        (e: BaseSyntheticEvent) => setServerName(e.target.value) 
                    }></input>
                </section>
                <section id="allowedUsers" className={style.members}>
                    <h2>Members</h2>
                    <div className={style.existingMembers}>
                        {users.map((user: string, index: number) => {
                            return (
                                <div key={index} className={style.member}>
                                    <span>{user}</span><button onClick={() => {
                                        setUsers(users.filter((u) => u !== user));
                                        // Might implement deletion here aswell
                                    }}>X</button>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                        <input type="text" id="newUserID" name="newUser" placeholder="User ID" onChange={
                                (e: BaseSyntheticEvent) => setNewUserID(e.target.value)
                            }></input>
                        <input type="button" value="Add User" onClick={appendNewUser}></input>
                    </div>
                </section>
                <input type="submit" value="Update"></input>
                <button onClick={removeServer} style={{
                    "padding": "1rem 2rem", 
                    "color": "white", 
                    "backgroundColor": "rgb(var(--danger))", 
                    "borderRadius": "10px"
                }}>Remove Server</button>
            </form>
        </>
    )        
}

const ConfigClient = ({children}: any) => {
    return (
        <>
            {children}
            <Footer></Footer>
        </>
    );
}

export default ConfigClient;

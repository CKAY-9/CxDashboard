"use client";

import {
    ServerInfo, 
    User
} from "@/api/interfaces";
import Footer from "@/components/footer/footer";
import {createNotification} from "@/components/notification/noti";
import {CxSocket} from "@/socket/cxsocket";
import axios, {AxiosResponse} from "axios";
import Image from "next/image";
import {
    BaseSyntheticEvent, 
    useState
} from "react";
import style from "./config.module.scss";

type UserData = {
    name: string;
    avatar: string;
    owner: boolean | undefined;
    id: string
}

export const ConfigSite = (props: {users: UserData[], serverData: ServerInfo, userData: User}) => {
    const [serverName, setServerName] = useState<string>(props.serverData.serverName);
    const [users, setUsers] = useState<UserData[]>(props.users);
    const [newUserID, setNewUserID] = useState<string>("");

    const updateServer = async (e: BaseSyntheticEvent) => {
        e.preventDefault();

        const userIDArr: string[] = [];
        for (const u of users) {
            userIDArr.push(u.id);
        }

        const req = await axios({
            url: process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/update",
            method: "POST",
            data: {
                "serverName": serverName,
                "dashID": props.serverData.dashID,
                "users": userIDArr
            },
            headers: {
                "authorization": `${props.userData.token}` 
            }
        });
            
        createNotification("Updated Server Config!", 5);
    }    

    const appendNewUser = async (e: BaseSyntheticEvent) => {
        // TODO: Sockets for adding user to server
        e.preventDefault();
        const req = await axios({
            url: process.env.NEXT_PUBLIC_DASHBOARD_API + "/user/publicInfo",
            method: "GET",
            params: {
                "userID": newUserID
            }
        });

        const user_: UserData = {
            name: req.data.name,
            id: newUserID,
            avatar: req.data.avatar,
            owner: undefined
        }

        setUsers((old) => [...old, user_]); 
        createNotification(`Added ${user_.name} to ${props.serverData.serverName}!`, 5);
        createNotification("Click update to save changes...", 3);

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

    const removeMember = async (e: BaseSyntheticEvent, memberToRemove: string) => {
        // TODO: Sockets for kicking member off
        const req = await axios({
            url: process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/removeMember",
            method: "POST",
            data: {
                "dashID": props.serverData.dashID,
                "memberToRemove": memberToRemove
            },
            headers: {
                "authorization": `${props.userData.token}`    
            }
        });
        
        if (req.status === 200) {
            setUsers(users.filter((u) => u.id !== memberToRemove));
            createNotification("Removed member from " + props.serverData.serverName, 5);
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
                        {users.map((user: UserData, index: number) => { 
                            return (
                                <section key={index} className={style.member}>
                                    {user.owner !== undefined 
                                    ?   <div className={style.avatar}>
                                            <Image src="/dashboard/owner.svg" style={{"filter": "invert(1)"}} alt={`Owner`} sizes="100%" width={0} height={0}></Image>
                                        </div>
                                    :   <div className={style.avatar}>
                                            <Image src="/dashboard/person.svg" style={{"filter": "invert(1)"}} alt={`Member`} sizes="100%" width={0} height={0}></Image>
                                        </div>
                                    }
                                    {user.avatar !== undefined &&
                                        <div className={style.avatar}>
                                            <Image src={user.avatar} alt={`${user.name}'s Avatar`} sizes="100%" width={0} height={0}></Image>
                                        </div>
                                    }
                                    <span>{user.name === undefined ? user.id : user.name}</span>
                                    {user.owner === undefined && 
                                        <button onClick={async (e) => {removeMember(e, user.id)}}>X</button>
                                    }
                                </section>
                            );
                        })}
                    </div>
                    <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                        <input type="text" id="newUserID" name="newUser" placeholder="User ID" onChange={
                                (e: BaseSyntheticEvent) => setNewUserID(e.target.value)
                        }></input>
                        <input type="button" onClick={appendNewUser} value="Add User"></input>
                    </div>
                </section>
                <input type="submit" value="Update"></input>
                <input type="button" onClick={removeServer} style={{
                    "padding": "1rem 2rem", 
                    "color": "white", 
                    "backgroundColor": "rgb(var(--danger))", 
                    "borderRadius": "10px"
                }} value="Delete Server"></input>
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

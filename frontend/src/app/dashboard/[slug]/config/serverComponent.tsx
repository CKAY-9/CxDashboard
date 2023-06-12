import {ServerInfo} from "@/api/interfaces";
import {getUserData} from "@/api/user";
import Header from "@/components/header/header";
import axios, {AxiosResponse} from "axios";
import Link from "next/link";
import {redirect} from "next/navigation";
import {BaseSyntheticEvent} from "react";
import {ConfigSite} from "./clientComponent";

const ConfigServer = async (props: {params: any}) => {
    const userData = await getUserData();
    const id = Number.parseInt(props.params.slug) - 1;

    if (userData === undefined) {
        redirect("/login");
    }

    if (userData.linkedServers.length <= id || id < 0) {
        redirect("/dashboard");
    }

    const serverData: AxiosResponse<ServerInfo> = await axios({
        "method": "GET",
        "url": process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/info",
        "headers": {
            "authorization": `${userData.token}`
        },
        "params": {
            "dashID": userData.linkedServers[id]
        }
    });


    return (
        <>
            <Header userData={userData}></Header> 
            <title>Server Config</title>

            <div className="container">
                <div style={{"display": "flex", "flexDirection": "column", "gap": "1rem"}}>
                    <Link href={`/dashboard/${id + 1}`} style={{"fontSize": "1.5rem"}}>Back</Link>
                    <h1 style={{"fontSize": "2rem", "margin": "5px 0"}}>Config</h1>
                </div>
                <div className="seperator"></div>
                <ConfigSite serverData={serverData.data} userData={userData}></ConfigSite>  
            </div>
        </>
    );     
}

export default ConfigServer;

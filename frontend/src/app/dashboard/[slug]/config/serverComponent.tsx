import {ServerInfo} from "@/api/interfaces";
import {getUserData} from "@/api/user";
import Header from "@/components/header/header";
import axios, {AxiosResponse} from "axios";
import {BaseSyntheticEvent} from "react";
import {ConfigSite} from "./clientComponent";

const ConfigServer = async (props: {params: any}) => {
    const userData = await getUserData();
    const id = Number.parseInt(props.params.slug) - 1;

    if (userData === undefined) {
        return;
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
                <h1>Config</h1>
                <ConfigSite serverData={serverData.data} userData={userData}></ConfigSite>  
            </div>
        </>
    );     
}

export default ConfigServer;

import { ServerInfo } from "@/api/interfaces";
import { getUserData } from "@/api/user";
import Header from "@/components/header/header";
import axios, { AxiosResponse } from "axios";
import { redirect } from "next/navigation";
import style from "./server.module.scss";
import { SetServerName, SocketComponent } from "./clientComponent";
import { transGameToText } from "@/utils/information";

interface ServerPageProps {
    params: any
}

const ServerPageServer = async (props: ServerPageProps) => {
    const id = Number.parseInt(props.params.slug) - 1;

    const userData = await getUserData();
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
            {serverData.data.serverName === "" &&
                <SetServerName dashID={serverData.data.dashID}></SetServerName>
            }
            <main className={style.dashboard}>
                <nav>
                    <h2>{serverData.data.serverName}</h2>
                    <h2>{transGameToText(serverData.data.game)}</h2>
                </nav>
                <SocketComponent dashID={serverData.data.dashID} gameType={serverData.data.game}></SocketComponent>
            </main>
        </>
    );
}

export default ServerPageServer;
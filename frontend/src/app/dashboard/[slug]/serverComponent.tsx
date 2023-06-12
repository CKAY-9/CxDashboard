import { ServerInfo } from "@/api/interfaces";
import { getUserData } from "@/api/user";
import Header from "@/components/header/header";
import axios, { AxiosResponse } from "axios";
import { redirect } from "next/navigation";
import style from "./server.module.scss";
import { SetServerName, SocketComponent } from "./clientComponent";
import { transGameToText } from "@/utils/information";
import Link from "next/link";
import Image from "next/image";

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
            <header>
                <Link href="/dashboard">Dashboard</Link>
                <Link href={`/dashboard/${id + 1}/config`}>Config</Link>
                <section>
                    <div className="user">
                        <span>{userData.name}</span>
                        <div className="icon">
                            <Image src={userData.avatar} alt="User Icon" fill></Image>
                        </div>
                    </div>
                </section>
            </header>
            {serverData.data.serverName === "" &&
                <SetServerName dashID={serverData.data.dashID}></SetServerName>
            }
            <main className={style.dashboard}>
                <SocketComponent id={id} serverInfo={serverData.data} dashID={serverData.data.dashID} gameType={serverData.data.game}></SocketComponent>
            </main>
        </>
    );
}

export default ServerPageServer;

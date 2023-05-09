import { getUserData } from "@/api/user";
import Header from "@/components/header/header"
import style from "./dashboard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { ServerInfo } from "@/api/interfaces";
import { transGameToText } from "@/utils/information";
import Footer from "@/components/footer/footer";

const DashboardPageServer = async () => {
    const data = await getUserData();
    if (data === undefined) {
        redirect("/login");
    }

    return (
        <>
            <Header userData={data}></Header>
            <title>{`Dashboard - ${data.name}`}</title>
            <main className="container">
                <section className={style.landing}>
                    <h1 style={{"fontSize": "3rem", "marginTop": "0"}}>DASHBOARD</h1>
                    <div className={style.icon}>
                        <Image src={data.avatar} alt="User Icon" fill></Image>
                    </div>
                    <h2>Hello, <span className={style.name}>{data.name}</span></h2>
                </section>
                {data.linkedServers.length >= 1 ?
                    <>
                        <Link href="/link" style={{"textAlign": "center"}}><h2>Link another server</h2></Link>
                        <div className="seperator"></div>
                        <h1 style={{"textAlign": "center"}}>Servers</h1>
                        <div className={style.servers}>
                            {data.linkedServers.map(async (server: string, index: number) => {
                                const req: AxiosResponse<ServerInfo> = await axios({
                                    "method": "GET",
                                    "url": process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/info",
                                    "headers": {
                                        "authorization": `${data.token}`
                                    },
                                    "params": {
                                        "dashID": server
                                    }
                                });

                                if (req.data === null) return;

                                return (
                                    <Link key={index} href={`/dashboard/${index + 1}`} className={style.serverPreview}>
                                        <h1>{req.data.serverName.length <= 0 ? <>Server name not set</> : <>{req.data.serverName}</> }</h1>
                                        <h2>{transGameToText(req.data.game)}</h2>
                                        <h3>{req.data.active ? <>Online</> : <>Offline</>}</h3>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                :
                    <>
                        <h1 style={{"textAlign": "center"}}>You have no linked servers!</h1>
                        <h2 style={{"textAlign": "center"}}><Link href="/link">Link a server</Link></h2>
                    </>
                }
            </main>
        </>
    )
}

export default DashboardPageServer;
import { getUserData } from "@/api/user";
import Header from "@/components/header/header"
import style from "./dashboard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
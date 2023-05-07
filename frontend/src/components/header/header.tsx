import Link from "next/link";
import Image from "next/image";
import HeaderSignout from "./headerClient";
import { User } from "@/api/interfaces";

interface HeaderProps {
    userData: User | undefined
}
const Header = (props: HeaderProps) => {
    return (
        <header>
            <section id="left">
                <Link href="/"><h3>CxDashboard</h3></Link>
            </section>
            <section id="right">
                {props.userData !== undefined && props.userData !== null ?
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <HeaderSignout></HeaderSignout>
                        <div className="user">
                            <span>{props.userData.name}</span>
                            <div className="icon">
                                <Image src={props.userData.avatar} alt="User Icon" fill></Image>
                            </div>
                        </div>
                    </>
                :
                    <>
                        <Link href="/login">Login</Link>
                    </>
                }
            </section>
        </header>
    );
}

export default Header;
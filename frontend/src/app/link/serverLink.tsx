import { getUserData } from "@/api/user";
import Header from "@/components/header/header";
import { redirect } from "next/navigation";

const ServerLink = async () => {
    const data = await getUserData();
    if (data === undefined) {
        redirect("/login");
    }

    return (
        <>
            <Header userData={data}></Header>
        </>
    );
}

export default ServerLink;
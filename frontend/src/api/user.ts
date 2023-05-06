import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios, { AxiosResponse } from "axios";

export interface User {
    avatar: string,
    name: string,
    token: string,
    id: string,
    linkedServers: any[]
}

export const getUserData = async () => {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (token === undefined) {
        return undefined;
    }

    const apiReq: AxiosResponse<User> = await axios({
        "method": "GET",
        "url": process.env.NEXT_PUBLIC_DASHBOARD_API + "/user/info",
        "headers": {
            "authorization": `${token?.value}`
        }
    });

    return apiReq.data;
}
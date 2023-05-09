import { cookies } from "next/headers";
import axios, { AxiosResponse } from "axios";
import { User } from "./interfaces";

export const getUserData = async (manualToken: string = ""): Promise<User | undefined> => {
    let token;
    if (manualToken === "") {
        const cookieStore = cookies();
        token = cookieStore.get("token")?.value;
    } else {
        token = manualToken
    }

    if (token === undefined) {
        return undefined;
    }

    const apiReq: AxiosResponse<any> = await axios({
        "method": "GET",
        "url": process.env.NEXT_PUBLIC_DASHBOARD_API + "/user/info",
        "headers": {
            "authorization": `${token}`
        }
    });

    return apiReq.data.user;
}
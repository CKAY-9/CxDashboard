import axios from "axios"
import { useRouter } from "next/router";

export const linkGameServer = async (dashID: string, token: string) => {
    if (dashID === null || token === null) return;
    const request = await axios({
        "method": "POST",
        "url": process.env.NEXT_PUBLIC_DASHBOARD_API + "/integration/link",
        "data": {
            "dashID": dashID
        },
        "headers": {
            "authorization": `${token}`
        }
    });

    if (request.status === 200) {
        useRouter().push(`/dashboard/${request.data.dashID}`);
    } else {
        console.log("error");
    }
}
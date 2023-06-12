import {db} from "../db/mongo"

export type ValidationResponse = {
    success: boolean,
    server?: any,
    user?: any
}

export const validateIntegration = async (dashID: string, userToken?: string, memberCheck: boolean = false): Promise<ValidationResponse> => {
    const server = await db.collection("servers").findOne({"dashID": dashID});
    if (!server) {
        return {success: false};
    }
   
    let user = undefined;
    if (userToken !== undefined) {
        user = await db.collection("users").findOne({"token": userToken});
        if (!user) {
            return {success: false};
        }

        if (!server.allowedUsers.includes(user.id) && memberCheck) {
            return {success: false};
        }
    }

    return {
        success: true,
        user: user,
        server: server
    }
}

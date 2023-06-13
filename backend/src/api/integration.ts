import { enc } from "crypto-js";
import { Router } from "express";
import client, { db } from "../db/mongo";
import {validateIntegration} from "./utils";
export const integrationRouter = Router();

integrationRouter.get("/dashID", async (req, res) => {
    try {
        const rawDashID = enc.Utf8.parse(req.query.game + (new Date().getTime()).toString() + (Math.random() * 99999999).toString());
        const dashID = enc.Base64.stringify(rawDashID);

        await db.collection("servers").insertOne({
            "game": req.query.game,
            "dashID": dashID,
            "serverName": "",
            "allowedUsers": [],
            "active": false
        });

        return res.status(200).json({"dashID": dashID});
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }
});

integrationRouter.post("/link", async (req, res) => {
    try {
        if (req.headers.authorization === undefined) {
            return res.status(401);
        }
        if (req.body.dashID === undefined) {
            return res.status(400);
        } 

        const token = req.headers.authorization;
        const dashID = req.body.dashID;

        const validate = await validateIntegration(dashID, token);
        if (!validate.success) {
            return res.status(401);
        }

        // Update Server and User
        await db.collection("users").updateOne({"token": token}, {$push: {"linkedServers": dashID}}, {"upsert": true});
        await db.collection("servers").updateOne({"dashID": dashID}, {$push: {"allowedUsers": validate.user.id}}, {"upsert": true});

        return res.status(200).json({"dashID": dashID, "id": validate.user.linkedServers.length + 1});
    } catch (ex) {
        console.log(ex);
        return res.status(500);
    }
});

integrationRouter.get("/info", async (req, res) => {
    try {
        if (req.headers.authorization === undefined) {
            return res.status(401);
        }
        if (req.query.dashID === undefined) {
            return res.status(400);
        } 

        const token = req.headers.authorization;
        const dashID = req.query.dashID;
        // Check user validity
        const user = await db.collection("users").findOne({"token": token});
        if (!user) {
            return res.status(401);
        }
        const serverInfo = await db.collection("servers").findOne({"dashID": dashID});
        return res.status(200).json(serverInfo);
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }
});

integrationRouter.post("/updateServerStatus", async (req, res) => {
    try {
        const dashID = req.body.dashID;
        const status = req.body.active;
        if (status === undefined || dashID === undefined) {
            return res.status(401);
        }
        if (!(await db.collection("servers").findOne({dashID: dashID}))) {
            await client.close();
            return res.status(400);
        }
        // update status
        await db.collection("servers").updateOne({dashID: dashID}, {$set: {"active": status}}, {upsert: true});

        return res.status(200).json({});
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }
});

integrationRouter.post("/changeServerName", async (req, res) => {
    try {
        if (req.headers.authorization === undefined) {
            return res.status(401);
        }
        if (req.body.dashID === undefined || req.body.serverName === undefined) {
            return res.status(400);
        } 

        const token = req.headers.authorization;
        const dashID = req.body.dashID;
        const serverName = req.body.serverName;
        
        const validate = await validateIntegration(dashID, token);
        if (!validate.success) {
            return res.status(401);
        }

        await db.collection("servers").updateOne({"dashID": dashID}, {$set: {"serverName": serverName}}, {upsert: true});

        return res.status(200).json({});
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }
});

integrationRouter.post("/update", async (req, res) => {
    try { 
        if (req.headers.authorization === undefined) {
            return res.status(401);
        }
        if (req.body.users === undefined || req.body.dashID === undefined || req.body.serverName === undefined) {
            return res.status(400);
        }
        
        const token = req.headers.authorization;
        const dashID = req.body.dashID;
        const serverName = req.body.serverName;
        const users: string[] = req.body.users;

        const validate = await validateIntegration(dashID, token);
        if (!validate.success) {
            return res.status(401);
        }

        for (const u of users) {
            if (validate.server.allowedUsers.includes(u)) continue;
            // Update user information
            await db.collection("users").updateOne({"id": u}, {$push: {"linkedServers": dashID}}, {upsert: true});
        }

        for (const u of validate.server.allowedUsers) {
            if (users.includes(u)) continue;
            // Delete user
            await db.collection("users").updateOne({"id": u}, {$pull: {"linkedServers": dashID}});
        }

        await db.collection("servers").updateOne({"dashID": dashID}, {$set: {"serverName": serverName, "allowedUsers": users}}, {upsert: true});

        return res.status(200).json({});
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }
});

integrationRouter.post("/remove", async (req, res) => {
    try { 
        if (req.headers.authorization === undefined) {
            return res.status(401);
        }
        if (req.body.dashID === undefined) {
            return res.status(400);
        }
        
        const token = req.headers.authorization;
        const dashID = req.body.dashID;

        const validate = await validateIntegration(dashID, token);
        if (!validate.success) {
            return res.status(401);
        }

        for (const temp of validate.server.allowedUsers) {
            console.log(temp);
            await db.collection("servers").updateOne({"id": temp}, {$pull: {"linkedServers": dashID}})
        }

        await db.collection("servers").deleteOne({"dashID": dashID});

        return res.status(200).json({});
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }

});

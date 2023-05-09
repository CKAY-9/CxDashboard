import { enc } from "crypto-js";
import { Router } from "express";
import client, { db } from "../db/mongo";
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
        // Check user validity
        const user = await db.collection("users").findOne({"token": token});
        if (!user) {
            return res.status(401);
        }
        // Check DashID
        if (!(await db.collection("servers").findOne({"dashID": dashID}))) {
            return res.status(404);
        }
        // Update Server and User
        await db.collection("users").updateOne({"token": token}, {$push: {"linkedServers": dashID}}, {"upsert": true});
        await db.collection("servers").updateOne({"dashID": dashID}, {$push: {"allowedUsers": user.id}}, {"upsert": true});

        return res.status(200).json({"dashID": dashID, "id": user.linkedServers.lenght + 1});
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

        return res.status(200);
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
        // Check user validity
        if (!(await db.collection("users").findOne({"token": token}))) {
            await client.close();
            return res.status(401);
        }
        if (!(await db.collection("servers").findOne({"dashID": dashID}))) {
            await client.close();
            return res.status(401);
        }

        await db.collection("servers").updateOne({"dashID": dashID}, {$set: {"serverName": serverName}}, {upsert: true});

        return res.status(200);
    } catch (ex) {
        console.log(ex)
        res.status(500);
    }
});
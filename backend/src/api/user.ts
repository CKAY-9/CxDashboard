import { Router } from "express";
import client, { db } from "../db/mongo";

export const userRouter = Router();

userRouter.get("/info", async (req, res) => {
    try {
        if (req.headers.authorization === undefined) {
            return res.status(200);
        }
        
        const token = req.headers.authorization;
        const userData = await db.collection("users").findOne({"token": token});

        return res.status(200).json({user: userData});
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }
});

userRouter.get("/publicInfo", async (req, res) => {
    try {
        const userData = await db.collection("users").findOne({"id": req.query.userID}); 

        const processed = {
            name: userData.name,
            avatar: userData.avatar,
            owner: undefined
        }

        if (req.query.dashID !== undefined) {
            const serverData = await db.collection("servers").findOne({"dashID": req.query.dashID});
            if (req.query.userID === serverData.owner) {
                processed.owner = true;
            }
        }

        return res.status(200).json(processed);
    } catch (ex) {
        console.log(ex);
        res.status(500);
    }
});

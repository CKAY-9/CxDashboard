import { Router } from "express";
import client, { db } from "../db/mongo";

export const userRouter = Router();

userRouter.get("/info", async (req, res) => {
    if (req.headers.authorization === undefined) {
        return res.status(200);
    }
    
    const token = req.headers.authorization;
    await client.connect();
    const userData = await db.collection("users").findOne({"token": token});
    await client.close();

    res.status(200).json(userData);
});
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
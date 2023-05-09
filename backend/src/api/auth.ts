import e, { Router } from "express";
import axios from "axios";
import client, { db } from "../db/mongo";
import { SHA256, MD5 } from "crypto-js";

export const authRouter = Router();

authRouter.get("/github", async (req, res) => {
    try {
        const code = req.query.code;
        // Get user token, used for email fetching
        const tokenRequest = await axios({
            "method": "POST",
            "url": "https://github.com/login/oauth/access_token",
            "params": {
                "code": code,
                "client_id": process.env.GITHUB_OAUTH_ID,
                "client_secret": process.env.GITHUB_OAUTH_SECRET
            }
        });
        // Parse token request
        const parsed = tokenRequest.data.split("&");
        const accessToken = parsed[0].split("=")[1];
        const tokenType = parsed[2].split("=")[1];
        
        // Fetch name and icon
        const userRequest = await axios({
            "method": "GET",
            "url": "https://api.github.com/user",
            "headers": {
                "authorization": `${tokenType} ${accessToken}`
            }
        });

        // Fetch email
        const emailRequest = await axios({
            "method": "GET",
            "url": "https://api.github.com/user/emails",
            "headers": {
                "authorization": `${tokenType} ${accessToken}`
            }
        });

        let email = "";
        for (const regEmail of emailRequest.data) {
            if (regEmail.primary) {
                email = regEmail.email
                break;
            }
        }

        let token = "";
        if ((await db.collection("users").findOne({"email": email}))) {
            // Update user
            await db.collection("users").updateOne({"email": email}, {
                $set: {
                    "avatar": userRequest.data.avatar_url,
                    "name": userRequest.data.login,
                    // TODO: Update email
                }
            }, {"upsert": true});
            token = (await db.collection("users").findOne({"email": email})).token;
        } else {
            // Create user
            token = SHA256(email + (Math.random() * Number.MAX_SAFE_INTEGER).toString() + new Date().getTime().toString()).toString();
            await db.collection("users").insertOne({
                "avatar": userRequest.data.avatar_url,
                "name": userRequest.data.login,
                "token": token,
                "email": email,
                "id": MD5((Math.random() * Number.MAX_SAFE_INTEGER).toString() + new Date().getTime().toString()).toString(),
                "linkedServers": [],
            })
        }

        return res.redirect(process.env.FRONTEND_URL + `/login?token=${token}`);
    } catch (ex) {
        console.log(ex);
        res.redirect(process.env.FRONTEND_URL + `/login`);
    }
});
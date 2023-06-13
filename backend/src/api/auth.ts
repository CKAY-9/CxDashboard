import e, { Router } from "express";
import axios, {AxiosResponse} from "axios";
import client, { db } from "../db/mongo";
import { SHA256, MD5 } from "crypto-js";

export const authRouter = Router();

authRouter.get("/discord", async (req, res) => {
    // Setup OAuth
    const ENDPOINT = "https://discord.com/api/v10";
    const ID = process.env.DISCORD_OAUTH_ID;
    const SECRET = process.env.DISCORD_OAUTH_SECRET;
    const REDIRECT = `${req.protocol}://${req.get("host")}/auth/discord`;
    const CODE = req.query.code;

    const data = {
        "client_id": ID,
        "client_secret": SECRET,
        "grant_type": "authorization_code",
        "code": CODE,
        "redirect_uri": REDIRECT
    }
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    } 
 
    try {
        const initReq: AxiosResponse<{
            access_token: string,
            token_type: string,
            expires_in: number,
            refresh_token: string,
            scope: string
        }> = await axios({
            url: `${ENDPOINT}/oauth2/token`,
            data: data,
            headers: headers,
            method: "POST"
        });

        if (initReq.data.access_token === undefined) {
            return res.redirect(process.env.FRONTEND_URL + "/login");
        }

        const userReq: AxiosResponse<{
            email: string,
            avatar: string,
            username: string,
            discriminator: string,
            id: string
        }> = await axios({
            url: `${ENDPOINT}/users/@me`,
            method: "GET",
            headers: {
                "authorization": `${initReq.data.token_type} ${initReq.data.access_token}`
            }
        });

        if (userReq.data.email === undefined) {
            return res.redirect(process.env.FRONTEND_URL + "/login");
        }

        const email = userReq.data.email;
        let token = "";
        if ((await db.collection("users").findOne({"email": email, "oauth": "discord"}))) {
            // Update user
            await db.collection("users").updateOne({"email": email}, {
                $set: {
                    "avatar": `https://cdn.discordapp.com/avatars/${userReq.data.id}/${userReq.data.avatar === undefined ? "index.png" : userReq.data.avatar}`,
                    "name": `${userReq.data.username}#${userReq.data.discriminator}`
                    // TODO: Update email
                }
            }, {"upsert": true});
            token = (await db.collection("users").findOne({"email": email})).token;
        } else {
            // Create user
            token = SHA256(email + (Math.random() * Number.MAX_SAFE_INTEGER).toString() + new Date().getTime().toString()).toString();
            await db.collection("users").insertOne({
                "avatar": `https://cdn.discordapp.com/avatars/${userReq.data.id}/${userReq.data.avatar === undefined ? "index.png" : userReq.data.avatar}`,
                "name": `${userReq.data.username}#${userReq.data.discriminator}`,
                "token": token,
                "email": email,
                "id": MD5((Math.random() * Number.MAX_SAFE_INTEGER).toString() + new Date().getTime().toString()).toString(),
                "linkedServers": [],
                "oauth": "discord"
            });
        }

        return res.redirect(process.env.FRONTEND_URL + `/login?token=${token}`);
    } catch (ex) {
        console.log(ex.toString());
        return res.status(500);
    }
});

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
        if ((await db.collection("users").findOne({"email": email, "oauth": "github"}))) {
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
                "oauth": "github"
            })
        }

        return res.redirect(process.env.FRONTEND_URL + `/login?token=${token}`);
    } catch (ex) {
        console.log(ex);
        res.redirect(process.env.FRONTEND_URL + `/login`);
    }
});

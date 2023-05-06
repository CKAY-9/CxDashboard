import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";

// .env setup
dotenv.config({"path": path.join(__dirname, "/../../.env")});

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1/";
const client = new MongoClient(uri);
export const db = client.db("cxdashboard");

export default client;
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1/";
const client = new MongoClient(uri);
export const db = client.db("cxdashboard");

export default client;
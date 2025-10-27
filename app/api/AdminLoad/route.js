import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let body = await request.json()
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri)
    try {
        const database = client.db('CurrentUser')
        const requestDatabase = client.db('NewUser')
        const requestCollection = requestDatabase.collection('Users')
        const usercollection = database.collection('Users')
        const AdminCollection = database.collection('Admins')
        const FindAdmin = await AdminCollection.findOne({ ID: body.ID })
        const FindAdmins = await AdminCollection.find().toArray()
        const FindUsers = await usercollection.find().toArray()
        const FindReqUsers = await requestCollection.find().toArray()
        return NextResponse.json({ "success": true, "AdminInfo": FindAdmin, "Admins": FindAdmins, "Users": FindUsers, "Requested": FindReqUsers })
    }
    finally {
        await client.close()
    }
}
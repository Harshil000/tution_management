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
        const UsersCollection = database.collection('Users')
        await UsersCollection.insertOne(body)
        await requestCollection.deleteOne({ ID: body.ID })
        return NextResponse.json({ "success": true })
    }
    finally {
        await client.close()
    }
}
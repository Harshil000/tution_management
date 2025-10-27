import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let body = await request.json()
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri)
    try {
        const database = client.db('CurrentUser')
        const collection = database.collection('Admins')
        await collection.updateOne({ID : body.MainAdminID} , {$set:{Type : "Inferior"}})
        await collection.updateOne({ID : body.AdminID} , {$set:{Type : "Main"}})
        return NextResponse.json({"success" : true})
    }
    finally {
        await client.close()
    }
}
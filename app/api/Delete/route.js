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
        const FindRequestedUseres = await requestCollection.findOne({ ID: body.ID })
        const FindAdmins = await AdminCollection.findOne({ ID: body.ID })
        if (FindRequestedUseres != null) {
            await requestCollection.deleteOne({ ID: body.ID })
            return NextResponse.json({ "success": true, "message": "Deleted Successfully" })
        } else if (FindAdmins != null) {
            await AdminCollection.deleteOne({ ID: body.ID })
            return NextResponse.json({ "success": true, "message": "Deleted Successfully" })
        } else {
            await usercollection.deleteOne({ ID: body.ID })
            return NextResponse.json({ "success": true, "message": "Deleted Successfully" })
        }
    }
    finally {
        await client.close()
    }
}
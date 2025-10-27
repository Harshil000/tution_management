import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let body = await request.json()
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri)
    try {
        const Currentdatabase = client.db('CurrentUser')
        const Currentcollection = Currentdatabase.collection('Users')
        const AdminCollection = Currentdatabase.collection('Admins')
        const FindUserData = await Currentcollection.findOne({ ID: body.ID })
        const FindAdminData = await AdminCollection.findOne({ ID: body.ID })
        if (FindUserData == null && FindAdminData != null) {
            return NextResponse.json({"success" : "Admin"})
        } else if (FindUserData != null && FindAdminData == null) {
            return NextResponse.json({"success" : "User"})
        } else {
            return NextResponse.json({"success" : false})
        }
    }
    finally {
        await client.close()
    }
}
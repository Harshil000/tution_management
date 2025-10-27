import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let body = await request.json()
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri)
    try {
        const Newdatabase = client.db('NewUser')
        const Newcollection = Newdatabase.collection('Users')
        const Currentdatabase = client.db('CurrentUser')
        const Currentcollection = Currentdatabase.collection('Users')
        const Admincollection = Currentdatabase.collection('Admins')
        const FindNewData = await Newcollection.findOne({ ID: body.ID })
        const CurrentNewData = await Currentcollection.findOne({ ID: body.ID })
        const AdminData = await Admincollection.findOne({ID : body.ID})
        if (FindNewData != null) {
            return NextResponse.json({ "success": "requested" })
        } else if (CurrentNewData != null || AdminData != null) {
            return NextResponse.json({ "success": "already" })
        } else {
            const SaveUser = await Newcollection.insertOne(body)
            return NextResponse.json({ 'success': true })
        }
    }
    finally {
        await client.close()
    }
}
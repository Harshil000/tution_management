import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let body
    try {
        body = await request.json()
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const uri = process.env.MONGO_URI
    if (!uri) {
        return NextResponse.json({ error: 'MONGO_URI not configured' }, { status: 500 })
    }

    const client = new MongoClient(uri)
    try {
        if (!body || !body.ID) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }
        const Newdatabase = client.db('NewUser')
        const Newcollection = Newdatabase.collection('Users')
        const Currentdatabase = client.db('CurrentUser')
        const Currentcollection = Currentdatabase.collection('Users')
        const Admincollection = Currentdatabase.collection('Admins')
        const FindNewData = await Newcollection.findOne({ ID: body.ID })
        const CurrentNewData = await Currentcollection.findOne({ ID: body.ID })
        const AdminData = await Admincollection.findOne({ ID: body.ID })
        if (FindNewData != null) {
            return NextResponse.json({ success: 'requested' })
        } else if (CurrentNewData != null || AdminData != null) {
            return NextResponse.json({ success: 'already' })
        } else {
            await Newcollection.insertOne(body)
            return NextResponse.json({ success: true })
        }
    } catch (err) {
        console.error('CreateUser error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
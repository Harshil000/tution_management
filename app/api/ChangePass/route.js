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
        if (!body || !body.ID || !body.password) {
            return NextResponse.json({ error: 'Missing ID or password' }, { status: 400 })
        }
        const Currentdatabase = client.db('CurrentUser')
        const Currentcollection = Currentdatabase.collection('Users')
        const AdminCollection = Currentdatabase.collection('Admins')
        const FindUserData = await Currentcollection.findOne({ ID: body.ID })
        const FindAdminData = await AdminCollection.findOne({ ID: body.ID })
        if (FindUserData == null && FindAdminData != null) {
            await AdminCollection.updateOne({ ID: body.ID }, { $set: { Password: body.password } })
            return NextResponse.json({ success: true })
        } else if (FindUserData != null && FindAdminData == null) {
            await Currentcollection.updateOne({ ID: body.ID }, { $set: { Password: body.password } })
            return NextResponse.json({ success: true })
        }
        return NextResponse.json({ success: false })
    } catch (err) {
        console.error('ChangePass error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
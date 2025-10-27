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
            return NextResponse.json({ error: 'Missing ID in request body' }, { status: 400 })
        }
        const database = client.db('CurrentUser')
        const requestDatabase = client.db('NewUser')
        const requestCollection = requestDatabase.collection('Users')
        const usercollection = database.collection('Users')
        const AdminCollection = database.collection('Admins')
        const FindAdmin = await AdminCollection.findOne({ ID: body.ID })
        const FindAdmins = await AdminCollection.find().toArray()
        const FindUsers = await usercollection.find().toArray()
        const FindReqUsers = await requestCollection.find().toArray()
        return NextResponse.json({ success: true, AdminInfo: FindAdmin, Admins: FindAdmins, Users: FindUsers, Requested: FindReqUsers })
    } catch (err) {
        console.error('AdminLoad error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
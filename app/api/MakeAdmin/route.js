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
        const database = client.db('CurrentUser')
        const requestDatabase = client.db('NewUser')
        const requestCollection = requestDatabase.collection('Users')
        const AdminCollection = database.collection('Admins')
        await AdminCollection.insertOne(body)
        await requestCollection.deleteOne({ ID: body.ID })
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('MakeAdmin error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
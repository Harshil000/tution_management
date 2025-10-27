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
        if (!body || !body.AdminID || !body.MainAdminID) {
            return NextResponse.json({ error: 'Missing AdminID or MainAdminID' }, { status: 400 })
        }
        const database = client.db('CurrentUser')
        const collection = database.collection('Admins')
        await collection.updateOne({ ID: body.MainAdminID }, { $set: { Type: 'Inferior' } })
        await collection.updateOne({ ID: body.AdminID }, { $set: { Type: 'Main' } })
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('ChangeAdmin error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
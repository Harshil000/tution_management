import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    // defensive handling: ensure request body is valid JSON and MONGO_URI is configured
    let body
    try {
        body = await request.json()
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const uri = process.env.MONGO_URI
    if (!uri) {
        // This commonly causes an internal server error where MongoClient tries to call
        // string methods like startsWith on an undefined URI. Return a clear error.
        return NextResponse.json({ error: 'MONGO_URI is not configured on the server' }, { status: 500 })
    }

    const client = new MongoClient(uri)
    try {
        const Currentdatabase = client.db('CurrentUser')
        const Currentcollection = Currentdatabase.collection('Users')
        const AdminCollection = Currentdatabase.collection('Admins')

        if (!body || !body.ID) {
            return NextResponse.json({ error: 'Missing ID in request body' }, { status: 400 })
        }

        const FindUserData = await Currentcollection.findOne({ ID: body.ID })
        const FindAdminData = await AdminCollection.findOne({ ID: body.ID })
        if (FindUserData == null && FindAdminData != null) {
            return NextResponse.json({ success: 'Admin' })
        } else if (FindUserData != null && FindAdminData == null) {
            return NextResponse.json({ success: 'User' })
        } else {
            return NextResponse.json({ success: false })
        }
    } catch (err) {
        console.error('LoginLoad error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    } finally {
        await client.close()
    }
}
import { NextResponse } from "next/server"
import { writeFile } from 'fs/promises'

export async function POST(request) {
    const data = await request.formData()
    const file = data.get('file')
    const index = data.get('index')

    if (!file) {
        return NextResponse.json({ "success": false })
    }

    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData)
    const path = `./public/Client/img${index}.jpg`

    await writeFile(path, buffer)
    return NextResponse.json({ "success": true })
}
"use client"
import { useState, useEffect } from "react"

const Page = () => {
    const [Admin, setAdmin] = useState({})
    useEffect(() => {
        const fetchdata = async () => {
            const res = await fetch('/api/AdminLoad', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ID: localStorage.getItem(`${decodeURIComponent("ID")}`) }),
            })
            const response = await res.json()
            setAdmin(response.AdminInfo)
        }
        fetchdata()
    }, [])

    return (
        <main className="w-full flex flex-col items-center justify-evenly" style={{ "height": "calc(100vh - 2.75rem)" }}>
            <div className="flex items-center justify-evenly w-full gap-4">
                <div className="flex flex-col items-center justify-center w-[30%] border-2 border-gray-700 cursor-pointer h-48 hover:scale-105 transition-all">
                    <iframe src="https://lottie.host/embed/b75f5880-3825-4e93-8c31-11948293b390/xgYD7oCHdA.json"></iframe>
                    <span className="font-semibold text-lg">Result</span>
                </div>
                <div className="flex flex-col items-center justify-center w-[30%] border-2 border-gray-700 cursor-pointer h-48 hover:scale-105 transition-all">
                    <lord-icon src="https://cdn.lordicon.com/zyzoecaw.json" trigger="hover" style={{ "width": "100px", "height": "150px" }}>
                    </lord-icon>
                    <span className="font-semibold text-lg">Course</span>
                </div>
                <div className="flex flex-col items-center justify-center w-[30%] border-2 border-gray-700 cursor-pointer h-48 hover:scale-105 transition-all">
                    <iframe src="https://lottie.host/embed/1e64f607-24bc-4e75-a568-17f017284c56/eq36ip81eg.json"></iframe>
                    <span className="font-semibold text-lg">Attendence</span>
                </div>
            </div>
            <div className="flex items-center justify-evenly w-full">
                <div>Analysis</div>
                <div>Fees</div>
            </div>
        </main>
    )
}

export default Page

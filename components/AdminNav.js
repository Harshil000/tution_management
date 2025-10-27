'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const AdminNav = () => {
    const [Admin, setAdmin] = useState({})
    const [showdropdown, setshowdropdown] = useState(false)
    const router = useRouter()
    useEffect(() => {
        const fetchdata = async () => {
            if (localStorage.getItem('ID') != null) {
                const res = await fetch('/api/AdminLoad', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ID: localStorage.getItem(`${decodeURIComponent("ID")}`) }),
                })
                const response = await res.json()
                setAdmin(response.AdminInfo)
            } else {
                router.push('/')
            }
        }
        fetchdata()
    }, [])

    const SignOut = () => {
        localStorage.removeItem(`ID`)
        router.push('/')
    }

    return (
        <div>
            <nav className="border-b-2 border-gray-700 h-11 flex items-center justify-between">
                <Link href={'Dashboard'}>
                    <lord-icon src="https://cdn.lordicon.com/cnpvyndp.json" trigger="hover" style={{ "width": "30px", "height": "30px", "marginLeft": "2rem" }}></lord-icon>
                </Link>
                <div className="mr-8">
                    <button onClick={() => { setshowdropdown(!showdropdown) }} onBlur={() => { setTimeout(() => { setshowdropdown(false) }, 100) }} id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName" className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 md:me-0 focus:ring-4 focus:ring-black ml-10" type="button">
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 me-2 rounded-full" src="../NotClient/CurrentUser.gif" alt="user photo" />
                        <span>{Admin.Name}</span>
                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>

                    <div id="dropdownAvatarName" className={`z-10 ${showdropdown ? "" : "hidden"} absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}>
                        <div className="px-4 py-3 text-sm text-gray-900 ">
                            <div className="font-medium ">Welcome</div>
                            <div className="truncate">{Admin.ID}</div>
                        </div>
                        <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
                            <li className="cursor-pointer">
                                <Link href={'adminsetting'} className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                            </li>
                        </ul>
                        <div className="py-2" onClick={SignOut}>
                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">Sign out</div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default AdminNav

"use client"
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const [NewUserName, setNewUserName] = useState('')
    const [NewUserID, setNewUserID] = useState('')
    const [NewUserPassword, setNewUserPassword] = useState('')
    const [CurrentUserID, setCurrentUserID] = useState('')
    const [CurrentUserPassword, setCurrentUserPassword] = useState('')
    const [loading, setloading] = useState(false)
    const CurrentShowPass = useRef()
    const CurrentPassInput = useRef()
    const NewShowPass = useRef()
    const NewPassInput = useRef()
    const NewUser = useRef()
    const NewUserButton = useRef()
    const signup = useRef()
    const signupButton = useRef()
    const router = useRouter()

    useEffect(() => {
        const fetchdata = async () => {
            setloading(true)
            const res = await fetch('api/LoginLoad', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ID: localStorage.getItem(`${decodeURIComponent("ID")}`) }),
            })
            const response = await res.json()
            setloading(false)
            if (response.success == "Admin") {
                window.location.href = '/Admin/Dashboard'
            } else if (response.success == "User") {
                router.push('/Dashboard')
            }
        }
        fetchdata()
    }, [])

    const VisibilityOfPass = (eye, text) => {
        if (eye.current.src.includes('show.png')) {
            eye.current.src = './NotClient/hide.png'
            text.current.type = 'text'
        } else {
            eye.current.src = './NotClient/show.png'
            text.current.type = 'password'
        }
    }

    const CreateUser = async (e) => {
        e.preventDefault()
        if (NewUserName == '' || NewUserID == '' || NewUserPassword == '') {
            toast.error('Fill Up all Enteries');
        } else {
            const res = await fetch('http://localhost:3000/api/CreateUser', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Name: NewUserName, ID: NewUserID, Password: NewUserPassword }),
            })
            const response = await res.json()
            if (response.success == true) {
                router.push(`/Authentication/CreateUser/${encodeURIComponent(NewUserName)}`)
            } else if (response.success == 'requested') {
                toast.info('Already requested for same ID');
            } else {
                toast.info('User Alreay Exists with same ID');
            }
            setNewUserName("")
            setNewUserID("")
            setNewUserPassword("")
        }
    }

    const SignUp = async (e) => {
        e.preventDefault()
        if (CurrentUserID == '' || CurrentUserPassword == '') {
            toast.error('Fill Up all Enteries');
        } else {
            const res = await fetch('api/Authenticate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ID: CurrentUserID, password: CurrentUserPassword }),
            })
            const responce = await res.json()
            if (responce.success == true) {
                localStorage.setItem("ID", `${encodeURIComponent(CurrentUserID)}`)
                router.push('/Dashboard')
            } else if (responce.success == "Admin") {
                setloading(true)
                localStorage.setItem("ID", `${encodeURIComponent(CurrentUserID)}`)
                window.location.href = '/Admin/Dashboard'
                setloading(false)
            } else if (responce.success == false) {
                toast.error("Check Your Password")
            } else {
                toast.info("Create New User , Or wait for admin to take you in if already created")
            }
        }
    }

    const HandleDisplay = (first, second, third, fourth) => {
        first.current.style.display = 'none'
        second.current.style.display = 'block'
        third.current.style.display = 'none'
        fourth.current.style.display = 'block'
    }
    return (
        <>
            {loading && <div className='h-sceen w-screen flex items-center justify-center'> <svg xmlns="http://www.w3.org/2000/svg" width="100" height="32" viewBox="0 0 120 30" fill="#000000">
                <circle cx="15" cy="15" r="10">
                    <animate attributeName="r" from="10" to="10" begin="0s" dur="0.8s" values="10;0;10" calcMode="linear" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="15" r="10" fillOpacity="0.3">
                    <animate attributeName="r" from="10" to="10" begin="0s" dur="0.8s" values="10;0;10" calcMode="linear" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
                </circle>
                <circle cx="105" cy="15" r="10">
                    <animate attributeName="r" from="10" to="10" begin="0s" dur="0.8s" values="10;0;10" calcMode="linear" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" />
                </circle>
            </svg>
            </div>
            }
            {!loading && <main className="h-screen flex flex-col justify-center items-center p-4">
                <ToastContainer position="top-right" theme="colored" />
                <marquee className="text-red-600 text-xl font-bold top-0 absolute">
                    <span className="flex items-center gap-2">
                        <img width={30} height={30} src="./NotClient/Warning.gif" alt="Not Found" />
                        Admin can see Your ID and Password
                    </span>
                </marquee>
                <div className="main w-full lg:w-[80vw] h-[80vh] border-2 border-gray-700 flex flex-col lg:flex-row items-center justify-evenly">
                    <div ref={NewUser} className="login transition-all lg:block w-full lg:w-[46%] lg:border-2 border-gray-700 h-fit lg:h-[90%] mb-4 lg:mb-0">
                        <div className="user flex justify-center items-center gap-2 my-4">
                            <img height={50} width={50} src="./NotClient//newUser.gif" alt="Not Found" />
                            <span className="text-indigo-600 font-semibold text-2xl lg:text-3xl">New User</span>
                        </div>
                        <div className="newUserInputs w-[95%] mx-auto flex flex-col gap-6 my-8 lg:my-16">
                            <div className="flex flex-col lg:flex-row gap-2">
                                <label htmlFor="newName" className="lg:w-[30%]">Name:</label>
                                <input id="newName" type="text" className="outline-none border-2 border-gray-500 w-full lg:w-[70%] px-2" placeholder="Enter Name" value={NewUserName} onChange={(e) => { setNewUserName(e.target.value) }} />
                            </div>
                            <div className="flex flex-col lg:flex-row gap-2">
                                <label htmlFor="newID" className="lg:w-[30%]">Create ID:</label>
                                <input id="newID" type="text" className="outline-none border-2 border-gray-500 w-full lg:w-[70%] px-2" placeholder="Create ID" value={NewUserID} onChange={(e) => { setNewUserID(e.target.value) }} />
                            </div>
                            <div className="flex flex-col lg:flex-row gap-2">
                                <label htmlFor="newPassword" className="lg:w-[30%]">Enter Password:</label>
                                <div className="relative w-full lg:w-[70%]">
                                    <input ref={NewPassInput} id="newPassword" type="password" className="outline-none border-2 border-gray-500 w-full px-2" placeholder="Create Password" value={NewUserPassword} onChange={(e) => { setNewUserPassword(e.target.value) }} />
                                    <span onClick={() => { VisibilityOfPass(NewShowPass, NewPassInput) }} className="absolute right-0 -top-1 cursor-pointer">
                                        <img ref={NewShowPass} className='p-1' width={35} src="./NotClient/show.png" alt="Show" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-indigo-600 hover:text-indigo-600 hover:bg-white text-white font-bold py-2 px-4 rounded mx-auto w-fit lg:w-[25%] flex items-center justify-center cursor-pointer transition-all border-2 hover:border-indigo-600" onClick={CreateUser}>Create User</div>
                    </div>
                    <div ref={signup} className="signup transition-all hidden lg:block w-full lg:w-[46%] lg:border-2 border-gray-700 h-fit lg:h-[90%]">
                        <div className="user flex justify-center items-center gap-2 my-4">
                            <img height={50} width={50} src="./NotClient//CurrentUser.gif" alt="Not Found" />
                            <span className="text-black font-semibold text-2xl lg:text-3xl">SignUp</span>
                        </div>
                        <div className="newUserInputs w-[95%] mx-auto flex flex-col gap-6 my-8 lg:my-16">
                            <div className="flex flex-col lg:flex-row gap-2">
                                <label htmlFor="currentID" className="lg:w-[30%]">Enter ID:</label>
                                <input id="currentID" type="text" className="outline-none border-2 border-black w-full lg:w-[70%] px-2" placeholder="Enter ID" value={CurrentUserID} onChange={(e) => { setCurrentUserID(e.target.value) }} />
                            </div>
                            <div className="flex flex-col lg:flex-row gap-2">
                                <label htmlFor="currentPassword" className="lg:w-[30%]">Enter Password:</label>
                                <div className="relative w-full lg:w-[70%]">
                                    <input ref={CurrentPassInput} id="currentPassword" type="password" className="outline-none border-2 border-black w-full px-2" placeholder="Enter Password" value={CurrentUserPassword} onChange={(e) => { setCurrentUserPassword(e.target.value) }} />
                                    <span onClick={() => { VisibilityOfPass(CurrentShowPass, CurrentPassInput) }} className="absolute right-0 -top-1 cursor-pointer">
                                        <img ref={CurrentShowPass} className='p-1' width={35} src="./NotClient/show.png" alt="Show" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black hover:text-black hover:bg-white border-2 hover:border-black text-white font-bold py-2 px-4 rounded mx-auto w-[25%] flex items-center justify-center cursor-pointer transition-all" onClick={SignUp}>SignUp</div>
                    </div>
                    <div className="flex items-center justify-center lg:hidden">
                        <div ref={signupButton} className="text-blue-700 underline transition-all" onClick={() => { HandleDisplay(NewUser, signup, signupButton, NewUserButton) }}>SignUp</div>
                        <div ref={NewUserButton} className="text-blue-700 underline hidden transition-all" onClick={() => { HandleDisplay(signup, NewUser, NewUserButton, signupButton) }}>Create User</div>
                    </div>
                </div>
            </main>
            }
        </>
    )
}

export default Page
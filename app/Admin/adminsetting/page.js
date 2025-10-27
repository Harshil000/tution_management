'use client'
import { useEffect, useState, useRef } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation"

const page = () => {
  const [Admin, setAdmin] = useState({})
  const [Admins, setAdmins] = useState([])
  const [Users, setUsers] = useState([])
  const [RequestingUsers, setRequestingUsers] = useState([])
  const [file, setFile] = useState()
  const [Loading, setloading] = useState(false)
  const [PasswordChange, setPasswordChange] = useState(false)
  const [MainAdminChange, setMainAdminChange] = useState(false)
  const [uploading, setuploading] = useState(false)
  const [Password, setPassword] = useState('')
  const [ToMakeMainID, setToMakeMainID] = useState('')
  const PassInput = useRef()
  const ShowPass = useRef()
  const confirmAlert = useRef()
  const router = useRouter()

  useEffect(() => {
    const fetchdata = async () => {
      setloading(true)
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
        setAdmins(response.Admins)
        setUsers(response.Users)
        setRequestingUsers(response.Requested)
      } else {
        router.push('/')
      }
      setloading(false)
    }
    fetchdata()
  }, [PasswordChange, MainAdminChange])

  const changePassword = async () => {
    if (Password != "") {
      const res = await fetch('/api/ChangePass', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID: localStorage.getItem(`${decodeURIComponent("ID")}`), password: Password }),
      })
      if (res.ok) {
        toast.success("Password Changed to " + Password + " Successfully")
        setPasswordChange(!PasswordChange)
        setPassword('')
      }
    } else {
      toast.error("Please Enter New Password")
    }
  }

  const VisibilityOfPass = (eye, text) => {
    if (eye.current.src.includes('show.png')) {
      eye.current.src = '../NotClient/hide.png'
      text.current.type = 'text'
    } else {
      eye.current.src = '../NotClient/show.png'
      text.current.type = 'password'
    }
  }

  const SignOut = () => {
    localStorage.removeItem(`ID`)
    router.push('/')
  }

  const onSubmit = async (e, index) => {
    e.preventDefault()
    if (file != undefined) {
      const extention = file.name.split('.').pop().toLowerCase();
      if (extention != 'jpg' && extention != 'jpeg' && extention != 'png') {
        toast.error("Upload valid Photo Document")
      } else {
        setuploading(true)
        const data = new FormData()
        data.set('file', file)
        data.set('index', index)
        const result = await fetch('/api/upload', {
          method: "POST",
          body: data
        })
        setuploading(false)
        const res = await result.json()
        if (res.success == true) {
          toast.success("Photo Uploaded Successfully")
        }
      }
    } else {
      toast.error("Choose File to upload")
    }
  }

  const ChangeDisplay = (ID) => {
    confirmAlert.current.style.display = "block"
    setToMakeMainID(ID)
  }

  const ChangeMainAdmin = async (ID, AdminID) => {
    confirmAlert.current.style.display = "none"
    const res = await fetch('/api/ChangeAdmin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "AdminID": ID, "MainAdminID": AdminID }),
    })
    setMainAdminChange(!MainAdminChange)
  }

  const Delete = async (ID) => {
    const res = await fetch('/api/Delete', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "ID": ID }),
    })
    location.reload()
  }

  const MakeAdmin = async (obj) => {
    const res = await fetch('/api/MakeAdmin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "Name": obj.Name, "ID": obj.ID, "Password": obj.Password, "Type": "Inferior" }),
    })
    location.reload()
  }

  const MakeUser = async (obj) => {
    const res = await fetch('/api/MakeUser', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "Name": obj.Name, "ID": obj.ID, "Password": obj.Password, "Type": "Inferior" }),
    })
    location.reload()
  }
  return (
    <>
      {Loading && <div className="flex items-center justify-center" style={{ "height": "calc(100vh - 2.75rem)" }}>
        <svg className="animate-spin h-24 w-24 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>}
      {!Loading &&
        <>
          <div ref={confirmAlert} className="hidden sticky top-11 h-fit w-fit px-6 py-4 bg-gray-800 text-white z-10 rounded-lg">
            <div className="flex flex-col items-center justify-evenly font-semibold">
              <span>Do You really want change Main Admin</span>
              <span>Only one main admin is allowed</span>
              <span>Do you want to Be Inferior Admin</span>
              <button onClick={() => { ChangeMainAdmin(ToMakeMainID, Admin.ID) }} className="px-4 py-2 w-[40%] text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition transform hover:scale-105">
                Confirm !
              </button>
            </div>
          </div>
          <ToastContainer position="top-right" theme="colored" />
          <div className="flex justify-evenly">
            <div className='p-8 w-[45%] flex flex-col justify-evenly items-center' style={{ "height": "calc(100vh - 2.75rem)" }}>
              <div className="h-[45%]">
                <h1 className='font-bold text-2xl mb-8'>Personal Details :-</h1>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className='label font-semibold text-xl'>Name :-</div>
                    <div className='value text-xl'>{Admin.Name}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className='label font-semibold text-xl'>ID :-</div>
                    <div className='value text-xl'>{Admin.ID}</div>
                  </div>
                  <div className="flex gap-2">
                    <label htmlFor="Password" className='label font-semibold text-xl'>Password :-</label>
                    <div className="flex flex-col lg:flex-row gap-2">
                      <div className="relative">
                        <input ref={PassInput} id="Password" type="password" className="outline-none border-2 border-gray-500 w-full px-2" placeholder={Admin.Password} value={Password} onChange={(e) => { setPassword(e.target.value) }} />
                        <span onClick={() => { VisibilityOfPass(ShowPass, PassInput) }} className="absolute right-0 -top-1 cursor-pointer">
                          <img ref={ShowPass} className='p-1' width={35} src="../NotClient/show.png" alt="Show" />
                        </span>
                      </div>
                    </div>
                    <div onClick={changePassword} className="button flex items-center justify-center cursor-pointer w-fit border border-black px-2 hover:text-white hover:bg-black transition-all">Change Password</div>
                  </div>
                  <div className="flex gap-2">
                    <div className='label font-semibold text-xl'>Type :-</div>
                    <div className='value text-xl'>{Admin.Type}</div>
                  </div>
                  <button onClick={SignOut} className="px-4 py-2 w-[20%] text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition transform hover:scale-105">
                    Sign Out
                  </button>
                </div>
              </div>
              <div className="h-[45%] w-full p-6 px-10 flex flex-col gap-2">
                <span className="font-semibold">
                  Number of Students :- {Users.length}
                </span>
                <span className="font-semibold">
                  Number of Admins :- {Admins.length}
                </span>
                <span className="font-semibold">
                  Number of Requesting Students :- {RequestingUsers.length}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-evenly w-[45%]" style={{ "height": "calc(100vh - 2.75rem)" }}>
              <h1 className="font-bold text-lg text-teal-600">Home Page Images</h1>
              {uploading && <div className="flex items-center justify-center h-full w-full">
                <svg className="animate-spin h-24 w-24 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>}
              {!uploading && <div className="flex flex-col items-center justify-evenly w-full h-full">
                <form onSubmit={(e) => { onSubmit(e, 1) }} className="flex gap-4">
                  <span className="font-semibold">Image-1</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 2) }} className="flex gap-4">
                  <span className="font-semibold">Image-2</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 3) }} className="flex gap-4">
                  <span className="font-semibold">Image-3</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 4) }} className="flex gap-4">
                  <span className="font-semibold">Image-4</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 5) }} className="flex gap-4">
                  <span className="font-semibold">Image-5</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 6) }} className="flex gap-4">
                  <span className="font-semibold">Image-6</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 7) }} className="flex gap-4">
                  <span className="font-semibold">Image-7</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 8) }} className="flex gap-4">
                  <span className="font-semibold">Image-8</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 9) }} className="flex gap-4">
                  <span className="font-semibold">Image-9</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
                <form onSubmit={(e) => { onSubmit(e, 10) }} className="flex gap-4">
                  <span className="font-semibold">Image-10</span>
                  <input type="file" name="file" onChange={(e) => { setFile(e.target.files?.[0]) }} />
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" value="upload" type="submit">
                    <lord-icon src="https://cdn.lordicon.com/smwmetfi.json" trigger="hover" colors="primary:#ffffff" style={{ "width": "24px", "height": "24px" }}></lord-icon>
                    <span className="ml-2">Upload</span>
                  </button>
                </form>
              </div>}
            </div>
          </div>
          <h2 className="mt-6 font-semibold text-lg ml-8 text-red-600">Admins :-</h2>
          <div className="mt-3 flex justify-center">
            <div className="w-[95vw] max-h-screen h-fit overflow-y-scroll flex flex-col">
              <div className="border-b-2 border-gray-700 w-full flex justify-evenly items-center">
                <span className="flex items-center justify-center w-[25%]">Name</span>
                <span className="flex items-center justify-center w-[20%]">ID</span>
                <span className="flex items-center justify-center w-[25%]">Password</span>
                <span className="flex items-center justify-center w-[5%]">Type</span>
                <span className="flex items-center justify-center w-[25%]">Controls</span>
              </div>
              {Admins.map(item => {
                return (
                  <div key={item.ID} className="w-full flex justify-evenly items-center h-12 border-b-2 border-gray-400">
                    <span className="flex items-center justify-center w-[25%]">{item.Name}</span>
                    <span className="flex items-center justify-center w-[20%]">{item.ID}</span>
                    <span className="flex items-center justify-center w-[25%]">{item.Password}</span>
                    <span className="flex items-center justify-center w-[5%]">{item.Type}</span>
                    <span className="flex items-center justify-evenly w-[25%]">
                      {Admin.Type == "Main" && <div className="flex w-full items-center justify-evenly">
                        {item.Type != "Main" && <div className="flex w-full items-center justify-evenly">
                          <span onClick={() => { ChangeDisplay(item.ID) }} className="flex items-center justify-center cursor-pointer">
                            <div className="button flex items-center justify-center cursor-pointer w-fit border border-black px-1 hover:text-white hover:bg-black transition-all">Make Main</div>
                          </span>
                          <span className="flex items-center justify-center cursor-pointer" onClick={() => { Delete(item.ID) }}>
                            <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" colors="primary:#c71f16" style={{ "width": "25px", "height": "25px" }}></lord-icon>
                          </span>
                        </div>}
                        {item.Type == "Main" && <div className="flex items-center justify-center text-gray-600">You are Main Admin</div>}
                      </div>}
                      {Admin.Type != "Main" && <div className="flex items-center justify-center">Only For Main Admin</div>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="w-full max-h-screen h-fit flex items-center justify-evenly">
            <div className="w-[46%] h-36 flex flex-col gap-4">
              <h2 className="mt-6 font-semibold text-lg ml-8 text-red-600">Students :-</h2>
              <div>
                <div className="border-b-2 border-gray-700 w-full flex justify-evenly items-center">
                  <span className="flex items-center justify-center w-[30%]">Name</span>
                  <span className="flex items-center justify-center w-[25%]">ID</span>
                  <span className="flex items-center justify-center w-[25%]">Password</span>
                  <span className="flex items-center justify-center w-[20%]">Controls</span>
                </div>
                {Users.map(item => {
                  return (
                    <div key={item.ID} className="w-full flex justify-evenly items-center h-12 border-b-2 border-gray-400">
                      <span className="flex items-center justify-center w-[30%] overflow-hidden">{item.Name}</span>
                      <span className="flex items-center justify-center w-[25%] overflow-hidden">{item.ID}</span>
                      <span className="flex items-center justify-center w-[25%] overflow-hidden">{item.Password}</span>
                      <span className="flex items-center justify-center w-[20%] overflow-hidden">
                        <span className="flex items-center justify-center cursor-pointer" onClick={() => { Delete(item.ID) }}>
                          <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" colors="primary:#c71f16" style={{ "width": "25px", "height": "25px" }}></lord-icon>
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="w-[46%] h-36 flex flex-col gap-4">
              <h2 className="mt-6 font-semibold text-lg ml-8 text-red-600">Requests :-</h2>
              <div>
                <div className="border-b-2 border-gray-700 w-full flex justify-evenly items-center">
                  <span className="flex items-center justify-center w-[25%]">Name</span>
                  <span className="flex items-center justify-center w-[25%]">ID</span>
                  <span className="flex items-center justify-center w-[25%]">Password</span>
                  <span className="flex items-center justify-center w-[25%]">Controls</span>
                </div>
                {RequestingUsers.map(item => {
                  return (
                    <div key={item.ID} className="w-full flex justify-evenly items-center h-12 border-b-2 border-gray-400">
                      <span className="flex items-center justify-center w-[25%] overflow-hidden">{item.Name}</span>
                      <span className="flex items-center justify-center w-[25%] overflow-hidden">{item.ID}</span>
                      <span className="flex items-center justify-center w-[25%] overflow-hidden">{item.Password}</span>
                      <span className="flex items-center justify-evenly w-[25%] overflow-hidden">
                        <span className="flex items-center justify-center cursor-pointer overflow-hidden" onClick={() => { MakeAdmin(item) }}>
                          <svg width="25" height="25" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <path id="shield-path" d="M100,10 L130,30 L170,50 L150,120 L100,190 L50,120 L30,50 L70,30 Z" fill="#007BFF" />
                            </defs>
                            <use href="#shield-path">
                              <animate attributeName="fill" values="#007BFF;#0056b3;#007BFF" dur="2s" repeatCount="indefinite" />
                            </use>
                            <circle cx="100" cy="70" r="20" fill="#FFD700">
                              <animate attributeName="cy" values="70;60;70" dur="1s" repeatCount="indefinite" />
                            </circle>
                            <rect x="80" y="90" width="40" height="60" fill="#FFD700">
                              <animate attributeName="y" values="90;85;90" dur="1s" repeatCount="indefinite" />
                            </rect>
                          </svg>
                        </span>
                        <span className="flex items-center justify-center cursor-pointer" onClick={() => { MakeUser(item) }}>
                          <dotlottie-player src="https://lottie.host/fcf5ef5b-fe45-41f3-b747-4ae0e6560559/onoStuHgaT.json" background="transparent" speed="1" style={{ "width": "25px", "height": "25px" }} loop autoplay></dotlottie-player>
                        </span>
                        <span className="flex items-center justify-center cursor-pointer" onClick={() => { Delete(item.ID) }}>
                          <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" colors="primary:#c71f16" style={{ "width": "25px", "height": "25px" }}></lord-icon>
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}

export default page
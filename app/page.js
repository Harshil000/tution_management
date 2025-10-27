'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const [loading, setloading] = useState(false)
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
  return (
    <>
      <nav className="h-12 flex items-center justify-center">
        <div className="logo font-bold text-lg">LOGO</div>
        <Link href={'Login'} className="bg-black right-1 absolute hover:text-black hover:bg-white border-2 hover:border-black text-white font-bold py-2 px-4 rounded mx-auto w-[6%] flex items-center justify-center cursor-pointer transition-all">SignUp</Link>
      </nav>
      <main>
        <h1 className="text-center font-semibold my-6 text-white">Top 10 Diamonds</h1>
        <div className="flex items-center justify-evenly my-5">
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img1.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img2.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img3.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img4.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img5.jpg)' }}></div>
        </div>
        <div className="flex items-center justify-evenly my-5">
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img6.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img7.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img8.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img9.jpg)' }}></div>
          <div className="bg-center bg-no-repeat bg-cover h-64 w-48" style={{ 'backgroundImage': 'url(../Client/img10.jpg)' }}></div>
        </div>
      </main>
    </>
  );
}
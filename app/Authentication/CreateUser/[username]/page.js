'use client'
import { useRouter } from 'next/navigation'
const page = ({ params }) => {
  const username = decodeURIComponent(params.username)
  const router = useRouter();
  return (
    <div className='bg-center bg-cover bg-no-repeat h-screen w-screen flex items-center justify-center flex-col gap-4' style={{ backgroundImage: `url('/background3.jpg')` }}>
      <div className='flex items-center justify-center gap-2 font-bold text-5xl'>
        <span> Welcome </span> <span className='text-red-600'>{username}</span>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <div className='font-semibold text-2xl'><span className='text-red-500'> SignUp </span> to Enter</div>
        <div className="bg-red-600 hover:text-red-600 hover:bg-white text-white font-bold py-2 px-4 rounded mx-auto w-[60%] flex items-center justify-center cursor-pointer transition-all border-2 hover:border-red-600" onClick={() => { router.push('/Login') }}>Sign Up</div>
      </div>
    </div>
  )
}

export default page
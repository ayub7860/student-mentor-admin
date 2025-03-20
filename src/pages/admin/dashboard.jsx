import React, { useState, useEffect } from 'react'

import 'aos/dist/aos.css'
import AOS from 'aos'
import { useNavigate } from 'react-router-dom'
import { fetchData } from '@/hooks/fetchData'
import { useMaterialTailwindController } from '@/context'

export function Dashboard () {
  const navigate = useNavigate()
  const [controller, dispatch] = useMaterialTailwindController()
  const { sidenavColor, theme } = controller
  const [formData, setFormData ] = useState('');
  useEffect(() => {
    document.title = 'Mentor | Dashboard'
    AOS.init({
      duration: 1200
    })
    Promise.all([
      fetchData(`${import.meta.env.VITE_API_URL}/api/adminApi/getMyProfile`, theme),
    ]).then(([ staffData ]) => {
      setFormData(staffData);
    });
  }, [])

  return (

    <>
      <div className='min-h-screen bg-opacity-10 bg-cover bg-center bg-fill'>
        <header className='bg-white shadow-2xl rounded-lg'>
          <div className='max-w-7xl mx-auto pt-5 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-xl font-bold text-gray-900' data-aos='zoom-out'>Home</h1>
          </div>
        </header>
        <main>
          <div className='max-w-7xl mx-auto py-3 sm:px-4 lg:px-4'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 col-span-3'>
                <div className='col-span-2'>
                <div className='bg-blue-400 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <p className='text-lg text-center  font-bold pt-4'>Welcome To Department System</p>                  
                </div> 
                </div>
                <div className='bg-green-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <h2 className='text-3xl font-bold'>{formData.totalTeacher}</h2>
                  <p className='text-sm font-bold pt-4'>Total Teachers</p>                 
                </div>
                <div className='bg-yellow-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <h2 className='text-3xl font-bold'>{formData.totalStudent}</h2>
                  <p className='text-sm font-bold pt-4'>Total Student</p>                 
                </div>
                {/* <div className='bg-gray-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <p className='text-sm font-bold pt-4'>Notice Issue</p>                  
                </div>                 */}
                {/* <div className='bg-purple-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                   <h2 className='text-3xl font-bold'>{formData.totalAccountActive + '/' +formData.totalAccount}</h2> 
                  <p className='text-sm font-bold pt-4'>Total Customer Accounts</p>                  
                </div>
                <div className='bg-red-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                   <h2 className='text-3xl font-bold'>{formData.totalAccountClose}</h2> 
                  <p className='text-sm font-bold pt-4'>Total Close Accounts</p>                  
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Dashboard

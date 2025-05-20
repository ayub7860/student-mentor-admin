import React, { useState, useEffect } from 'react'

import 'aos/dist/aos.css'
import AOS from 'aos'
import { useNavigate } from 'react-router-dom'
import { fetchData } from '@/hooks/fetchData'
import { useMaterialTailwindController } from '@/context'
import dayjs from 'dayjs'

export function Dashboard () {
  const navigate = useNavigate()
  const [controller, dispatch] = useMaterialTailwindController()
  const { sidenavColor, theme } = controller
  const [formData, setFormData ] = useState('');
  const [noticeData, setNoticeData ] = useState('');
  const [studentCount, setStudentCount ] = useState(0);
  
  useEffect(() => {
    document.title = 'Mentor | Dashboard'
    AOS.init({
      duration: 1200
    })
    Promise.all([
      fetchData(`${import.meta.env.VITE_API_URL}/api/teacherApi/getMyProfile`, theme),
    ]).then(([ staffData ]) => {
      console.log('staffData', staffData)
      setFormData(staffData.totalTeacher);
      setNoticeData(staffData.noticeTblObj[0])
      setStudentCount(staffData.totalStudent)
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
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 col-span-3'>
                <div className='col-span-3'>
                <div className='bg-white p-6 rounded-lg shadow-2xl text-black' data-aos='fade-left'>
                  <p className='text-lg font-bold '>Notice : </p>
                  { noticeData ? (
                    <>
                      <p className='text-lg font-bold '>{noticeData.title}</p>      
                      <p className='text-lg '>{noticeData.description}</p> 
                      <p className='text-lg font-bold'>
                        {dayjs(noticeData.updatedAt).format("YYYY-MM-DD h:mm A")}
                      </p>   
                     </>    
                  ):(
                    <p className='text-lg font-bold '>Notice not found</p>
                  )}        
                </div>    
                </div>
                <div onClick={ () => navigate('/teacher/student-master')} className='cursor-pointer bg-green-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <h2 className='text-3xl font-bold'>{studentCount}</h2>
                  <p className='text-sm font-bold pt-4'>Total Student</p>                 
                </div>
                {/* <div className='bg-yellow-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <p className='text-sm font-bold pt-4'>Class</p>                 
                </div>
                <div className='bg-gray-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <p className='text-sm font-bold pt-4'>Assignment & Exam</p>                  
                </div>                
                <div className='bg-purple-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <p className='text-sm font-bold pt-4'>Notice</p>                  
                </div>
                <div className='bg-red-800 p-6 rounded-lg shadow-2xl text-white' data-aos='fade-left'>
                  <p className='text-sm font-bold pt-4'>Report</p>                  
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
  }
export default Dashboard

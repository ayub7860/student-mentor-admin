import React from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  AdminSidenav,
  DashboardNavbar,
  Configurator,
  Footer,
  TeacherSidenav
} from '@/widgets/layout'
import axios from 'axios'
// import adminRoutesLinks from '@/admin-routes-links.jsx'
import teacherRoutesLinks from '@/teacher-routes-links.jsx'

import { useMaterialTailwindController } from '@/context/index.jsx'

export function Teacher () {
  const [controller, dispatch] = useMaterialTailwindController()
  const { openSidenav } = controller
  React.useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/checkTeacherToken`)
      .then((response) => {
        if (response.status !== 200) {
          navigate('/teacher/dashboard') 
          // window.location.replace(import.meta.env.VITE_LOGIN_URL)
        }
      })
      .catch((err) => {
        window.location.replace(import.meta.env.VITE_LOGIN_URL)
      })
  }, [])

  return (
    <div className='min-h-screen'>
      <img
        alt='Login Background'
        className='fixed inset-0 z-0 h-full w-full object-cover brightness-50 blur'
        src='\img\ready-back-school.jpg'
      />
      <TeacherSidenav/>
      <div
        className={`p-2 pl-2 xl:pl-4 ${
          openSidenav
            ? 'xl:ml-72'
            : ''
        }`}
      >
        <DashboardNavbar/>
        <Configurator/>
        <Routes>
          {teacherRoutesLinks.map(
            ({ layout, pages }) =>
              layout === 'teacher' &&
              pages.map(({ path, element }) => (
                <Route exact element={element} path={path}/>
              ))
          )}
        </Routes>
        <div className='text-blue-gray-600 dark:text-gray-200'>
          <Footer/>
        </div>
      </div>
    </div>
  )
}

Teacher.displayName = '/src/layout/teacher'

export default Teacher

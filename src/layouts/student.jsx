import React from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  AdminSidenav,
  DashboardNavbar,
  Configurator,
  Footer,
  TeacherSidenav,
  StudentSidenav
} from '@/widgets/layout'
import axios from 'axios'
// import adminRoutesLinks from '@/admin-routes-links.jsx'
import studentRoutesLinks from '@/student-routes-links'

import { useMaterialTailwindController } from '@/context/index.jsx'

export function Student () {
  const [controller, dispatch] = useMaterialTailwindController()
  const { openSidenav } = controller
  React.useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/checkStudentToken`)
      .then((response) => {
        if (response.status !== 200) {
          navigate('/student/dashboard') 
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
        src='/img/advita-background.webp'
      />
      <StudentSidenav/>
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
          {studentRoutesLinks.map(
            ({ layout, pages }) =>
              layout === 'student' &&
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

Student.displayName = '/src/layout/student'

export default Student

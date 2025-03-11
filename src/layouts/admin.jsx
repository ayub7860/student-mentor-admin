import React from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  AdminSidenav,
  DashboardNavbar,
  Configurator,
  Footer
} from '@/widgets/layout'
import axios from 'axios'
import adminRoutesLinks from '@/admin-routes-links.jsx'
import { useMaterialTailwindController } from '@/context/index.jsx'

export function Admin () {
  const [controller, dispatch] = useMaterialTailwindController()
  const { openSidenav } = controller
  React.useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/checkAdminToken`)
      .then((response) => {
        if (response.status !== 200) {
          window.location.replace(import.meta.env.VITE_LOGIN_URL)
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
      <AdminSidenav/>
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
          {adminRoutesLinks.map(
            ({ layout, pages }) =>
              layout === 'admin' &&
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

Admin.displayName = '/src/layout/admin'

export default Admin

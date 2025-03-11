import { Routes, Route, useNavigate } from 'react-router-dom'
import { Footer } from '@/widgets/layout'
import { SignIn } from '@/pages/auth/index.js'
import React from 'react'
import axios from 'axios'
export function Auth () {
  const navigate = useNavigate()
  React.useEffect(() => {
    document.title = 'Aditya-Anangha'
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/checkAdminToken`)
      .then((response) => {
        if (response.status === 200) {
          navigate('/admin/dashboard', { replace: true })
        } else {
          // window.location.replace(import.meta.env.VITE_LOGIN_URL)
        }
      })
      .catch((errors) => {
        // window.location.replace(import.meta.env.VITE_LOGIN_URL)
      })
  }, [])
  return (
    <div className='relative min-h-screen w-full bg-blue-gray-50/100 dark:bg-gradient-to-br from-blue-gray-600 to-blue-gray-700'>
      <div className='container relative z-40 mx-auto p-4' />
      <Routes>
        <Route exact element={<SignIn />} path={'/sign-in'} />
      </Routes>
      <div className='container absolute bottom-8 left-2/4 z-10 mx-auto -translate-x-2/4 text-white'>
        <Footer />
      </div>
    </div>
  )
}

Auth.displayName = '/src/layout/Auth.jsx'

export default Auth

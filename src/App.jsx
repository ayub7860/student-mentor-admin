import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
const Auth = React.lazy(() => import('@/layouts/auth'))
const Admin = React.lazy(() => import('@/layouts/admin'))

function App () {
  return (
    <Routes>
      <Route element={<Admin />} path='/admin/*' />
      <Route element={<Auth />} path='/auth/*' />
      <Route element={<Navigate replace to='/auth/sign-in' />} path='*' />
    </Routes>
  )
}

export default App

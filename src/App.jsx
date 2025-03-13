import { Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
const Auth = React.lazy(() => import('@/layouts/auth'))
const Admin = React.lazy(() => import('@/layouts/admin'))
const Teacher = React.lazy(() => import('@/layouts/teacher'))
const Student = React.lazy(() => import('@/layouts/student'))

function App () {
  return (
    <Routes>
      <Route element={<Admin />} path='/admin/*' />
      <Route element={<Auth />} path='/auth/*' />
      <Route element={<Navigate replace to='/auth/sign-in' />} path='*' />
      <Route element={<Teacher />} path='/teacher/*' />
      <Route element={<Student />} path='/student/*' />
    </Routes>
  )
}

export default App

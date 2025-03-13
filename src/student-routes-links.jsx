import {
  Dashboard,
  // Profile,
} from '@/pages/student'

export const studentRoutes = [
  {
    layout: 'student',
    pages: [
      {
        name: 'dashboard',
        path: '/dashboard',
        element: <Dashboard/>
      },     
      // {
      //   name: 'profile',
      //   path: '/profile',
      //   element: <Profile/>
      // },     
    ]
  }
]

export default studentRoutes

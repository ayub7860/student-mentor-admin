import {
  Dashboard,
  // Profile,
} from '@/pages/teacher'

export const teacherRoutes = [
  {
    layout: 'teacher',
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

export default teacherRoutes

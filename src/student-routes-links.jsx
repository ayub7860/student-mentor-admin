import {
  Dashboard,
  NoticeMaster,
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
      {
        name: 'notice',
        path: '/notice-master',
        element: <NoticeMaster/>
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

import {
  Dashboard,
  NoticeMaster,
  ProfileMaster,
  ReportMaster,
  StudentMaster,
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
      {
        name: 'notice',
        path: '/notice-master',
        element: <NoticeMaster/>
      }, 
      {
        name: 'student',
        path: '/student-master',
        element: <StudentMaster/>
      }, 
      {
        name: 'report',
        path: '/report-master',
        element: <ReportMaster/>
      },     
      {
        name: 'profile',
        path: '/profile',
        element: <ProfileMaster/>
      },     
    ]
  }
]

export default teacherRoutes

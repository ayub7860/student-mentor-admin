import {
  Dashboard,
  Profile,
  UserMaster,
  AddUserMaster,
  TeacherMaster,
  StudentMaster,
  NoticeMaster,
  AdminReportMaster,
} from '@/pages/admin'

export const adminRoutes = [
  {
    layout: 'admin',
    pages: [
      {
        name: 'dashboard',
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        name: 'Teacher master',
        path: '/teacher-master',
        element: <TeacherMaster/>
      },
      {
        name: 'Student master',
        path: '/student-master',
        element: <StudentMaster/>
      },
      {
        name: 'add user master',
        path: '/add-user-master',
        element: <AddUserMaster/>
      },
      {
        name: 'profile',
        path: '/profile',
        element: <Profile/>
      },
      {
        name: 'user master',
        path: '/user-master',
        element: <UserMaster/>
      },  
      {
        name: 'notice master',
        path: '/notice-master',
        element: <NoticeMaster/>
      },
      {
        name: 'report master',
        path: '/report-master',
        element: <AdminReportMaster/>
      },      
     
    ]
  }
]

export default adminRoutes

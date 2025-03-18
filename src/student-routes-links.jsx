import {
  Dashboard,
  NoticeMaster,
  StudentCompanyProfileMaster,
  StudentReportMaster,
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
      {
        name: 'company profile',
        path: '/company-profile-master',
        element: <StudentCompanyProfileMaster/>
      },
      {
        name: 'report master',
        path: '/student-report-master',
        element: <StudentReportMaster/>
      },  
    ]
  }
]

export default studentRoutes

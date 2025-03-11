import {
  Dashboard,
  Profile,
  UserMaster,
  AddUserMaster,
  CustomerMaster,
  CustomerProductMaster,
  ProductMaster,
  BranchMaster,
  StaffMaster,
  StaffPayoutMaster,
  AddStaffPayoutMaster,
  WalkinCustomerMaster,
  RecoveryMaster,
  StaffReportMaster,
  ExpiredCustomerProductMaster,
  EditCustomerProductMaster,
  EditExpiredCustomerProductMaster,
  TeacherMaster,
  StudentMaster,
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
        name: 'Customer master',
        path: '/customer-master',
        element: <CustomerMaster/>
      },
      {
        name: 'Walkin Customer master',
        path: '/walkin-customer-master',
        element: <WalkinCustomerMaster/>
      },
      {
        name: 'Customer product master',
        path: '/customer-product-master',
        element: <CustomerProductMaster/>
      },
      {
        name: 'Product master',
        path: '/product-master',
        element: <ProductMaster/>
      },
      {
        name: 'Branch master',
        path: '/branch-master',
        element: <BranchMaster/>
      },
      {
        name: 'Staff master',
        path: '/staff-master',
        element: <StaffMaster/>
      },
      {
        name: ' Staff payout master',
        path: '/staff-payout-master',
        element: <StaffPayoutMaster/>
      },
      {
        name: 'Add Staff payout master',
        path: '/add-staff-payout-master',
        element: <AddStaffPayoutMaster/>
      },
      {
        name: 'Recovery master',
        path: '/recovery-master',
        element: <RecoveryMaster/>
      },
      {
        name: 'staff report master',
        path: '/staff-report-master',
        element: <StaffReportMaster/>
      },
      {
        name: 'expired Customer product master',
        path: '/expired-customer-product-master',
        element: <ExpiredCustomerProductMaster/>
      },
      {
        name: 'edit customer product master',
        path: '/edit-customer-product-master/:id',
        element: <EditCustomerProductMaster/>
      },
      {
        name: 'edit customer product master',
        path: '/edit-customer-product-master/:id',
        element: <EditCustomerProductMaster/>
      },
      {
        name: 'edit expired Customer product master',
        path: '/edit-expired-customer-product-master/:id',
        element: <EditExpiredCustomerProductMaster/>
      },
    ]
  }
]

export default adminRoutes

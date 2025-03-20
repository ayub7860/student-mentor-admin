import React, { Suspense } from 'react'

const AdminMasterHolder = React.lazy(() => import('../../page-holder/admin-report-holder'))

export function AdminReportMaster () {
  return (
    <Suspense fallback={(
      <div className='flex flex-col items-center justify-center h-screen'>
        <img
            alt='img'
            className='w-48 h-18 object-contain mb-8 animate-bounce'
            src='/img/logo.png'
        />
        <div className='loading-text'>
          Loading, please wait...
        </div>
      </div>
        )}
    >
      <AdminMasterHolder />
    </Suspense>
  )
}

export default AdminReportMaster

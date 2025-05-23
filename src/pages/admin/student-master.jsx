import React, { Suspense } from 'react'

const StudentMasterHolder = React.lazy(() => import('../../page-holder/student-master-holder'))

export function StudentMaster () {
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
      <StudentMasterHolder />
    </Suspense>
  )
}

export default StudentMaster

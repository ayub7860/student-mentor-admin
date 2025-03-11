import React, { Suspense } from 'react'

const UserMasterHolder = React.lazy(() => import('../../page-holder/user-master-holder'))

export function UserMaster () {
  return (
    <Suspense fallback={(
      <div className='flex flex-col items-center justify-center h-screen'>
        <img
                    alt='Aditya-Anangha'
                    className='w-48 h-18 object-contain mb-8 animate-bounce'
                    src='/img/staff.webp'
        />
        <div className='loading-text'>
          Loading, please wait...
        </div>
      </div>
        )}
    >
      <UserMasterHolder />
    </Suspense>
  )
}

export default UserMaster

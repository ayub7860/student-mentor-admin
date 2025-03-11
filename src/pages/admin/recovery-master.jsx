import React, { Suspense } from 'react'

const RecoveryMasterHolder = React.lazy(() => import('../../page-holder/recovery-holder'))

export function RecoveryMaster () {
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
      <RecoveryMasterHolder />
    </Suspense>
  )
}

export default RecoveryMaster

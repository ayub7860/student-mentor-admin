import React, { Suspense } from 'react'

const WalkinCustomerMasterHolder = React.lazy(() => import('../../page-holder/walkin-customer-master-holder'))

export function WalkinCustomerMaster () {
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
      <WalkinCustomerMasterHolder />
    </Suspense>
  )
}

export default WalkinCustomerMaster

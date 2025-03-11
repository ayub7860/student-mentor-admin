import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom';

const EditExpiredCustomerProductMasterHolder = React.lazy(() => import('../../page-holder/edit-expired-customer-product-holder'))

export function EditExpiredCustomerProductMaster () {
    const { id } = useParams();
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
      <EditExpiredCustomerProductMasterHolder id={id}/>
    </Suspense>
  )
}

export default EditExpiredCustomerProductMaster

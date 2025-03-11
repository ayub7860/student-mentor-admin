import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom';

const EditCustomerProductMasterHolder = React.lazy(() => import('../../page-holder/edit-customer-product-holder'))

export function EditCustomerProductMaster () {
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
      <EditCustomerProductMasterHolder id={id}/>
    </Suspense>
  )
}

export default EditCustomerProductMaster

import React, { Fragment, useState } from 'react'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from '@material-tailwind/react'
import { CancelButton } from '@/widgets/components/index.js'

export default function View (props) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    image: ''
  })

  React.useEffect(() => {
    if (props.isViewOpen) {
      setFormData({
        // id: props.selectedRecord.id,
        // name: props.selectedRecord.userName,
        image: props.selectedRecord
        // image: (URL.createObjectURL(props.selectedRecord))
      })
    }
  }, [props.isViewOpen])

  const closeDialog = () => {
    props.setIsViewOpen(false)
  }

  return (
    <Fragment>
      <Dialog className='overflow-scroll z-40 bg-white' open={props.isViewOpen} size='xxl'>
        <DialogHeader className='bg-gray-100 text-center justify-center'>
          <DialogHeader className='bg-gray-100 text-center justify-center'>
            
            <button
                        className='absolute top-2 right-8 bg-transparent border-0 cursor-pointer'
                        title='Close'
                        onClick={closeDialog}
            >
              <span aria-hidden='true'>&times;</span>
            </button>
          </DialogHeader>
        </DialogHeader>
        <DialogBody divider>
          <div className='grid grid-cols-1 lg:grid-cols-1 gap-x-6 gap-y-3 w-full'>
            <label>Name:
              <span className='text-blue-500'>
                {'  ' + formData.name}
              </span>
            </label>
          </div>
          <div className='min-h-screen'>
            {formData.image
              ? (
                <iframe 
                  alt='Image'
                  className='h-auto w-full'
                  src={`${import.meta.env.VITE_API_URL}/api/publicApi/downloadDocument?name=${formData.image}`}
                />
                )
              : null}
          </div>

        </DialogBody>
        <DialogFooter className='bg-gray-100'>
          <CancelButton onClick={closeDialog} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import axios from 'axios'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option
} from '@material-tailwind/react'
import { toast } from 'react-toastify'
import { useMaterialTailwindController } from '@/context/index.jsx'
import { validateFormData } from '@/hooks/validation.js'
import { handleError } from '@/hooks/errorHandling.js'
import { useNavigate } from 'react-router-dom'
import { CancelButton, UpdateButton } from '@/widgets/components/index.js'

export default function Edit (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    id: '',
    customerName: '',
    customerMobile: '',
    customerAadhaar: '',
    customerAddress: '',
    pincode: '',
    city: '',
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        customerName: props.selectedRecord.customerName,
        customerMobile: props.selectedRecord.customerMobile,
        customerAadhaar: props.selectedRecord.customerAadhaar,
        customerAddress: props.selectedRecord.customerAddress,
        pincode: props.selectedRecord.pincode,
        city: props.selectedRecord.city,
      })
    }
  }, [props.isEditOpen])

  const closeDialog = () => {
    handleClose()
    props.setIsEditOpen(false)
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleClose = () => {
    setFormData({
      id: '0',
      customerName: '',
      customerMobile: '',
      customerAadhaar: '',
      customerAddress: '',
      pincode: '',
      city: '',
    })
  }

  const submitData = async () => {
    const validationRules = [
      { field: 'customerName', required: true, message: 'Please enter customer name.' },
      { field: 'customerAadhaar', required: true, message: 'Please enter aadhaar number.' },
      // { field: 'address', required: true, message: 'Please enter address.' },
      // { field: 'pincode', required: true, message: 'Please enter pincode.' },
      // { field: 'city', required: true, message: 'Please enter city.' },
      // { field: 'branchCode', required: true, message: 'Please enter branch code.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const {  
        customerName,
        customerMobile,
        customerAadhaar,
        customerAddress,
        pincode,
        city 
      } = formData
      const data = {
        id: formData.id,
        customerName,
        customerMobile,
        customerAadhaar,
        customerAddress,
        pincode,
        city,
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminCustomerApi/updateCustomer`, data)
        const statusMessages = {
          200: 'Customer Updated successfully.',
          201: 'Customer Updated successfully.',
          202: 'Your request has been received and is being processed. Please wait for the results.',
          204: 'The server couldn\'t find any information to show or work with.',
          default: 'Please try reloading the page.'
        }
        const message = statusMessages[response.status] || statusMessages.default
        props.refreshTableData()
        toast.success(message, { position: 'top-center', theme })
        closeDialog()
      } catch (error) {
        handleError(error, theme)
        switch (error.response.status) {
          case 401:
            window.location.replace(import.meta.env.VITE_LOGIN_URL)
            break
          case 403:
            navigate('/admin/dashboard', { replace: true })
            break
          default:
        }
      }
    }
  }

  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isEditOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Customer </DialogHeader>
        <DialogBody divider>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full'>
            <Input
              required
              label='Name'
              name='customerName'
              value={formData.customerName}
              onChange={handleTextChange}
            />
            <Input
              type='number'
              // required
              label='Mobile'
              name='customerMobile'
              value={formData.customerMobile}
              onChange={handleTextChange}
            />
            <Input 
              required
              type='number' 
              label='Customer Aadhaar' 
              name='customerAadhaar' 
              value={formData.customerAadhaar} 
              onChange={handleTextChange} />

            <Input
              // required
              label='Address'
              name='customerAddress'
              value={formData.customerAddress}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='Pincode'
              name='pincode'
              value={formData.pincode}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='City'
              name='city'
              value={formData.city}
              onChange={handleTextChange}
            />
          </div>
        </DialogBody>
        <DialogFooter className='bg-gray-100'>
          <CancelButton onClick={closeDialog} />
          <UpdateButton onClick={submitData} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

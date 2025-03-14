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
    name: '',
    mobile: '',
    otherNumber: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    password: '',
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        name: props.selectedRecord.name,
        mobile: props.selectedRecord.mobile,
        otherNumber: props.selectedRecord.otherNumber,
        email: props.selectedRecord.email,
        address: props.selectedRecord.address,
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
      name: '',
      mobile: '',
      otherNumber: '',
      email: '',
      address: '',
      pincode: '',
      city: '',
      password: '',
    })
  }

  const submitData = async () => {
    const validationRules = [
      { field: 'name', required: true, message: 'Please enter student name.' },
      { field: 'mobile', required: true, message: 'Please enter mobile number.' },
      { field: 'email', required: true, message: 'Please enter email.' },
      { field: 'address', required: true, message: 'Please enter address.' },
      { field: 'pincode', required: true, message: 'Please enter pincode.' },
      { field: 'city', required: true, message: 'Please enter city.' },
      // { field: 'password', required: true, message: 'Please enter password.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const {  name, mobile, address, otherNumber, email, pincode, city, password } = formData
      const data = {
        id: formData.id,
        name,
        mobile,
        otherNumber,
        email,
        address,
        pincode,
        city,
        password,
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacherApi/updateStudent`, data)
        const statusMessages = {
          200: 'Student Updated successfully.',
          201: 'Student Updated successfully.',
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
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Student </DialogHeader>
        <DialogBody divider>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full'>
        <Input
              required
              label='Name'
              name='name'
              value={formData.name}
              onChange={handleTextChange}
            />
            <Input
              type='number'
              required
              label='Mobile'
              name='mobile'
              value={formData.mobile}
              onChange={handleTextChange}
            />
            <Input
              type='number'
              // required
              label='Other Mobile'
              name='otherNumber'
              value={formData.otherNumber}
              onChange={handleTextChange}
            />
            <Input
              required
              label='email'
              name='email'
              value={formData.email}
              onChange={handleTextChange}
            />
            <Input
              required
              label='Address'
              name='address'
              value={formData.address}
              onChange={handleTextChange}
            />
            <Input
              required
              label='Pincode'
              name='pincode'
              value={formData.pincode}
              onChange={handleTextChange}
            />
            <Input
              required
              label='City'
              name='city'
              value={formData.city}
              onChange={handleTextChange}
            />
            <Input
              label='Password'
              name='password'
              value={formData.password}
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

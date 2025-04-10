import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option
} from '@material-tailwind/react'
import axios from 'axios'
import { validateFormData } from '@/hooks/validation.js'
import { handleError } from '@/hooks/errorHandling.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CancelButton, SubmitButton } from '@/widgets/components/index.js'
import { useMaterialTailwindController } from '@/context/index.jsx'

export default function Add (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    otherNumber: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    password: '',
  })

  const closeDialog = () => {
    setFormData({
      name: '',
      mobile: '',
      otherNumber: '',
      email: '',
      address: '',
      pincode: '',
      city: '',
      password: '',
    })
    props.setIsAddOpen(false)
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const submitData = async () => {
    // ✅ Manual regex validations
    const { mobile, email, pincode } = formData;

    if (!/^\d{10}$/.test(mobile)) {
      toast.error('Mobile number must be exactly 10 digits.', { position: 'top-center', theme });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.', { position: 'top-center', theme });
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Pincode must be exactly 6 digits.', { position: 'top-center', theme });
      return;
    }

  
    const validationRules = [
      { field: 'name', required: true, message: 'Please enter teacher name.' },
      { field: 'mobile', required: true, message: 'Please enter mobile number.' },
      { field: 'email', required: true, message: 'Please enter email.' },
      { field: 'address', required: true, message: 'Please enter address.' },
      { field: 'pincode', required: true, message: 'Please enter pincode.' },
      { field: 'city', required: true, message: 'Please enter city.' },
      { field: 'password', required: true, message: 'Please enter password.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const { name, mobile, otherNumber, email, address, pincode, city, password } = formData;
      const data = {
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
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminApi/addTeacher`, data)
        const statusMessages = {
          200: 'Teacher added successfully.',
          201: 'Teacher added successfully.',
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
      <Dialog className='z-40' handler={closeDialog} open={props.isAddOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Add Teacher </DialogHeader>
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
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10); // ✅ This will limit it to 10 digits
              }}
            />
            <Input
              type='number'
              // required
              label='Other Mobile'
              name='otherNumber'
              value={formData.otherNumber}
              onChange={handleTextChange}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10); // ✅ This will limit it to 10 digits
              }}
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
              type='number'
              label='Pincode'
              name='pincode'
              value={formData.pincode}
              onChange={handleTextChange}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 6); // ✅ This will limit it to 10 digits
              }}
            />
            <Input
              required
              label='City'
              name='city'
              value={formData.city}
              onChange={handleTextChange}
            />           
            <Input
              required
              label='Password'
              name='password'
              value={formData.password}
              onChange={handleTextChange}
            />
          </div>
        </DialogBody>
        <DialogFooter className='bg-gray-100'>
          <CancelButton onClick={closeDialog} />
          <SubmitButton onClick={submitData} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

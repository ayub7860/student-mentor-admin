import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input
} from '@material-tailwind/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { validateFormData } from '@/hooks/validation.js'
import { handleError } from '@/hooks/errorHandling.js'
import { useNavigate } from 'react-router-dom'
import { CancelButton, UpdateButton } from '@/widgets/components/index.js'
import { useMaterialTailwindController } from '@/context/index.jsx'

export default function Update (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  })

  const closeDialog = () => {
    setFormData({
      password: '',
      newPassword: '',
      confirmPassword: ''
    })
    props.setIsUpdateOpen(false)
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const submitData = async () => {
    const validationRules = [
      { field: 'password', message: 'Please enter existing password.' },
      { field: 'newPassword', message: 'Please enter new password.' },
      { field: 'confirmPassword', message: 'Please enter confirm password.' }
    ]
    let hasError = validateFormData(formData, validationRules, theme)
    if (formData.newPassword !== formData.confirmPassword) {
      hasError = true
      toast.warn('New password and confirm password not matched.', { position: 'top-center', theme })
    }
    if (!hasError) {
      const { password, newPassword } = formData
      const data = {
        password,
        newPassword
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/studentApi/updateMyPassword`, data)
        const statusMessages = {
          200: 'Password updated successfully.',
          201: 'Password updated successfully.',
          202: 'Your request has been received and is being processed. Please wait for the results.',
          204: 'The server couldn\'t find any information to show or work with.',
          default: 'Please try reloading the page.'
        }
        const message = statusMessages[response.status] || statusMessages.default
        toast.success(message, { position: 'top-center', theme })
        closeDialog()
      } catch (error) {
        handleError(error, theme)
        switch (error.response.status) {
          case 401:
            window.location.replace(import.meta.env.VITE_LOGIN_URL)
            break
          case 403:
            navigate('/student/dashboard', { replace: true })
            break
          default:
        }
      }
    }
  }

  const { password, newPassword, confirmPassword } = formData
  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isUpdateOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Student Password</DialogHeader>
        <DialogBody divider>
          <div className='flex flex-col gap-3 w-full'>
            <Input
                        required
                        label='Enter Existing Password'
                        name='password'
                        type={'password'}
                        value={password}
                        onChange={handleTextChange}
            />
            <Input
                        required
                        label='Enter New password'
                        name='newPassword'
                        type={'password'}
                        value={newPassword}
                        onChange={handleTextChange}
            />
            <Input
                        required
                        label='Enter Confirm Password'
                        name='confirmPassword'
                        type={'password'}
                        value={confirmPassword}
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

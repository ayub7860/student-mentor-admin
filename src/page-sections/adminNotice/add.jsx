import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Textarea
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
    title: '',
    description: '',
    type: ''
  })

  const closeDialog = () => {
    setFormData({
      title: '',
      description: '',
      type:''
    })
    props.setIsAddOpen(false)
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleChange = (value) => {
    setFormData({
      ...formData,
      type: value
    })
  };

  const submitData = async () => {
    const validationRules = [
      { field: 'title', required: true, message: 'Please enter ssubject of notice.' },
      { field: 'description', required: true, message: 'Please enter description.' },
      { field: 'type', required: true, message: 'Please select type.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const { title, description, type } = formData;
      const data = {
        title, description, type
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminApi/addNotice`, data)
        const statusMessages = {
          200: 'Notice added successfully.',
          201: 'Notice added successfully.',
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
        <DialogHeader className='bg-gray-100 text-center justify-center'>Add Notice </DialogHeader>
        <DialogBody divider>
          <div className='grid grid-cols-1 lg:grid-cols-1 gap-3 w-full'>
            <Input
              required
              label='Subject'
              name='title'
              value={formData.title}
              onChange={handleTextChange}
            />           
            <Textarea
              required
              label='description'
              name='description'
              value={formData.description}
              onChange={handleTextChange}
            />
            <div className="w-full">
              <Select label="Select type" onChange={handleChange} value={formData.type}>
                <Option value={3}>All</Option>
                <Option value={2}>Student</Option>
                <Option value={1}>Teacher</Option>                
              </Select>
            </div>
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

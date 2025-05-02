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
  Option,
  Textarea
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
    title: '',
    description: '',
    type: ''
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        title: props.selectedRecord.title,
        description: props.selectedRecord.description,
        type: props.selectedRecord.type,
      })
    }
  }, [props.isEditOpen])

  const closeDialog = () => {
    handleClose()
    props.setIsEditOpen(false)
  }

  const handleTextChange = (event) => {
    // setFormData({
    //   ...formData,
    //   [event.target.name]: event.target.value
    // })

    const { name, value } = event.target;

    // Fields that should only accept letters and spaces
    const textOnlyFields = ['title'];

    const newValue = textOnlyFields.includes(name)
      ? value.replace(/[^a-zA-Z\s]/g, '')
      : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  }

  const handleClose = () => {
    setFormData({
      id: '0',
      title: '',
      description: '',
      type:''
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
      const {  title, description, type } = formData
      const data = {
        id: formData.id,
        title, description, type
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminApi/updateNotice`, data)
        const statusMessages = {
          200: 'Notice Updated successfully.',
          201: 'Notice Updated successfully.',
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
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Branch </DialogHeader>
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
          <UpdateButton onClick={submitData} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

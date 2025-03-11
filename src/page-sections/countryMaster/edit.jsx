import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import axios from 'axios'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input
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
    name: ''
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        name: props.selectedRecord.name
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
      name: ''
    })
  }

  const submitData = async () => {
    const validationRules = [
      { field: 'name', required: true, message: 'Please enter country name.' }
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const { name } = formData
      const data = {
        id: formData.id,
        name
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/countryApi/updateCountry`, data)
        const statusMessages = {
          200: 'Country Updated successfully.',
          201: 'Country Updated successfully.',
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
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Country </DialogHeader>
        <DialogBody divider>
          <div className='flex flex-col gap-3 w-full'>
            <Input
                            required
                            label='Name'
                            name='name'
                            value={formData.name}
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

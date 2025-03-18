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
import AsyncSelect from 'react-select/async'
import { fetchData } from '@/hooks/fetchData'

export default function Add (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    task: '',
    fromDate: '',
    toDate:'',
    description: '',
  })

  const closeDialog = () => {
    setFormData({
      task: '',
      fromDate: '',
      toDate:'',
      description: '',
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
    const validationRules = [
      { field: 'fromDate', required: true, message: 'Please enter from date.' },
      { field: 'toDate', required: true, message: 'Please enter to date.' },
      { field: 'task', required: true, message: 'Please enter task.' },
      { field: 'description', required: true, message: 'Please enter weekly description.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const { fromDate, toDate, description, task } = formData;
      const data = {
        fromDate, toDate, description, task 
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/studentApi/addWeeklyReport`, data)
        const statusMessages = {
          200: 'Report added successfully.',
          201: 'Report added successfully.',
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
            navigate('/student/dashboard', { replace: true })
            break
          default:
        }
      }
    }
  }

  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isAddOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Add Weekly Report </DialogHeader>
        <DialogBody divider>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full'>
            <Input
              type='date'
              required
              label='From Date'
              name='fromDate'
              value={formData.fromDate}
              onChange={handleTextChange}
            />
            <Input
              type='date'
              required
              label='to Date'
              name='toDate'
              value={formData.toDate}
              onChange={handleTextChange}
            />
            <div className='col-span-2'>           
             <Input          
              required
              label='Task'
              name='task'
              value={formData.task}
              onChange={handleTextChange}
            />
            </div>
            <div className='col-span-2'>
            <Textarea
              required
              rows={10}
              label='Weekly Description'
              name='description'
              value={formData.description}
              onChange={handleTextChange}
            />
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

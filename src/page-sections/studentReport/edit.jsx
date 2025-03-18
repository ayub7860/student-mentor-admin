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
import AsyncSelect from 'react-select/async'
import { fetchData } from '@/hooks/fetchData'

export default function Edit (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    id: '',
    task: '',
    fromDate: '',
    toDate:'',
    description: '',
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        task: props.selectedRecord.task,
        fromDate: props.selectedRecord.fromDate,
        toDate: props.selectedRecord.toDate,
        description: props.selectedRecord.description,
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
      task: '',
      fromDate: '',
      toDate:'',
      description: '',
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
      const {  fromDate, toDate, description, task} = formData
      const data = {
        id: formData.id,
        fromDate, toDate, description, task
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/studentApi/updateWeeklyReport`, data)
        const statusMessages = {
          200: 'Report Updated successfully.',
          201: 'Report Updated successfully.',
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
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Report </DialogHeader>
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
          <UpdateButton onClick={submitData} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

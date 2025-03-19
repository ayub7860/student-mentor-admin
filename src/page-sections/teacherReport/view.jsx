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
  Typography,
  Button
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
    fromDate: '',
    toDate: '',
    task: '',
    description: '',
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        fromDate: props.selectedRecord.fromDate,
        toDate: props.selectedRecord.toDate,
        task: props.selectedRecord.task,
        description: props.selectedRecord.description,
      })
    }
  }, [props.isEditOpen])

  console.log('props.selectedRecord', props.selectedRecord.id)

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
      fromDate: '',
      toDate: '',
      task: '',
      description: '',
    })
  }

  const submitData = async () => {
      const { id } = formData;
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacherApi/approveStudentReport`, {id : id})
        const statusMessages = {
          200: 'Weekly report Approved successfully.',
          201: 'Weekly report Approved successfully.',
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

  return (
    <Fragment className='bg-white'>
      <Dialog className='z-40 bg-white' handler={closeDialog} open={props.isEditOpen} size={isMobile ? 'xxl' : 'xxl'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Student </DialogHeader>
        <DialogBody divider>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full'>
                <Typography>from Date : {formData.fromDate}</Typography>
                <Typography>To Date : {formData.toDate}</Typography>
                <div className='col-span-2'>
                <Typography>Project Task : {formData.task}</Typography>
                </div>
                <div className='col-span-2'>
                <Typography>Project Description : {formData.description}</Typography>
                </div>                
            </div>
        </DialogBody>
        <DialogFooter className='bg-gray-100'>
          {/* <CancelButton onClick={closeDialog} />
          <UpdateButton onClick={submitData} /> */}
          <CancelButton onClick={closeDialog} />
          <Button onClick={submitData} className='bg-green-500'>
            Approve
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

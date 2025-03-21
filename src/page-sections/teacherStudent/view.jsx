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
import dayjs from 'dayjs'

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
        companyName: props.selectedRecord.companyName,
        companyLocation: props.selectedRecord.companyLocation,
        companyDescription: props.selectedRecord.companyDescription,
        projectName: props.selectedRecord.projectName,
        projectDescription: props.selectedRecord.projectDescription,
        joiningDate: props.selectedRecord.joiningDate,
        endDate: props.selectedRecord.endDate,
        internshipLetter: props.selectedRecord.internshipLetter,
        projectLetter: props.selectedRecord.projectLetter,
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
      const { id } = formData
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacherApi/updateStudent`, id)
        const statusMessages = {
          200: 'Student Approved successfully.',
          201: 'Student Approved successfully.',
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
                <Typography>Company Name : {formData.companyName}</Typography>
                <Typography>Company Location : {formData.companyLocation}</Typography>
                <Typography>Project Name : {formData.projectName}</Typography>
                <Typography>Project Description : {formData.projectDescription}</Typography>
                <Typography>Internship Joining Date : {dayjs(formData.joiningDate).format("YYYY-MM-DD h:mm A")}</Typography>
                <Typography>Internship End Date : {dayjs(formData.endDate).format("YYYY-MM-DD h:mm A")}</Typography>

                <div className='min-h-screen'>
                    {formData.internshipLetter
                    ? (
                        <iframe 
                        alt='Image'
                        className='h-auto w-full'
                        src={`${import.meta.env.VITE_API_URL}/api/publicApi/downloadDocument?name=${formData.internshipLetter}`}
                        />
                        )
                    : null}
                </div>
                <div className='min-h-screen'>
                    {formData.projectLetter
                    ? (
                        <iframe 
                        alt='Image'
                        className='h-auto w-full'
                        src={`${import.meta.env.VITE_API_URL}/api/publicApi/downloadDocument?name=${formData.projectLetter}`}
                        />
                        )
                    : null}
                </div>

            </div>
        </DialogBody>
        <DialogFooter className='bg-gray-100'>
          {/* <CancelButton onClick={closeDialog} />
          <UpdateButton onClick={submitData} /> */}
          <CancelButton onClick={closeDialog} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

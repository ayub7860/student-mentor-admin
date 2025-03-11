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
    address: '',
    pincode: '',
    city: '',
    staffCode: '',
    joiningDate: '',
    leavingDate: '',
    division: '',
    password: '',
    target: '',
    lastYearTarget: ''
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        name: props.selectedRecord.name,
        mobile: props.selectedRecord.mobile,
        otherNumber: props.selectedRecord.otherNumber,
        address: props.selectedRecord.address,
        pincode: props.selectedRecord.pincode,
        city: props.selectedRecord.city,
        staffCode: props.selectedRecord.staffCode,
        joiningDate: props.selectedRecord.joiningDate,
        leavingDate: props.selectedRecord.leavingDate,
        division: props.selectedRecord.division,
        target: props.selectedRecord.target,
        lastYearTarget: props.selectedRecord.lastYearTarget,
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
      address: '',
      pincode: '',
      city: '',
      staffCode: '',
      joiningDate: '',
      leavingDate: '',
      password: '',
      division: '',
      target: '',
      lastYearTarget: ''
    })
  }

  const submitData = async () => {
    const validationRules = [
      { field: 'name', required: true, message: 'Please enter staff name.' },
      { field: 'mobile', required: true, message: 'Please enter mobile number.' },
      // { field: 'address', required: true, message: 'Please enter address.' },
      // { field: 'pincode', required: true, message: 'Please enter pincode.' },
      // { field: 'city', required: true, message: 'Please enter city.' },
      { field: 'staffCode', required: true, message: 'Please enter staff code.' },
      // { field: 'division', required: true, message: 'Please enter division.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const {  name, mobile, otherNumber, address, pincode, city, staffCode, joiningDate, leavingDate, password, division, target, lastYearTarget,} = formData
      const data = {
        id: formData.id,
        name,
        mobile,
        otherNumber,
        address,
        pincode,
        city,
        staffCode,
        joiningDate,
        leavingDate,
        division,
        password,
        target,
        lastYearTarget,
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/updateAdminStaff`, data)
        const statusMessages = {
          200: 'Staff Updated successfully.',
          201: 'Staff Updated successfully.',
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
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Staff </DialogHeader>
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
              label='Other Mobile Number'
              name='otherNumber'
              value={formData.otherNumber}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='Address'
              name='address'
              value={formData.address}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='Pincode'
              name='pincode'
              value={formData.pincode}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='City'
              name='city'
              value={formData.city}
              onChange={handleTextChange}
            />
            <Input
              required
              label='Staff Code'
              name='staffCode'
              value={formData.staffCode}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='division'
              name='division'
              value={formData.division}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='Last Year Target (Achieved Target)'
              name='lastYearTarget'
              value={formData.lastYearTarget}
              onChange={handleTextChange}
            />
            <Input
              // required
              label='Fresh Target'
              name='target'
              value={formData.target}
              onChange={handleTextChange}
            />
            <Input
              type='date'
              label='Joining Date'
              name='joiningDate'
              value={formData.joiningDate}
              onChange={handleTextChange}
            />
            <Input
              type='date'
              label='Leaving Date'
              name='leavingDate'
              value={formData.leavingDate}
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

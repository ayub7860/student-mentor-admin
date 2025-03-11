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
    glCode: '',
    productType: 1,
    comissionAmount: '0',
    comissionPercentage: '0',
    interestRate: '0'
  })

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        name: props.selectedRecord.name,
        glCode: props.selectedRecord.glCode,
        productType: props.selectedRecord.productType,
        comissionAmount: props.selectedRecord.comissionAmount,
        comissionPercentage: props.selectedRecord.comissionPercentage,
        interestRate: props.selectedRecord.interestRate
      })
    }
  }, [props.isEditOpen])

  const closeDialog = () => {
    handleClose()
    props.setIsEditOpen(false)
  }

  // const handleTextChange = (event) => {
  //   setFormData({
  //     ...formData,
  //     [event.target.name]: event.target.value
  //   })
  // }
  const handleTextChange = (event) => {
    const { name, value } = event.target;
  
    setFormData((prevFormData) => {
      if (name === 'comissionAmount') {
        return {
          ...prevFormData,
          comissionAmount: value,
          comissionPercentage: '0'
        };
      } else if (name === 'comissionPercentage') {
        return {
          ...prevFormData,
          comissionPercentage: value,
          comissionAmount: '0'
        };
      } else {
        return {
          ...prevFormData,
          [name]: value
        };
      }
    });
  };

  const handleClose = () => {
    setFormData({
      id: '0',
      name: '',
      glCode: '',
      productType: 1,
      comissionAmount: '0',
      comissionPercentage: '0',
      interestRate: '0'
    })
  }

  const submitData = async () => {
    const validationRules = [
      { field: 'name', required: true, message: 'Please enter product name.' },
      { field: 'glCode', required: true, message: 'Please enter glCode.' },
      { field: 'productType', required: true, message: 'Please product type.' },
      { field: 'interestRate', required: true, message: 'Please enter interest rate.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const {  name, glCode, productType, comissionAmount, comissionPercentage, interestRate  } = formData
      const data = {
        id: formData.id,
        name,
        glCode,
        productType,
        comissionAmount,
        comissionPercentage,
        interestRate
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminProductApi/updateProduct`, data)
        const statusMessages = {
          200: 'Product Updated successfully.',
          201: 'Product Updated successfully.',
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

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      productType: value
    })
  }

  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isEditOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Product </DialogHeader>
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
              required
              label='Gl Code'
              name='glCode'
              value={formData.glCode}
              onChange={handleTextChange}
            />
            <Select
              required
              label='Product Type'
              name='productType'
              value={formData.productType}
              onChange={handleSelectChange}
            >
              {/* <Option value={1}>Current</Option>
              <Option value={2}>Saving</Option>
              <Option value={3}>Pigmy</Option> */}
              <Option value={4}>FD</Option>
              <Option value={5}>Loan</Option>
              <Option value={6}>Recurring Deposit (RD)</Option>
              <Option value={7}>Recovery</Option>
            </Select>
            <Input
              type='number'
              label='Interest rate'
              name='interestRate'
              value={formData.interestRate}
              onChange={handleTextChange}
            />
            <Input
              type='number'
              label='Comission Amount'
              name='comissionAmount'
              value={formData.comissionAmount}
              onChange={handleTextChange}
            />
            <Input
              type='number'
              label='Comission Percentage'
              name='comissionPercentage'
              value={formData.comissionPercentage}
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

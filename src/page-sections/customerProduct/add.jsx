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
import { validateFormData } from '@/hooks/validation.js'
import { handleError } from '@/hooks/errorHandling.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CancelButton, SubmitButton } from '@/widgets/components/index.js'
import { useMaterialTailwindController } from '@/context/index.jsx'
import { fetchData } from '@/hooks/fetchData'

export default function Add (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    id: '0',
    comissionAmount: '',
    comissionPercentage: '',
    accAmount: 0
  })

  React.useEffect(() => {
    if(props.selectedRecord.productData){
      if(parseFloat(props.selectedRecord.productData.comissionAmount) === 0 || parseFloat(props.selectedRecord.productData.comissionAmount) === 0.00){
        const percentage = parseFloat(props.selectedRecord.productData.comissionPercentage);
        const result = (percentage / 100) * props.selectedRecord.accAmount;
        setFormData({
          ...formData,
          comissionAmount: result,
          comissionPercentage: props.selectedRecord.productData.comissionPercentage,
        }) 
      } else {
        setFormData({
          ...formData,
          comissionAmount: props.selectedRecord.productData.comissionAmount,
          comissionPercentage: props.selectedRecord.productData.comissionPercentage,
        }) 
      }
    }
  },[props.selectedRecord.productData])

  // React.useEffect(() => {
  //   if(parseFloat(formData.comissionAmount) === 0 || parseFloat(formData.comissionAmount) === 0.00){
  //     const percentage = parseFloat(formData.comissionPercentage);
  //     const amt = parseFloat(formData.comissionAmount);
  //     const result = (percentage / 100) * formData.accAmount;

  //     console.log('result', result);

  //     setFormData({
  //       ...formData,
  //       comissionAmount: result,
  //     }) 
  //   }
  // },[formData.comissionAmount])

  const closeDialog = () => {
    setFormData({
      comissionAmount: '',
      comissionPercentage: '',
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
    if(window.confirm('Are you sure for add commission to staff')){
      axios
      .post(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/addComissionToStaff`, {
        comissionAmount: formData.comissionAmount,
        comissionPercentage: formData.comissionPercentage,
        customerProductId: props.selectedRecord.customerProductId
      })
      .then(async (response) => {
        if (response.status === 200) {
          toast.success('commission added')
          props.setIsAddOpen(false);
          props.refreshTableData();
        } else {
          toast.error('please try again')
        }
      })
      .catch((errors) => {
        console.log(errors);
      })
    }    
  }

  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isAddOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Add Comission </DialogHeader>
        <DialogBody divider>
          <div className='flex flex-col gap-3 w-full'>
            <p>Comission Amount - {formData.comissionAmount}</p>
            <p>Comission Percentage - {formData.comissionPercentage} %</p>
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

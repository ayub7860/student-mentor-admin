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
    name: '',
    rollNo: '',
    batchName:'',
    mobile: '',
    otherNumber: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    password: '',
  })
   const [ teacherSelectList, setTeacherSelectList ] = useState([]);
   const [ teacherSelected, setTeacherSelected ] = useState(null);
  

  React.useEffect(() => {
    if (props.isEditOpen) {
      setFormData({
        id: props.selectedRecord.id,
        name: props.selectedRecord.name,
        mobile: props.selectedRecord.mobile,
        otherNumber: props.selectedRecord.otherNumber,
        email: props.selectedRecord.email,
        address: props.selectedRecord.address,
        batchName: props.selectedRecord.batchName,
        rollNo: props.selectedRecord.rollNo,
      })
      setTeacherSelected({
        value: props.selectedRecord.teacherIdFk,
        label: props.selectedRecord.teacherName,
      })
    }
  }, [props.isEditOpen])

  React.useEffect(() => {
      Promise.all([
        fetchData(`${import.meta.env.VITE_API_URL}/api/adminApi/getAllTeacherName`, theme),
      ]).then(([ teacherList ]) => {
        setTeacherSelectList(teacherList);
      });
  }, [])

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
    const textOnlyFields = ['name'];

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
      name: '',
      mobile: '',
      otherNumber: '',
      email: '',
      address: '',
      batchName: '',
      rollNo: '',
      password: '',
    })
  }

  const handleSelectForAsyncSelect = (newValue, actionMeta) => {
    const { name, action } = actionMeta;
    const label = newValue?.label ?? '';
    const value = newValue?.value ?? '';

    if (name === 'teacherName') {
        if (action === 'clear') {
            setTeacherSelected(null);
        } else {
            setTeacherSelected({ value, label });
        }
    }
  }
  
  const teacherNamePromiseOptions = (inputValue, callback) => {
    if (inputValue.length > 0) {
      axios
      .get( `${import.meta.env.VITE_API_URL}/api/adminApi/getTeacherNameForSelect?word=${inputValue}`)
      .then((response) => {
          if (response.status === 200) callback(response.data);
      })
      .catch((errors) => {
          handleError(errors, theme);
          switch (errors.response.status) {
              case 401:
                  window.location.replace(import.meta.env.VITE_LOGIN_URL);
                  break;
              case 403:
                  navigate('/admin/dashboard', { replace: true });
                  break;
              default:
          }
          callback([]);
      });
    }
  };

  const submitData = async () => {
    const validationRules = [
      { field: 'name', required: true, message: 'Please enter student name.' },
      { field: 'rollNo', required: true, message: 'Please enter roll number.' },
      { field: 'batchName', required: true, message: 'Please enter batch name.' },
      { field: 'mobile', required: true, message: 'Please enter mobile number.' },
      { field: 'email', required: true, message: 'Please enter email.' },
      { field: 'address', required: true, message: 'Please enter address.' },
      // { field: 'password', required: true, message: 'Please enter password.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const {  name, rollNo, batchName, mobile, address, otherNumber, email, pincode, city, password } = formData
      const data = {
        id: formData.id,
        name,
        mobile,
        otherNumber,
        email,
        address,
        pincode,
        city,
        password,
        rollNo,
        batchName,
        teacherName: teacherSelected.label,
        teacherId: teacherSelected.value
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminApi/updateStudent`, data)
        const statusMessages = {
          200: 'Student Updated successfully.',
          201: 'Student Updated successfully.',
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
        <DialogHeader className='bg-gray-100 text-center justify-center'>Update Student </DialogHeader>
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
              label='Roll Number'
              name='rollNo'
              value={formData.rollNo}
              onChange={handleTextChange}
            />
             <Input          
              required
              label='Batch Name'
              name='batchName'
              value={formData.batchName}
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
              // required
              label='Other Mobile'
              name='otherNumber'
              value={formData.otherNumber}
              onChange={handleTextChange}
            />
            <Input
              required
              label='email'
              name='email'
              value={formData.email}
              onChange={handleTextChange}
            />
            <div className='col-span-2'>
            <Textarea
              required
              label='Address'
              name='address'
              value={formData.address}
              onChange={handleTextChange}
            />
            </div>
            <div className='self-end'>
            <Input
              label='Password'
              name='password'
              value={formData.password}
              onChange={handleTextChange}
            />
            </div>
            <div>
              <label className="text-xs"  id="aria-label" htmlFor="aria-select-account">
                  Select Teacher <label className="text-red-600">*</label>
              </label>
              <AsyncSelect
                  aria-labelledby="aria-label"
                  inputId="aria-select-branch"
                  fullWidth
                  placeholder={'Search and select teacher...'}
                  name="teacherName"
                  defaultOptions={teacherSelectList}
                  value={teacherSelected}
                  isClearable
                  onChange={handleSelectForAsyncSelect}
                  loadOptions={teacherNamePromiseOptions}
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

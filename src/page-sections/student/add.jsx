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
    name: '',
    rollNo: '',
    batchName:'',
    mobile: '',
    otherNumber: '',
    email: '',
    address: '',
    password: '',
  })
  const [ teacherSelectList, setTeacherSelectList ] = useState([]);
  const [ teacherSelected, setTeacherSelected ] = useState(null);

  React.useEffect(() => {
      Promise.all([
        fetchData(`${import.meta.env.VITE_API_URL}/api/adminApi/getAllTeacherName`, theme),
      ]).then(([ teacherList ]) => {
        setTeacherSelectList(teacherList);
      });
  }, [])


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
    

  const closeDialog = () => {
    setFormData({
      name: '',
      rollNo: '',
      batchName:'',
      mobile: '',
      otherNumber: '',
      email: '',
      address: '',
      password: '',
    })
    props.setIsAddOpen(false)
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

  // const submitData = async () => {
     const submitData = async () => {
        // ✅ Manual regex validations
        const { mobile, email, pincode } = formData;
    
        if (!/^\d{10}$/.test(mobile)) {
          toast.error('Mobile number must be exactly 10 digits.', { position: 'top-center', theme });
          return;
        }
    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          toast.error('Please enter a valid email address.', { position: 'top-center', theme });
          return;
        }
    
        // if (!/^\d{6}$/.test(pincode)) {
        //   toast.error('Pincode must be exactly 6 digits.', { position: 'top-center', theme });
        //   return;
        // }
    
    const validationRules = [
      { field: 'name', required: true, message: 'Please enter student name.' },
      { field: 'rollNo', required: true, message: 'Please enter roll number.' },
      { field: 'batchName', required: true, message: 'Please enter batch name.' },
      { field: 'mobile', required: true, message: 'Please enter mobile number.' },
      { field: 'email', required: true, message: 'Please enter email.' },
      { field: 'address', required: true, message: 'Please enter address.' },
      { field: 'password', required: true, message: 'Please enter password.' },
    ]
    const hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const { name, rollNo, batchName, mobile, otherNumber, email, address, password } = formData;
      const data = {
        name,
        rollNo,
        batchName,
        mobile,
        otherNumber,
        email,
        address,
        password,
        teacherName: teacherSelected.label,
        teacherId: teacherSelected.value
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminApi/addStudent`, data)
        const statusMessages = {
          200: 'Student added successfully.',
          201: 'Student added successfully.',
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
      <Dialog className='z-40' handler={closeDialog} open={props.isAddOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Add Student </DialogHeader>
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
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10); // ✅ This will limit it to 10 digits
              }}
            />
            <Input
              type='number'
              // required
              label='Other Mobile'
              name='otherNumber'
              value={formData.otherNumber}
              onChange={handleTextChange}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10); // ✅ This will limit it to 10 digits
              }}
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
            {/* <Input
              required
              label='Pincode'
              name='pincode'
              value={formData.pincode}
              onChange={handleTextChange}
            />
            <Input
              required
              label='City'
              name='city'
              value={formData.city}
              onChange={handleTextChange}
            />            */}
            <div className='self-end'>
            <Input
              required
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
          <SubmitButton onClick={submitData} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

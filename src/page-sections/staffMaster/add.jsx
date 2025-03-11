import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option
} from '@material-tailwind/react'
import axios from 'axios'
import { validateFormData } from '@/hooks/validation.js'
import { handleError } from '@/hooks/errorHandling.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CancelButton, SubmitButton } from '@/widgets/components/index.js'
import { useMaterialTailwindController } from '@/context/index.jsx'
import { fetchData } from '@/hooks/fetchData'
import AsyncSelect from "react-select/async";

export default function Add (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
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
  const [ branchNameSelectList, setBranchNameSelectList ] = useState([]);
  const [ branchNameSelected, setBranchNameSelected ] = useState(null);

  React.useEffect(() => {
    document.title = 'Aditya-Anangha | Staff payout Master'
    if (props.isAddOpen) {
        Promise.all([
            fetchData(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getAllBranchName`, theme),
        ]).then(([ staffList  ]) => {
            setBranchNameSelectList(staffList);
        });
    }
  }, [props.isAddOpen])

  const closeDialog = () => {
    setFormData({
      name: '',
      mobile: '',
      otherNumber: '',
      address: '',
      pincode: '',
      city: '',
      staffCode: '',
      joiningDate: '',
      leavingDate: '',
      division:'',
      password: '',
      target: '',
      lastYearTarget: ''
    })
    setBranchNameSelected(null)
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
      { field: 'name', required: true, message: 'Please enter staff name.' },
      { field: 'mobile', required: true, message: 'Please enter mobile number.' },
      // { field: 'address', required: true, message: 'Please enter address.' },
      // { field: 'pincode', required: true, message: 'Please enter pincode.' },
      // { field: 'city', required: true, message: 'Please enter city.' },
      { field: 'staffCode', required: true, message: 'Please enter staff code.' },
      // { field: 'division', required: true, message: 'Please enter division.' },
      { field: 'password', required: true, message: 'Please enter password.' },
    ]
    let hasError = validateFormData(formData, validationRules, theme)
    if (!hasError && !branchNameSelected) {
      hasError = true;
      toast.warn("Please select branch name.", { position: "top-center", theme: theme });
    }
    if (!hasError) {
      const { name, mobile, address, pincode, city, staffCode, joiningDate, leavingDate, password, division, otherNumber, target, lastYearTarget } = formData;
      const data = {
        name,
        mobile,
        otherNumber,
        address,
        pincode,
        city,
        staffCode,
        joiningDate,
        leavingDate,
        target,
        lastYearTarget,
        division,
        password,
        branchName: branchNameSelected.name,
        branchId: branchNameSelected.value
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/addAdminStaff`, data)
        const statusMessages = {
          200: 'Staff added successfully.',
          201: 'Staff added successfully.',
          202: 'Your request has been received and is being processed. Please wait for the results.',
          204: 'The server couldn\'t find any information to show or work with.',
          205: 'Staff already exists with this mobile number.',
          default: 'Please try reloading the page.'
        }
        const message = statusMessages[response.status] || statusMessages.default
        // props.refreshTableData()
        // toast.success(message, { position: 'top-center', theme })
        // closeDialog()
        if (response.status === 200 || response.status === 201) {
          toast.success(message, { position: 'top-center', theme })
          props.refreshTableData();
          closeDialog();
        } else {
          // For any other status, you can show an error message.
          // toast.error('An unexpected status was received. Please try reloading the page.', { position: 'top-center', theme });
          toast.error(message, { position: 'top-center', theme })
        }
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


  const handleSelectForAsyncSelect = (newValue, actionMeta) => {
    const { name, action } = actionMeta;
    const label = newValue?.label ?? '';
    const value = newValue?.value ?? '';

    if (name === 'branchName') {
        if (action === 'clear') {
            setBranchNameSelected(null);
        } else {
            setBranchNameSelected({ value, label });
        }
    }
}

const branchNamePromiseOptions = (inputValue, callback) => {
  if (inputValue.length > 0) {
    axios
    .get( `${import.meta.env.VITE_API_URL}/api/adminStaffApi/getBranchNameForSelect?word=${inputValue}`)
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

  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isAddOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Add Staff </DialogHeader>
        <DialogBody divider>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 w-full'>
            <div>
              <label className="text-xs"  id="aria-label" htmlFor="aria-select-account">
                  Select Branch <label className="text-red-600">*</label>
              </label>
              <AsyncSelect
                  aria-labelledby="aria-label"
                  inputId="aria-select-branch"
                  fullWidth
                  placeholder={'Search and select branch...'}
                  name="branchName"
                  defaultOptions={branchNameSelectList}
                  value={branchNameSelected}
                  isClearable
                  onChange={handleSelectForAsyncSelect}
                  loadOptions={branchNamePromiseOptions}
              />  
            </div>
            <div className='self-end'>
            <Input
              required
              label='Name'
              name='name'
              value={formData.name}
              onChange={handleTextChange}
            />
            </div>
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
              label='Division'
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
              required
              label='Password'
              name='password'
              value={formData.password}
              onChange={handleTextChange}
            />
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

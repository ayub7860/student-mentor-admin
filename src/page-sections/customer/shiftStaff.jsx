import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography
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
    id: '0',
    staffName: ''
  })
  const [ staffNameSelectList, setStaffNameSelectList ] = useState([]);
  const [ staffNameSelected, setStaffNameSelected ] = useState(null);

  React.useEffect(() => {
    document.title = 'Aditya-Anangha | Staff payout Master'
    if (props.isStaffOpen) {
        setFormData({
          id: props.selectedStaffRecord.id,
        })
        Promise.all([
            fetchData(`${import.meta.env.VITE_API_URL}/api/adminCustomerApi/getAllStaffName`, theme),
        ]).then(([ staffList  ]) => {
            setStaffNameSelectList(staffList);
        });
    }
  }, [props.isStaffOpen])

  const closeDialog = () => {
    setFormData({
        id: '0',
    })
    setStaffNameSelected(null)
    props.refreshTableData();
    props.setIsStaffOpen(false)
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const submitData = () => {
    if(staffNameSelected && formData.id){
        if(window.confirm('Are You sure to assign staff')){
            axios
            .post( `${import.meta.env.VITE_API_URL}/api/adminCustomerApi/assignStaff`,{
                customerId: formData.id,
                staffId: staffNameSelected.value
            })
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Processing...')
                    setTimeout(()=>{
                        toast.success('staff assigned')
                        props.refreshTableData()
                        closeDialog();
                    }, 2000 )
                } else {
                    toast.error('please try again')
                }
            })
            .catch((errors) => {
                handleError(errors, theme);
            });
        }            
    } else if(!staffNameSelected) toast.warn('please select staff')
    else toast.error('please try again')
  }

  const handleSelectForAsyncSelect = (newValue, actionMeta) => {
    const { name, action } = actionMeta;
    const label = newValue?.label ?? '';
    const value = newValue?.value ?? '';

    if (name === 'staffName') {
        if (action === 'clear') {
            setStaffNameSelected(null);
        } else {
            setStaffNameSelected({ value, label });
        }
    }
}

const staffNamePromiseOptions = (inputValue, callback) => {
    if (inputValue.length > 0) {
        axios
        .get( `${import.meta.env.VITE_API_URL}/api/adminCustomerApi/getStaffNameForSelect?word=${inputValue}`)
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
      <Dialog className='z-40' handler={closeDialog} open={props.isStaffOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Assign Staff</DialogHeader>
        <DialogBody divider>
          <div className='flex flex-col gap-3 w-full'>
            {/* <p>Existing Staff Name : {formData.staffName}</p> */}
            <div>
                <label className="text-xs"  id="aria-label" htmlFor="aria-select-account">
                    Select Staff <label className="text-red-600">*</label>
                </label>
                <AsyncSelect
                    aria-labelledby="aria-label"
                    inputId="aria-select-branch"
                    fullWidth
                    placeholder={'Search and select staff...'}
                    name="staffName"
                    defaultOptions={staffNameSelectList}
                    value={staffNameSelected}
                    isClearable
                    onChange={handleSelectForAsyncSelect}
                    loadOptions={staffNamePromiseOptions}
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

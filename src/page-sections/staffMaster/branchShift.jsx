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
    oldBranchId: ''
  })
  const [ branchNameSelectList, setBranchNameSelectList ] = useState([]);
  const [ branchNameSelected, setBranchNameSelected ] = useState(null);

  React.useEffect(() => {
    document.title = 'Aditya-Anangha | Staff payout Master'
    if (props.isBranchOpen) {
        setFormData({
            id: props.selectedBranchRecord.id,
            oldBranchId: props.selectedBranchRecord.branchIdFk,
        })
        Promise.all([
            fetchData(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getAllBranchName`, theme),
        ]).then(([ staffList  ]) => {
            const updateData = staffList.filter(item => item.value !== props.selectedBranchRecord.branchIdFk)
            setBranchNameSelectList(updateData);
        });
    }
  }, [props.isBranchOpen])

  const closeDialog = () => {
    setFormData({
        id: '0',
        oldBranchId: ''
    })
    setBranchNameSelected(null)
    props.refreshTableData();
    props.setIsBranchOpen(false)
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const submitData = () => {
    if(branchNameSelected && formData.oldBranchId){
        if(window.confirm('Are You sure to shift branch')){
            axios
            .post( `${import.meta.env.VITE_API_URL}/api/adminStaffApi/shiftToBranch`,{
                staffId: formData.id,
                oldBranchId: formData.oldBranchId,
                newBranchId: branchNameSelected.value
            })
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Processing...')
                    setTimeout(()=>{
                        toast.success('Branch Shifted')
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
    } else if(!branchNameSelected) toast.warn('please select branch')
    else toast.error('please try again')
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
            if (response.status === 200){
                const updateData = response.data.filter(item => item.value !== props.selectedBranchRecord.branchIdFk)
                callback(updateData);
            }
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
      <Dialog className='z-40' handler={closeDialog} open={props.isBranchOpen} size={isMobile ? 'xxl' : 'md'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Assign Another Branch</DialogHeader>
        <DialogBody divider>
          <div className='flex flex-col gap-3 w-full'>
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

import React, { Fragment, useRef, useState } from 'react'
import axios from 'axios'
import {
  Input,
  Card,
  CardHeader,
  CardFooter,
  Typography,
  CardBody, Avatar,
  Select,
  Option
} from '@material-tailwind/react'
import { handleError } from '@/hooks/errorHandling'
import { validateFormData } from '@/hooks/validation'
import { SubmitButton, CancelButton, UpdateButton } from '@/widgets/components'
import { useNavigate } from 'react-router-dom'
import { useMaterialTailwindController } from '@/context/index.jsx'
import { toast } from 'react-toastify'
import { checkDocumentMimeType, checkFileSize, maxSelectFile } from '@/hooks/fileValidationUtils.js'
import AsyncSelect from "react-select/async";
import { fetchData } from '@/hooks/fetchData';

const getProductTypeLabel = (productType) => {
  switch (productType) {
    case 1:
      return 'Saving';
    case 2:
      return 'Current';
    case 3:
      return 'Pigmy';
    case 4:
      return 'FD';
    case 5:
      return 'Loan';
    case 6:
      return 'Recurring Deposit (RD)';
    case 7:
      return 'Recovery';
    default:
      return 'Unknown'; // Default case if productType doesn't match any of the specified values
  }
};

export default function EditCustomerProductMasterHolder (props) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [controller, dispatch] = useMaterialTailwindController()
  const { sidenavColor, theme } = controller
  const [formData, setFormData] = useState({
    customerAadhaar: '',
    customerName: '',
    customerMobile: '',
    customerAddress: '',
    pincode: '',
    city: '',
    glCode: '',
    accAmount: '',
    renewalAmount: '',
    accNumber: '',
    savingAccountNumber: '',
    email: '',
    openingDate: '',
    maturityDate: '',
    maturityAmount: '',
    remark: '',
    accountType: 'FRESH',
    days: ''
  })
  const [ productNameSelectList, setProductNameSelectList ] = useState([]);
  const [ productNameSelected, setProductNameSelected ] = useState(null);
  const [ branchNameSelectList, setBranchNameSelectList ] = useState([]);
  const [ branchNameSelected, setBranchNameSelected ] = useState(null);

  React.useEffect(() => {
    if(props.id){
        axios.post(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getCustomerProductDetails`,{id : props.id})
        .then((response)=>{
            if(response.status === 200){
                setFormData({
                    ...formData,
                    customerAadhaar: response.data.result.customerAadhaar,
                    customerName: response.data.result.customerName,
                    customerMobile: response.data.result.customerMobile,
                    email: response.data.result.email,
                    glCode: response.data.result.glCode,
                    accAmount: response.data.result.accAmount,
                    renewalAmount: response.data.result.renewalAmount,
                    accNumber: response.data.result.accNumber,
                    savingAccountNumber: response.data.result.savingAccountNumber,
                    openingDate: response.data.result.openingDate,
                    maturityDate: response.data.result.maturityDate,
                    remark: response.data.result.remark,
                    productType: getProductTypeLabel(response.data.result.productType),
                    productName: response.data.result.productName,
                    maturityAmount: response.data.result.maturityAmount,
                    accountType: response.data.result.accountType,
                    days: response.data.result.days,
                });
                setBranchNameSelected({
                  label: response.data.result.tbl_branch[0].name,
                  value: response.data.result.branchIdFk
                })
            }
        });
        Promise.all([
          fetchData(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getAllBranchName`, theme),
        ]).then(([ branchName ]) => {
          setBranchNameSelectList(branchName);
        });
    }
  }, [props.id]);

  const closeDialog = () => {
    navigate('/admin/customer-product-master', { replace: true })
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const submitData = async () => {
    const validationRules = [
      { field: 'customerAadhaar', message: 'Please enter customer aadhaar.' },
      { field: 'customerName', message: 'Please enter customer name.' },
      { field: 'customerMobile', message: 'Please enter customer mobile.' },
      { field: 'glCode', message: 'Please enter gl code.' },
      { field: 'accAmount', message: 'Please enter amount.' },
      { field: 'openingDate', message: 'Please enter opening date.' },
      // { field: 'remark', message: 'Please enter remark.' },
    ]
    let hasError = validateFormData(formData, validationRules, theme)
    if (!hasError) {
      const data = {
        id: props.id,
        customerAadhaar: formData.customerAadhaar,
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        email: formData.email,
        days: formData.days,
        // customerAddress: formData.customerAddress,
        // pincode: formData.pincode,
        // city: formData.city,
        glCode: formData.glCode,
        accAmount: formData.accAmount,
        renewalAmount: formData.renewalAmount,
        accNumber: formData.accNumber,
        savingAccountNumber: formData.savingAccountNumber,
        openingDate: formData.openingDate,
        maturityDate: formData.maturityDate,
        remark: formData.remark,
        accountType: formData.accountType,
        maturityAmount: formData.maturityAmount,
        // productName: productNameSelected.label,
        // productNameId: productNameSelected.value
        branchName: branchNameSelected.label,
        branchId: branchNameSelected.value
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/updateCustomerProduct`, data)
        const statusMessages = {
          200: 'customer product updated successfully !',
          201: 'customer product updated successfully !',
          202: 'Your request has been received and is being processed. Please wait for the results.',
          204: 'The server couldn\'t find any information to show or work with.',
          default: 'Please try reloading the page.'
        }
        const message = statusMessages[response.status] || statusMessages.default
        toast.success(message, { position: 'top-center', theme })
        handleClose()
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

  const handleClose = () => {
    setFormData({
        customerAadhaar: '',
        customerName: '',
        customerMobile: '',
        customerAddress: '',
        pincode: '',
        city: '',
        glCode: '',
        accAmount: '',
        renewalAmount: '',
        accNumber: '',
        openingDate: '',
        maturityDate: '',
        remark: '',
        maturityAmount: '',
        accountType: 'fresh',
        days: ''
    })
    closeDialog()
  }

  const handleSelectForAsyncSelect = (newValue, actionMeta) => {
    const { name, action } = actionMeta;
    const label = newValue?.label ?? '';
    const value = newValue?.value ?? '';

    if (name === 'productName') {
        if (action === 'clear') {
            setProductNameSelected(null);
        } else {
            setProductNameSelected({ value, label });
        }
    } else if (name === 'branchName') {
      if (action === 'clear') {
          setBranchNameSelected(null);
      } else {
          setBranchNameSelected({ value, label });
      }
    }
  }

  const productNamePromiseOptions = (inputValue, callback) => {
    if (inputValue.length > 0) {
        axios
        .get( `${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getProductNameForSelect?word=${inputValue}`)
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

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      accountType: value
    })
  }

  const branchNamePromiseOptions = (inputValue, callback) => {
    if (inputValue.length > 0) {
      axios
      .get( `${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getBranchNameForSelect?word=${inputValue}`)
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

  const { customerName, customerAadhaar, customerMobile, productName, glCode, savingAccountNumber, email,
    accNumber, accAmount, openingDate, maturityDate, productType, city, remark, days, renewalAmount
    } = formData;

  return (
    <Fragment>
      <Card className='animate-fade-in transform'>
        <CardHeader className='mb-4 mt-5 p-3' color={sidenavColor}>
          <div className='flex flex-col md:flex-row justify-between'>
            <Typography color='white' variant='h6'>
              {'Edit Customer Product'}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className='px-1 md:px-2 lg:px-4 pt-1 pb-2'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-3 w-full'>
            <Input type='number' label='Customer Aadhaar' name='customerAadhaar' value={customerAadhaar} onChange={handleTextChange} />
            <Input readOnly label='Product Name' name='productName' value={productName} onChange={handleTextChange} />
            <Input readOnly label='Product Type' name='productType' value={productType} onChange={handleTextChange} />
            <Input required label='Customer Name' name='customerName' value={customerName} onChange={handleTextChange} />
            <Input required type='number' label="Customer Mobile" name="customerMobile" value={customerMobile} onChange={handleTextChange}/>
            <Input label='Customer Email' name='email' value={email} onChange={handleTextChange} />
            {/* <Input required label='customerAddress' name='customerAddress' value={customerAddress} onChange={handleTextChange} />
            <Input required label='Pincode' name='pincode' value={pincode} onChange={handleTextChange} />
            <Input required label='City' name='city' value={city} onChange={handleTextChange} /> */}
            <Input required label='GL-Code' name='glCode' value={glCode} onChange={handleTextChange} />
            <Select
              required
              label='Account Type'
              name='accountType'
              value={formData.accountType}
              onChange={handleSelectChange}
            >
              <Option value={'FRESH'}>FRESH</Option>
              <Option value={'RENEWAL'}>RENEWAL</Option>
              <Option value={'EXISTING'}>EXISTING</Option>
            </Select>
            <Input label='Account Number' name='accNumber' value={accNumber} onChange={handleTextChange} />
            <Input required label='Fresh Amount' name='accAmount' value={accAmount} onChange={handleTextChange} /> 
            <Input required label='Renewal Amount' name='renewalAmount' value={renewalAmount} onChange={handleTextChange} /> 
            <Input required label='Days' name='days' value={days} onChange={handleTextChange} /> 
            <Input type='number' label='Saving Account Number' name='savingAccountNumber' value={savingAccountNumber} onChange={handleTextChange} /> 
            <div className='self-end'> 
                <Input required type='date' label='Opening Date' name='openingDate' value={openingDate} onChange={handleTextChange} />  
            </div> 
            <div className='self-end'>     
                <Input required type='date' label='Maturity Date' name='maturityDate' value={maturityDate} onChange={handleTextChange} /> 
            </div>
            <div className='self-end'>
            <Input label='Maturity Amount' name='maturityAmount' value={formData.maturityAmount} onChange={handleTextChange} /> 
            </div>
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
            {/* <div>
                <label className="text-xs"  id="aria-label" htmlFor="aria-select-account">
                    Select Product <label className="text-red-600">*</label>
                </label>
                <AsyncSelect
                    aria-labelledby="aria-label"
                    inputId="aria-select-branch"
                    fullWidth
                    placeholder={'Search and select product...'}
                    name="productName"
                    defaultOptions={productNameSelectList}
                    value={productNameSelected}
                    isClearable
                    onChange={handleSelectForAsyncSelect}
                    loadOptions={productNamePromiseOptions}
                />  
            </div> */}
            <div className='self-end'>
            <Input label='Remark' name='remark' value={remark} onChange={handleTextChange} /> 
            </div>
          </div>
        </CardBody>
        <CardFooter className='self-end gap-1'>
          <CancelButton onClick={closeDialog} />
          <UpdateButton onClick={submitData} />
        </CardFooter>
      </Card>
    </Fragment>
  )
}

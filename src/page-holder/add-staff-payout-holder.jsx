import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip, Button, Input, Tooltip,
    Select,
    Option,
    CardFooter
  } from '@material-tailwind/react'
  import React, { Suspense, useState } from 'react'
  import { useMaterialTailwindController } from '@/context/index.jsx'
  import axios from 'axios'
  import dayjs from 'dayjs'
  import customParseFormat from 'dayjs/plugin/customParseFormat'
  import CSVLink from 'react-csv/src/components/Link.jsx'
  import { useNavigate } from 'react-router-dom'
  import { toast } from 'react-toastify'
  import { handleError } from '@/hooks/errorHandling.js'
  import { CancelButton, ShowDateTime, TableCell, TableHeaderCell, TablePagination, TableStatusButton } from '@/widgets/components/index.js'
  import { formatDate } from '@/hooks/formatDate.js'
  import AsyncSelect from "react-select/async";
import { fetchData } from '@/hooks/fetchData'

  dayjs.extend(customParseFormat)
  
  const date = new Date();
  const options = { month: 'short' };
  const currentMonth = new Intl.DateTimeFormat('en-US', options).format(date);
  const currentYear = date.getFullYear();
  
  export default function CustomerMasterHolder () {
    const navigate = useNavigate()
    const [controller] = useMaterialTailwindController()
    const { sidenavColor, theme } = controller
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState({})
    const [tableData, setTableData] = useState([])
    const [isDownloadPrepare, setIsDownloadPrepare] = useState(false)
    const [csvData, setCsvData] = useState([])
    const [tableProp, setTableProp] = useState({
      perPage: 50,
      totalPages: 1,
      currentPage: 1,
      from: 0,
      to: 0,
      totalRecords: -1,
      searchValue: '',
      searchBy: '',
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })
    const [formData, setFormData] = useState({
        month: currentMonth,
        year: currentYear
      })
    const [ staffNameSelectList, setStaffNameSelectList ] = useState([]);
    const [ staffNameSelected, setStaffNameSelected ] = useState(null);
    const [ branchNameSelectList, setBranchNameSelectList ] = useState([]);
    const [ branchNameSelected, setBranchNameSelected ] = useState(null);

    React.useEffect(() => {
      document.title = 'Aditya-Anangha | Staff payout Master'
        Promise.all([
            fetchData(`${import.meta.env.VITE_API_URL}/api/adminStaffPayoutApi/getAllStaffName`, theme),
            fetchData(`${import.meta.env.VITE_API_URL}/api/adminStaffPayoutApi/getAllBranchName`, theme),
        ]).then(([ staffList, branchList ]) => {
            setStaffNameSelectList(staffList);
            setBranchNameSelectList(branchList)
        });

    }, [])
  
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
        } else if (name === 'branchName') {
            if (action === 'clear') {
                setBranchNameSelected(null);
            } else {
                setBranchNameSelected({ value, label });
            }
        }
    }
    
    const staffNamePromiseOptions = (inputValue, callback) => {
        if (inputValue.length > 0) {
            axios
            .get( `${import.meta.env.VITE_API_URL}/api/adminStaffPayoutApi/getStaffNameForSelect?word=${inputValue}`)
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

    const branchNamePromiseOptions = (inputValue, callback) => {
        if (inputValue.length > 0) {
            axios
            .get( `${import.meta.env.VITE_API_URL}/api/adminStaffPayoutApi/getBranchNameForSelect?word=${inputValue}`)
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

    const handleSelectChangeMonth = (value) => {
        setFormData({
          ...formData,
          month: value
        })
    }

    const handleSelectChangeYear = (value) => {
        setFormData({
          ...formData,
          year: value
        })
    }

    const getStaffPayout = () => {
        if(branchNameSelected && formData.month && formData.year){
            axios
            .post( `${import.meta.env.VITE_API_URL}/api/adminStaffPayoutApi/getStaffPayoutData`,{
                branchId: branchNameSelected.value,
                month: formData.month,
                year: formData.year
            })
            .then((response) => {
                if (response.status === 200) {
                    setTableData(response.data)
                    if(response.data && response.data.length === 0) toast.warn('Records not found');
                } else {
                  toast.error('please try again');
                }
            })
            .catch((errors) => {
                handleError(errors, theme);
            });
        } else if(!branchNameSelected) toast.warn('Please select branch')
        else if(!formData.month) toast.warn('please select month')
        else if(!formData.year) toast.warn('please select year')
        else toast.warn('please try again')
    }

    const addStaffPayout = () => {
        if(branchNameSelected && tableData && tableData.length > 0){
            if(window.confirm('Are You sure to staff payout')){
                axios
                .post( `${import.meta.env.VITE_API_URL}/api/adminStaffPayoutApi/addStaffPayoutData`,{
                    tableData: tableData,
                    branchId: branchNameSelected.value,
                    month: formData.month,
                    year: formData.year
                })
                .then((response) => {
                    if (response.status === 200) {
                        toast.success('Processing...')
                        setTimeout(()=>{
                            toast.success('staff payout added')
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
        else if(tableData.length === 0) toast.warn('staff data is empty')
        else toast.error('please try again')
    }

    const clearAllData = () => {
        setFormData({
          ...formData,
          month: currentMonth,
          year: currentYear
        });
        setBranchNameSelected(null);
        setTableData([]);
    }

    const closeDialog = () => {
      navigate('/admin/staff-payout-master', { replace: true })
    }
  
    return (
      <div className='mt-12 mb-8 flex flex-col gap-12 animate-fade-in transform'>
        <Card className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800'>
          <CardHeader className='mb-4 p-3' color={sidenavColor} variant='gradient'>
            <div className='flex flex-col md:flex-row justify-between'>
              <Typography color='white' variant='h6'>
                Add Staff Payout Master
              </Typography>
            </div>
          </CardHeader>
          <CardBody className='min-h-screen overflow-x-auto px-0 pt-0 pb-2 bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800 text-blue-gray-600 dark:text-gray-200'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 p-4'>
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
                <div className='self-end' style={{ position: 'relative', zIndex: 1000 }}>
                    <Select
                        required
                        label='Month'
                        name='month'
                        value={formData.month}
                        onChange={handleSelectChangeMonth}
                        style={{ zIndex: 1000, position: 'relative' }}
                    >
                        <Option value="Jan">January</Option>
                        <Option value="Feb">February</Option>
                        <Option value="Mar">March</Option>
                        <Option value="Apr">April</Option>
                        <Option value="May">May</Option>
                        <Option value="Jun">June</Option>
                        <Option value="Jul">July</Option>
                        <Option value="Aug">August</Option>
                        <Option value="Sep">September</Option>
                        <Option value="Oct">October</Option>
                        <Option value="Nov">November</Option>
                        <Option value="Dec">December</Option>
                    </Select>
                </div>
                <div className='self-end'>
                    <Select
                        required
                        label='Year'
                        name='year'
                        value={formData.year}
                        onChange={handleSelectChangeYear}
                        >
                        <Option value={2023}>2023</Option>
                        <Option value={2024}>2024</Option>
                        <Option value={2025}>2025</Option>
                        <Option value={2026}>2026</Option>
                        <Option value={2027}>2027</Option>
                        <Option value={2028}>2028</Option>
                        <Option value={2029}>2029</Option>
                        <Option value={2030}>2030</Option>
                    </Select>
                </div>
            </div>
            <div className='flex gap-4 justify-center text-center py-2'>
                <Button color='red' onClick={()=> clearAllData()}>Clear </Button>
                <Button onClick={()=> getStaffPayout()}>Search</Button>
                {tableData && tableData.length > 0 &&
                    <Button color='green' onClick={()=> addStaffPayout()}>All Staff Payout</Button>
                }
            </div>

            <hr className="my-2 mx-2" style={{ borderColor: sidenavColor, borderWidth: '1px' }} />

            {tableData && tableData.length > 0 &&
                <div className='overflow-x-auto'>
                <table className='w-full min-w-[640px] table-auto mx-2'>
                    <thead>                 
                    <tr className='text-sm font-bold'>
                        <td>Sr.No</td>
                        <td>Staff Name</td>
                        <td>Total Amount </td>
                        <td>Total Commission Amount</td>
                        <td>Total Account</td>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map(
                        (rowObj, key) => {
                        return (
                            <tr key={rowObj.id}>
                                <td className='py-2 px-2 border-b border-blue-gray-50  items-center'>
                                    <div className='flex flex-row gap-3'>
                                        <Typography className='text-xs font-semibold text-blue-gray-600 dark:text-gray-200'>
                                        {key + 1}.
                                        </Typography>
                                    </div>
                                </td>
                                <td className='text-sm py-1 px-2 border-b border-blue-gray-50'>
                                    <p>{rowObj.staffName}</p>
                                </td>
                                <td className='text-sm py-1 px-2 border-b border-blue-gray-50'>
                                    <p>{rowObj.totalAmount}</p>
                                </td>
                                <td className='text-sm py-1 px-2 border-b border-blue-gray-50 text-green-800'>
                                    <p>{rowObj.totalCommissionAmount}</p>
                                </td> 
                                <td className='text-sm py-1 px-2 border-b border-blue-gray-50'>
                                    <p>{rowObj.totalCount}</p>
                                </td>
                            </tr>
                        )
                        }
                    )}
                    </tbody>
                </table>
    
                </div>
            }
          </CardBody>
          <CardFooter className='self-end gap-1'>
          <CancelButton onClick={closeDialog} />
        </CardFooter>
        </Card>
      </div>
    )
  }
  
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip, Button, Input, Tooltip
} from '@material-tailwind/react'
import React, { Suspense, useState } from 'react'
import { useMaterialTailwindController } from '@/context/index.jsx'
import axios from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import CSVLink from 'react-csv/src/components/Link.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleError } from '@/hooks/errorHandling.js'
import { ShowDateTime, TableCell, TableHeaderCell, TablePagination, TableStatusButton } from '@/widgets/components/index.js'
import { formatDate } from '@/hooks/formatDate.js'
import { fetchData } from '@/hooks/fetchData'
dayjs.extend(customParseFormat)

const View = React.lazy(() => import('../page-sections/recovery/view'))

export default function CustomerProductMasterHolder () {
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
  const [isViewOpen, setIsViewOpen] = useState(false)

  React.useEffect(() => {
    document.title = 'Aditya-Anangha | Customer Product Master'
    getTableRecordByPage(1, 50, 'createdAt', 'desc', '')
  }, [])

  const hardRefreshTableData = () => {
    setTableProp({
      perPage: 50,
      totalPages: 1,
      currentPage: 1,
      from: 0,
      to: 0,
      totalRecords: 0,
      searchValue: '',
      searchBy: '',
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })
    getTableRecordByPage(1, 50, 'createdAt', 'desc', '')
  }
  const refreshTableData = () => { getTableRecordByPage(1, tableProp.perPage, tableProp.orderBy, tableProp.orderDirection, tableProp.searchValue) }
  const getTableRecordByPage = (currentPage, perPage, orderBy, orderDirection, searchValue) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/adminRecoveryApi/getTableAdminRecovery`, {
        currentPage,
        perPage,
        orderBy,
        orderDirection,
        searchValue
      })
      .then(async (response) => {
        if (response.status === 200) {
          const { totalRecords, tableData } = response.data
          const newPerPage = Number(perPage)
          const newCurrentPage = Number(currentPage)
          const from = (newCurrentPage * newPerPage - newPerPage) + 1
          const to = from + tableData.length - 1
          const totalPages = Math.ceil(totalRecords / newPerPage)
          setTableData(tableData)
          setTableProp({
            ...tableProp,
            perPage,
            totalPages,
            currentPage,
            from,
            to,
            totalRecords,
            searchValue,
            searchBy: '',
            orderBy,
            orderDirection
          })
        }
      })
      .catch((errors) => {
        handleError(errors, theme)
        switch (errors.response.status) {
          case 401:
            window.location.replace(import.meta.env.VITE_LOGIN_URL)
            break
          default:
        }
      })
  }
  const handlePageChange = e => { e > 0 && e <= tableProp.totalPages && e !== tableProp.currentPage && getTableRecordByPage(e, tableProp.perPage, tableProp.orderBy, tableProp.orderDirection, tableProp.searchValue) }
  const handlePerPageChange = e => { getTableRecordByPage(1, e, tableProp.orderBy, tableProp.orderDirection, tableProp.searchValue) }
  const handleOrderBy = e => { let r = 'asc'; tableProp.orderBy === e && (r = tableProp.orderDirection === 'asc' ? 'desc' : 'asc'), getTableRecordByPage(1, tableProp.perPage, e, r, tableProp.searchValue) }
  const handleSearch = e => { if (e.key === 'Enter') { const r = e.target.value; getTableRecordByPage(1, tableProp.perPage, tableProp.orderBy, tableProp.orderDirection, r) } }

  const handleEdit = (obj) => {
    setSelectedRecord(obj)
    setIsEditOpen(true)
  }

  const changeStatus = (id, value) => {
    const url = `${import.meta.env.VITE_API_URL}/api/staffCustomerProductApi/changeStatusStaffCustomerProduct`
    axios.post(url, { id, statusValue: value })
      .then(({ status }) => {
        if (status === 200) {
          switch (value) {
            case 1:
              refreshTableData()
              toast.success('The record, which was previously inactive, has been made active and can now be used or accessed.', { position: 'top-center', theme })
              break
            case 2:
              refreshTableData()
              toast.success('The record, which was previously active, has been made inactive and cannot be used or accessed until it is activated again.', { position: 'top-center', theme })
              break
            default:
          }
        }
      })
      .catch((errors) => {
        handleError(errors, theme)
        switch (errors.response.status) {
          case 401:
            window.location.replace(import.meta.env.VITE_LOGIN_URL)
            break
          case 403:
            navigate('/admin/dashboard', { replace: true })
            break
          default:
        }
      })
  }

  const prepareForDownload = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/staffCustomerProductApi/getCSVTableAdminStaffCustomerProduct`)
      .then(async (response) => {
        if (response.status === 200) {
          processCSVData(response.data.tableData)
        }
      })
      .catch((errors) => {
        handleError(errors, theme)
        switch (errors.response.status) {
          case 401:
            window.location.replace(import.meta.env.VITE_LOGIN_URL)
            break
          case 403:
            navigate('/admin/dashboard', { replace: true })
            break
          default:
        }
      })
  }

  const processCSVData = (tempData) => {
    const date = new Date()
    const dateTemp = dayjs(date, { format: 'DD MM YYYY, h:mm a' })
    const formatedDate = dateTemp.format('DD MMM YYYY, h:mm a')
    const csvDataTemp = []
    csvDataTemp.push(['', 'Export Date', formatedDate, '', '', '', '', ''])
    csvDataTemp.push(['Sr.No.', 
      'Lead No', 
      "GlCode",
      "Acc Number",
      "Acc Amount",
      "Customer Name",
      "Customer Mobile",
      "Customer Aadhaar",
      "Opening Date",
      "Maturity Date",
      "Product Name",
      "Product Type",
      "Comission Amount",
      "Comission Percentage",
      "Remark",
      "Comission Status",
      "Comission Date",
      "Comission Month",
      "Comission Year",
      "Comission Assigned By", "Branch Name", "Staff Name",
      'Status', 'Created At', 'Updated At'])
    for (const obj of tempData) {
      const { srno,
          leadNo,
          glCode,
          accNumber,
          accAmount,
          customerName,
          customerMobile,
          customerAadhaar,
          openingDate,
          maturityDate,
          productName,
          productType,
          comissionAmount,
          comissionPercentage,
          remark,
          comissionStatus,
          comissionDate,
          comissionMonth,
          comissionYear,
          comissionAssignedBy, branchName, staffName, 
          status, createdAt, updatedAt } = obj
      const formatedUpdatedAt = formatDate(updatedAt)
      const formatedCreatedAt = formatDate(createdAt)
      const tempStatus = status === 1 ? 'active' : 'inactive'
      csvDataTemp.push([srno, 
          leadNo,
          glCode,
          accNumber,
          accAmount,
          customerName,
          customerMobile,
          customerAadhaar,
          openingDate,
          maturityDate,
          productName,
          productType,
          comissionAmount,
          comissionPercentage,
          remark,
          comissionStatus,
          comissionDate,
          comissionMonth,
          comissionYear,
          comissionAssignedBy, branchName, staffName,         
          tempStatus, formatedCreatedAt, formatedUpdatedAt])
    }
    setCsvData(csvDataTemp)
    setIsDownloadPrepare(true)
  }

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

  const handleView = (obj) => {
    Promise.all([
      fetchData(`${import.meta.env.VITE_API_URL}/api/adminRecoveryApi/getAdminRecoveryTrackingDetails?id=${obj.id}`, theme),
    ]).then(([ customerData ]) => {            
      setSelectedRecord(customerData);
      setIsViewOpen(true);
    });   
  }

  const handleApproved = (data) => {
    if(window.confirm('Are you want to approve')){
      axios
      .post(`${import.meta.env.VITE_API_URL}/api/adminRecoveryApi/approvedRecovery`,{
        id: data.id
      })
      .then(async (response) => {
        if (response.status === 200) {
          toast.success('Recovery Approved')
          refreshTableData();
        } else {
          toast.error('Please try again')
        }
      })
      .catch((errors) => {
        handleError(errors, theme)
      })
    }    
  }

  const handleReject = (data) => {
    if(window.confirm('Are you want to reject')){
      axios
      .post(`${import.meta.env.VITE_API_URL}/api/adminRecoveryApi/rejectRecovery`,{
        id: data.id
      })
      .then(async (response) => {
        if (response.status === 200) {
          toast.success('Recovery Reject')
          refreshTableData();
        } else {
          toast.error('Please try again')
        }
      })
      .catch((errors) => {
        handleError(errors, theme)
      })
    }    
  }

  return (
    <div className='mt-12 mb-8 flex flex-col gap-12 animate-fade-in transform'>
      <Card className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800'>
        <CardHeader className='mb-4 p-3' color={sidenavColor} variant='gradient'>
          <div className='flex flex-col md:flex-row justify-between'>
            <Typography color='white' variant='h6'>
              Recovery Master
            </Typography>
            <div className='flex flex-col md:flex-row gap-2'>
              <div className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800 rounded-md border-0'>
                <Input className='border-0 focus:border-0 text-black dark:text-white' 
                  enterKeyHint='search'
                  icon={<i className='fas fa-search' />}
                  labelProps={{ style: { display: 'none' } }}
                  placeholder='Search' onKeyUp={handleSearch}
                />
              </div>
              <div className='flex flex-row gap-2'>
                <>
                  <Button
                      className='inline-flex self-center'
                      color='white' size='sm' variant='outlined'
                      onClick={() =>
                        navigate('/admin/add-recovery-master')
                      }
                  >
                    <i className='fas fa-plus self-center pr-1' />
                    ADD
                  </Button>
                  <>
                      <Button
                        className='inline-flex self-center'
                        color='white' size='sm' variant='outlined' onClick={event => {
                          event.preventDefault()
                          hardRefreshTableData()
                        }}
                      >
                        <i className='fas fa-arrows-rotate self-center' />
                      </Button>
                      {/* {isDownloadPrepare
                        ? (
                            <div className='flex flex-row gap-2'>
                                <button className='px-2 py-1 text-white rounded shadow-blue-gray-500 justify-center'>
                                    <CSVLink data={csvData} filename={'customer-product-master.csv'}><i className='fas fa-download' /></CSVLink>
                                  </button>
                              </div>
                          )
                        : (
                            <div className='flex flex-row gap-2'>
                                <Button
                                    className='inline-flex self-center'
                                    color='white' size='sm' variant='outlined' onClick={event => {
                                      event.preventDefault()
                                      prepareForDownload()
                                    }}
                                  >
                                    <i className='fas fa-cloud-arrow-down' />
                                  </Button>
                              </div>
                          )
                      } */}
                  </>
                </>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className='overflow-x-auto px-0 pt-0 pb-2 bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800 text-blue-gray-600 dark:text-gray-200'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[640px] table-auto'>
              <thead>
                <tr>
                  <TableHeaderCell key='srno' columnName='createdAt' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Sr.No.'
                  />
                  <TableHeaderCell key='leadNo' columnName='leadNo' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Lead_No'
                  />
                   <TableHeaderCell key='customerName' columnName='customerName' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Customer_Name'
                  />
                  <TableHeaderCell key='customerMobile' columnName='customerMobile' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Customer_Mobile'
                  />
                  <TableHeaderCell key='email' columnName='email' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Email'
                  />
                  <TableHeaderCell key='amount' columnName='amount' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Amount'
                  />
                  <TableHeaderCell key='recoveryAmount' columnName='recoveryAmount' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Recovery_Amount'
                  />                 
                  <TableHeaderCell key='recoveryDate' columnName='recoveryDate' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Recovery_Date'
                  />   
                  <TableHeaderCell key='remark' columnName='remark' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Remark'
                  />               
                  <TableHeaderCell key='staffName' columnName='staffName' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Staff_Name'
                  />
                  <TableHeaderCell key='branchName' columnName='branchName' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Branch_Name'
                  />                
                  <TableHeaderCell key='status' columnName='status' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Status'
                  />
                  <TableHeaderCell key='createdAt' columnName='createdAt' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Created At'
                  />
                  <TableHeaderCell key='updatedAt' columnName='updatedAt' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Updated At'
                  />
                </tr>
              </thead>
              <tbody>
                {tableProp.totalRecords === -1
                  ? (
                    <tr>
                        <td colSpan='4'>
                            <div className='p-4 w-full'>
                                <div className='animate-pulse space-y-4'>
                                    <div className='flex-1 space-y-2 py-1'>
                                        <div className='h-4 bg-gray-400 rounded w-4/6' />
                                        <div className='h-4 bg-gray-400 rounded w-5/6' />
                                        <div className='h-4 bg-gray-400 rounded w-5/6' />
                                        <div className='h-4 bg-gray-400 rounded w-6/6' />
                                      </div>
                                  </div>
                              </div>
                          </td>
                      </tr>
                    )
                  : (
                    <>
                        {tableData.length === 0 && (
                            <tr>
                              <td colSpan='5'>
                                    <div className='p-4 w-full text-center'>
                                      <p className='text-red-500 font-bold'>Data not found</p>
                                    </div>
                                  </td>
                            </tr>
                          )}
                      </>
                    )}
                {tableData.map(
                  (rowObj, key) => {
                    return (
                      <tr key={rowObj.id}>
                          <td className='py-2 px-2 border-b border-blue-gray-50  items-center'>
                              <div className='flex flex-row gap-3'>
                                  <Typography className='text-xs font-semibold text-blue-gray-600 dark:text-gray-200'>
                                      {rowObj.srno}.
                                    </Typography>
                                  <>                
                                    <Tooltip content="view" className="text-xs p-1">
                                      <Typography
                                          as="button"
                                          className="text-base font-semibold text-blue-600"
                                          onClick={event => {
                                              event.preventDefault();
                                              handleView(rowObj)
                                          }}
                                      >
                                        <i className="fa-solid fa-eye"></i>
                                      </Typography>
                                    </Tooltip>
                                    {rowObj.status === 3 &&
                                      <Tooltip content="Approved" className="text-xs p-1">
                                        <Typography
                                            as="button"
                                            className="text-base font-semibold text-green-600"
                                            onClick={event => {
                                                event.preventDefault();
                                                handleApproved(rowObj)
                                            }}
                                        >
                                          <i className="fa-solid fa-check"></i>
                                        </Typography>
                                      </Tooltip>
                                    }
                                    {rowObj.status === 3 &&
                                      <Tooltip content="Reject" className="text-xs p-1">
                                        <Typography
                                            as="button"
                                            className="text-base font-semibold text-red-600"
                                            onClick={event => {
                                                event.preventDefault();
                                                handleReject(rowObj)
                                            }}
                                        >
                                          <i className="fa-solid fa-ban"></i>
                                        </Typography>
                                      </Tooltip>
                                    }
                                  </>
                                </div>
                            </td>

                          <TableCell text={rowObj.leadNo} />
                          <TableCell text={rowObj.customerName} />
                          <TableCell text={rowObj.customerMobile} />
                          <TableCell text={rowObj.email} />
                          <TableCell text={rowObj.amount} />
                          <TableCell text={rowObj.recoveryAmount} />
                          <TableCell text={rowObj.recoveryDate} />
                          <TableCell text={rowObj.remark} />      
                          <TableCell text={rowObj.staffName} />  
                          <TableCell text={rowObj.branchName} />  
                          <td className='py-1 px-2 border-b border-blue-gray-50'>
                            <Chip
                              className='py-0.5 px-2 text-[11px] font-medium'
                              color={
                                rowObj.status === 1 ? 'green' : 
                                rowObj.status === 2 ? 'red' : 'yellow'}
                              value={
                                rowObj.status === 1 ? 'approved' : 
                                rowObj.status === 2 ? 'reject' : 'new added'}
                              variant='gradient'
                            />
                          </td>
                          <TableCell text={<ShowDateTime timestamp={rowObj.createdAt} />} />
                          <TableCell text={<ShowDateTime timestamp={rowObj.updatedAt} />} />
                        </tr>
                    )
                  }
                )}
              </tbody>
            </table>

          </div>
          <TablePagination currentPage={tableProp.currentPage}
              from={tableProp.from}
              handlePageChange={handlePageChange}
              handlePerPageChange={handlePerPageChange}
              perPage={tableProp.perPage}
              to={tableProp.to}
              totalPages={tableProp.totalPages}
              totalRecords={tableProp.totalRecords}
          />
        </CardBody>
      </Card>
      <Suspense fallback={<div />}>
        <View isViewOpen={isViewOpen} refreshTableData={refreshTableData} selectedRecord={selectedRecord} setIsViewOpen={setIsViewOpen} />
      </Suspense>
    </div>
  )
}

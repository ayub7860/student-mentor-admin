import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip, Button, Input, Tooltip
  } from '@material-tailwind/react'
  import React, { Suspense, useRef, useState } from 'react'
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
  
  const Add = React.lazy(() => import('../page-sections/customerProduct/add'))
  const Edit = React.lazy(() => import('../page-sections/countryMaster/edit'))
  const View = React.lazy(() => import('../page-sections/customerProduct/view'))
  const ImportExcel = React.lazy(() => import('../page-sections/customerProduct/importExcel'))

  export default function CustomerProductMasterHolder () {
    const navigate = useNavigate()
    const topScrollbarRef = useRef(null);
    const tableContainerRef = useRef(null);
    const [controller] = useMaterialTailwindController()
    const { sidenavColor, theme } = controller
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState({})
    const [tableData, setTableData] = useState([])
    const [isDownloadPrepare, setIsDownloadPrepare] = useState(false)
    const [csvData, setCsvData] = useState([])
    const [tableProp, setTableProp] = useState({
      perPage: 100,
      totalPages: 1,
      currentPage: 1,
      from: 0,
      to: 0,
      totalRecords: -1,
      searchValue: '',
      searchBy: '',
      orderBy: 'updatedAt',
      orderDirection: 'desc'
    })
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [selectedViewRecord, setSelectedViewRecord] = useState({})
    const [isImportExcelOpen, setIsImportExcelOpen] = useState(false);
    const [formData, setFormData] = useState({
      fromDate: '',
      toDate: '',
      totalAmount: '0'
    })

    React.useEffect(() => {
      document.title = 'Aditya-Anangha |  Customer Product Master'
      getTableRecordByPage(1, 100, 'updatedAt', 'desc', '', '', '')
    }, [])

    React.useEffect(() => {
      if(tableData && tableData.length > 0){
        const totalAmountTemp = tableData.reduce((acc, obj) => acc + parseFloat(obj.accAmount), 0);
        setFormData({
          ...formData,
          totalAmount: totalAmountTemp
        })
      }
    }, [tableData])
  
    const hardRefreshTableData = () => {
      setTableProp({
        perPage: 100,
        totalPages: 1,
        currentPage: 1,
        from: 0,
        to: 0,
        totalRecords: 0,
        searchValue: '',
        searchBy: '',
        orderBy: 'updatedAt',
        orderDirection: 'desc'
      })
      getTableRecordByPage(1, 100, 'updatedAt', 'desc', '', formData.fromDate, formData.toDate)
    }
    const refreshTableData = () => { getTableRecordByPage(1, tableProp.perPage, tableProp.orderBy, tableProp.orderDirection, tableProp.searchValue, formData.fromDate, formData.toDate)}
    const getTableRecordByPage = (currentPage, perPage, orderBy, orderDirection, searchValue, fromDate, toDate) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getTableExpiredCustomerProduct`, {
          currentPage,
          perPage,
          orderBy,
          orderDirection,
          searchValue,
          fromDate,
          toDate
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
    const handlePageChange = e => { e > 0 && e <= tableProp.totalPages && e !== tableProp.currentPage && getTableRecordByPage(e, tableProp.perPage, tableProp.orderBy, tableProp.orderDirection, tableProp.searchValue, formData.fromDate, formData.toDate) }
    const handlePerPageChange = e => { getTableRecordByPage(1, e, tableProp.orderBy, tableProp.orderDirection, tableProp.searchValue, formData.fromDate, formData.toDate) }
    const handleOrderBy = e => { let r = 'asc'; tableProp.orderBy === e && (r = tableProp.orderDirection === 'asc' ? 'desc' : 'asc'), getTableRecordByPage(1, tableProp.perPage, e, r, tableProp.searchValue, formData.fromDate, formData.toDate) }
    const handleSearch = e => { if (e.key === 'Enter') { const r = e.target.value; getTableRecordByPage(1, tableProp.perPage, tableProp.orderBy, tableProp.orderDirection, r, formData.fromDate, formData.toDate) } }
  
    const handleEdit = (obj) => {
      setSelectedRecord(obj)
      setIsEditOpen(true)
    }
  
    const changeStatus = (id, value) => {
      const url = `${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/changeStatusCustomerProduct`
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
        .post(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getCSVTableAdminCustomerProduct`,{
          fromDate: formData.fromDate,
          toDate: formData.toDate
        })
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

    const handleView = (obj) => {
      Promise.all([
        fetchData(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getTrackingDetails?id=${obj.id}`, theme),
      ]).then(([ customerData ]) => {            
        setSelectedViewRecord(customerData);
        setIsViewOpen(true);
      });   
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

    const accountOpenAndCloseByAdmin = (obj, statusValue) => {
      if(window.confirm('Are you sure want to close lead / account')){
        const url = `${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/accountOpenAndCloseByAdmin`
        axios.post(url, { id: obj.id, statusValue })
        .then((response) => {
          if (response.status === 200) {
            if (response.status === 200) {
              toast.success('account status changed')
              refreshTableData();
            } else {
              toast.error('please try again')
            }
          }
        })
        .catch((errors) => {
          console.log(errors);
        })
      }     
    }
  
    const addComission = (obj) => {
      Promise.all([
        fetchData(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/getCommisionData?id=${obj.id}`, theme),
      ]).then(([ customerData ]) => {      
        const data = {
          ...customerData,
          accAmount: obj.accAmount,
          customerProductId: obj.id
        }      
        setSelectedRecord(data);
        setIsAddOpen(true);
      });   
    }

    const resetComission = (obj) => {
      if(window.confirm('Are you sure want to reset commission')){
        axios
        .post(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/resetComissionToStaff`, {
          id: obj.id,
        })
        .then(async (response) => {
          if (response.status === 200) {
            toast.success('commission reset')
            refreshTableData();
          } else {
            toast.error('please try again')
          }
        })
        .catch((errors) => {
          console.log(errors);
        })
      }     
    }

    const importExcel = () => {
      setIsImportExcelOpen(true);
    }

    const handleTextChange = (event) => {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value
      })
    }

    const getTableData = () => {
      if(formData.fromDate && formData.toDate){
        getTableRecordByPage(1, 100, 'updatedAt', 'desc', '', formData.fromDate, formData.toDate)
        setIsDownloadPrepare(false)
      } else if(!formData.fromDate) toast.warn('Please select from date')
      else if(!formData.toDate) toast.warn('Please select to date')
      else toast.warn('Please try again')
    }

    const clearTableData = () => {
      setFormData({
        ...formData,
        fromDate: '',
        toDate: ''
      })
      getTableRecordByPage(1, 100, 'updatedAt', 'desc', '', '', '')
      setIsDownloadPrepare(false)
    }

    const syncScroll = (source, target) => {
      if (source && target) {
        target.scrollLeft = source.scrollLeft;
      }
    };

    return (
      <div className='mt-12 mb-8 flex flex-col gap-12 animate-fade-in transform'>
        <Card className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800'>
          <CardHeader className='mb-4 p-3' color={sidenavColor} variant='gradient'>
            <div className='flex flex-col md:flex-row justify-between'>
              <Typography color='white' variant='h6'>
                Expired Customer Product Master
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
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 px-2 py-2'>
              <Input type='date' label='From Date' name='fromDate' value={formData.fromDate} onChange={handleTextChange}/>
              <Input type='date' label='To Date' name='toDate' value={formData.toDate} onChange={handleTextChange}/>
              <div className='flex gap-2'>
                <Button onClick={() => getTableData()}>Search</Button>
                <Button color='red' onClick={() => clearTableData()}>clear</Button>
              </div>
              {/* <div><p>Total Amount : {formData.totalAmount}</p></div> */}
            </div>
            <div
                ref={topScrollbarRef}
                style={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  height: 20, // Adjust height as needed
                  scrollbarWidth: 'thin'
                  
                }}
                onScroll={() => syncScroll(topScrollbarRef.current, tableContainerRef.current)}
              >
              <div style={{ width: '160%' }}></div> {/* Adjust width to match your table */}
            </div>

            <div className='overflow-x-auto'
              ref={tableContainerRef}
              style={{ overflowX: 'auto' }}
              onScroll={() => syncScroll(tableContainerRef.current, topScrollbarRef.current)}
            >
              <table className='w-full min-w-[640px] table-auto'>
                <thead>
                  <tr>
                    <TableHeaderCell key='srno' columnName='createdAt' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Sr.No.'
                    />
                    <TableHeaderCell key='customerName' columnName='customerName' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Lead_No'
                    />
                    <TableHeaderCell key='customerMobile' columnName='customerMobile' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Gl_Code'
                    />
                    <TableHeaderCell key='customerAadhaar' columnName='customerAadhaar' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Acc_Number'
                    />
                    <TableHeaderCell key='accAmount' columnName='accAmount' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Acc_Amount'
                    />
                    <TableHeaderCell key='renwalAmount' columnName='renwalAmount' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Renewal_Amount'
                    />
                    <TableHeaderCell key='pincode' columnName='pincode' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Customer_Name'
                    />
                    <TableHeaderCell key='city' columnName='city' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Customer_Mobile'
                    />
                    <TableHeaderCell key='joiningDate' columnName='joiningDate' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Customer_Aadhaar'
                    />
                    <TableHeaderCell key='savingAccountNumber' columnName='savingAccountNumber' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Saving_Account_Number'
                    />
                    <TableHeaderCell key='totalAccounts' columnName='totalAccounts' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Opening_Date'
                    />
                    <TableHeaderCell key='totalActiveAccounts' columnName='totalActiveAccounts' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Maturity_Date'
                    />
                    <TableHeaderCell key='totalSaving' columnName='totalSaving' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Product_Name'
                    />
                    <TableHeaderCell key='totalSavingActive' columnName='totalSavingActive' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Product_Type'
                    />
                    {/* <TableHeaderCell key='totalCurrent' columnName='totalCurrent' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Comission_Amount'
                    />
                    <TableHeaderCell key='totalCurrentActive' columnName='totalCurrentActive' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Comission_Percentage'
                    /> */}
                    <TableHeaderCell key='totalPigmy' columnName='totalPigmy' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Remark'
                    />
                    {/* <TableHeaderCell key='totalPigmyActive' columnName='totalPigmyActive' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Comission_Status'
                    />
                    <TableHeaderCell key='totalFd' columnName='totalFd' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Comission_Date'
                    />
                    <TableHeaderCell key='totalFdActive' columnName='totalFdActive' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Comission_Month'
                    />
                    <TableHeaderCell key='totalLoan' columnName='totalLoan' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Comission_Year'
                    /> */}
                    {/* <TableHeaderCell key='totalLoanActive' columnName='totalLoanActive' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Comission_Assigned_By'
                    /> */}
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
                                    <Tooltip content="edit" className="text-xs p-1">
                                      <Link to={`/admin/edit-expired-customer-product-master/${rowObj.id}`}>
                                        <i className="fas fa-pen-to-square text-base font-semibold text-blue-600"></i>
                                      </Link>
                                    </Tooltip>
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
                                  </div>
                              </td>
  
                            <TableCell text={rowObj.leadNo} />
                            <TableCell text={rowObj.glCode} />
                            <TableCell text={rowObj.accNumber} />
                            <TableCell text={rowObj.accAmount} />
                            <TableCell text={rowObj.renewalAmount} />
                            <TableCell text={rowObj.customerName} />
                            <TableCell text={rowObj.customerMobile} />
                            <TableCell text={rowObj.customerAadhaar} />
                            <TableCell text={rowObj.savingAccountNumber} />
                            <TableCell text={rowObj.openingDate} />
                            <TableCell text={rowObj.maturityDate} />
                            <TableCell text={rowObj.productName} />
                            {/* <TableCell text={rowObj.productType} /> */}
                            <td className='py-1 px-2 border-b border-blue-gray-50 text-xs font-bold'>
                              <p>{getProductTypeLabel(rowObj.productType)}</p>
                            </td>
                            {/* <TableCell text={rowObj.comissionAmount} />
                            <TableCell text={rowObj.comissionPercentage} /> */}
                            <TableCell text={rowObj.remark} />
                            {/* <TableCell text={rowObj.comissionStatus} /> */}
                            {/* <td className='py-1 px-2 border-b border-blue-gray-50'>
                              <Chip
                                className='py-0.5 px-2 text-[11px] font-medium'
                                color={
                                  rowObj.comissionStatus === 1 ? 'yellow' : 
                                  rowObj.comissionStatus === 2 ? 'red' : 
                                  'green'
                                }
                                value={
                                  rowObj.comissionStatus === 1 ? 'waiting for approval' : 
                                  rowObj.comissionStatus === 2 ? 'comission assigned' : 'comission calculated'
                                }
                                variant='gradient'
                              />
                            </td> */}
                            {/* <TableCell text={rowObj.comissionDate} />
                            <TableCell text={rowObj.comissionMonth} />
                            <TableCell text={rowObj.comissionYear} />
                            <TableCell text={rowObj.comissionAssignedBy} />   */}
                            <TableCell text={rowObj.staffName} />  
                            <TableCell text={rowObj.branchName} />  
                            <td className='py-1 px-2 border-b border-blue-gray-50'>
                                <Chip
                                    className='py-0.5 px-2 text-[11px] font-medium'
                                    color={rowObj.status === 2 ? 'red' : 'green'}
                                    value={rowObj.status === 2 ? 'inactive' : 'active'}
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
          <Add isAddOpen={isAddOpen} refreshTableData={refreshTableData} setIsAddOpen={setIsAddOpen} selectedRecord={selectedRecord}/>
          <View isViewOpen={isViewOpen} refreshTableData={refreshTableData} selectedViewRecord={selectedViewRecord} setIsViewOpen={setIsViewOpen} />
          <ImportExcel isImportExcelOpen={isImportExcelOpen} setIsImportExcelOpen={setIsImportExcelOpen}
                      refreshTableData={refreshTableData}/>
        </Suspense>
      </div>
    )
  }
  
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
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleError } from '@/hooks/errorHandling.js'
import { ShowDateTime, TableCell, TableHeaderCell, TablePagination, TableStatusButton } from '@/widgets/components/index.js'
import { formatDate } from '@/hooks/formatDate.js'
import AsyncSelect from "react-select/async";
import { fetchData } from '@/hooks/fetchData'

dayjs.extend(customParseFormat)

const View = React.lazy(() => import('../page-sections/staffReport/view'))

export default function StaffReportMasterHolder () {
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
    perPage: 100,
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
    fromDate: '',
    toDate: '',
    totalRecords: 0,
  })
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [tempTableData, setTempTableData] = useState([])
  const [ branchNameSelectList, setBranchNameSelectList ] = useState([]);
  const [ branchNameSelected, setBranchNameSelected ] = useState(null);
  const [ staffNameSelectList, setStaffNameSelectList ] = useState([]);
  const [ staffNameSelected, setStaffNameSelected ] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for Branch Report, 1 for Staff Report
  const tabs = ["Branch Report", "Staff Report"]; // Tab lab
  const [selectedReport, setSelectedReport] = useState('branch');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // To check if data is loaded

  React.useEffect(() => {
    document.title = 'Aditya-Anangha | Staff report Master'
    // getTableRecordByPage(1, 100, 'createdAt', 'desc', '', '', '')

    Promise.all([
      fetchData(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getAllStaffName`, theme),
      fetchData(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getAllBranchName`, theme),
    ]).then(([ staffList, branchList ]) => {  
        const updatedBranchList = [{ label: 'All', value: 'all' }, ...branchList];      
        setBranchNameSelectList(updatedBranchList);

        const updatedStaffList = [{ label: 'All', value: 'all' }, ...staffList];
        setStaffNameSelectList(updatedStaffList);
    });

  }, [])

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
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })
    getTableRecordByPage(1, 100, 'createdAt', 'desc', '', '', '')
  }
  const refreshTableData = () => { getTableRecordByPage(1, tableProp.perPage, tableProp.orderBy, tableProp.orderDirection, tableProp.searchValue, formData.fromDate, formData.toDate) }
  const getTableRecordByPage = (currentPage, perPage, orderBy, orderDirection, searchValue, fromDate, toDate) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getTableStaffReport`, {
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
    const url = `${import.meta.env.VITE_API_URL}/api/adminProductApi/changeStatusProduct`
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
      .post(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getCSVTableAdminStaffReport`)
      .then(async (response) => {
        if (response.status === 200) {
          processCSVData(response.data.tableData)
        }
      })
      .catch((errors) => {
        console.log('err', errors);
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

  const processCSVData = (tempData) => {
    const date = new Date()
    const dateTemp = dayjs(date, { format: 'DD MM YYYY, h:mm a' })
    const formatedDate = dateTemp.format('DD MMM YYYY, h:mm a')
    const csvDataTemp = []
    csvDataTemp.push(['', 'Export Date', formatedDate, '', '', '', '', ''])
    csvDataTemp.push(['Sr.No.', 
      'Name', 
      "Mobile",
      "Branch Name",
      "Total Fresh Amount",
      "Total Existing Amount",
      "Total Renewal Amount",
      "Total RD Amount",
      "Total",
      // "Total Saving",
      // "Total Saving Active",
      // "Total Current",
      // "Total Current Active",
      // "Total Pigmy",
      // "Total Pigmy Active",
      // "Total Fd",
      // "Total Fd Active",
      // "Total Loan",
      // "Total Loan Active",
      // 'Status', 'Created At', 'Updated At'
    ])
    for (const obj of tempData) {
      const { srno,
        name,
        mobile,
        branchName,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
          // totalSaving,
          // totalSavingActive,
          // totalCurrent,
          // totalCurrentActive,
          // totalPigmy,
          // totalPigmyActive,
          // totalFd,
          // totalFdActive,
          // totalLoan,
          // totalLoanActive, 
          // status, createdAt, updatedAt 
        } = obj
      // const formatedUpdatedAt = formatDate(updatedAt)
      // const formatedCreatedAt = formatDate(createdAt)
      // const tempStatus = status === 1 ? 'active' : 'inactive'
      csvDataTemp.push([srno, 
        name,
        mobile,
        branchName,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
          // totalSaving,
          // totalSavingActive,
          // totalCurrent,
          // totalCurrentActive,
          // totalPigmy,
          // totalPigmyActive,
          // totalFd,
          // totalFdActive,
          // totalLoan,
          // totalLoanActive,         
          // tempStatus, formatedCreatedAt, formatedUpdatedAt
        ])
    }
    setCsvData(csvDataTemp)
    setIsDownloadPrepare(true)
  }

  const handleTextChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const getTableData = () => {
    if(formData.fromDate && formData.toDate){
      getTableRecordByPage(1, 100, 'createdAt', 'desc', '', formData.fromDate, formData.toDate)
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
    setBranchNameSelected(null)
    setStaffNameSelected(null)
    setLoading(false)
    setDataLoaded(false)
    // getTableRecordByPage(1, 100, 'createdAt', 'desc', '', '', '')
    // setIsDownloadPrepare(false)
  }

  const handleView = (data) => {
    setSelectedRecord(data)
    setIsViewOpen(true)
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

  const getBranchData = () =>{
    if(branchNameSelected && branchNameSelected.value){
      setLoading(true); // Start the loader when search is clicked
      setDataLoaded(false);
      axios
      .post(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getCSVTableAdminBranchReport`,{
        branchId: branchNameSelected.value,
      })
      .then(async (response) => {
        if (response.status === 200) {
          if(branchNameSelected.value === 'all'){
            processAllBranchCSVData(response.data.tableData)
          } else {
            processBranchCSVData(response.data.tableData)           
          }
          setLoading(false); // Stop the loader
          setDataLoaded(true); // Data is now loaded
        }
      })
      .catch((errors) => {
        console.log('err', errors);
        handleError(errors, theme)
        setLoading(false); 
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
    } else {
      toast.warn('Please select branch')
    }
  }

  const processBranchCSVData = (tempData) => {
    const date = new Date()
    const dateTemp = dayjs(date, { format: 'DD MM YYYY, h:mm a' })
    const formatedDate = dateTemp.format('DD MMM YYYY, h:mm a')
    const csvDataTemp = []
    const branchNameSelect = branchNameSelected.label;
    csvDataTemp.push(['', 'branch name - ', branchNameSelect, 'Export Date', formatedDate, '', '', '', '', ''])
    csvDataTemp.push(['Sr.No.', 
      'NAME', 
      "MOBILE",
      "BRANCH NAME",
      "DIVISION",
      "MOBILIZATION ACHIEVED TILL MARCH",
      "FRESH DEPOSIT TARGET",
      "TOTAL FRESH AMOUNT",
      "TOTAL EXISTING AMOUNT",
      "TOTAL RENEWAL AMOUNT",
      "TOTAL RD AMOUNT",
      "TOTAL",
    ])
    for (const obj of tempData) {
      const { srno,
        name,
        mobile,
        branchName,
        division,
        lastYearTarget,
        target,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
      } = obj
      csvDataTemp.push([srno, 
        name,
        mobile,
        branchName,
        division,
        lastYearTarget,
        target,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
      ])
    }
    setCsvData(csvDataTemp)
    setIsDownloadPrepare(true)
  }

  const getAllStaffData = () =>{
    if(staffNameSelected && staffNameSelected.value){
      setLoading(true); // Start the loader when search is clicked
      setDataLoaded(false);
      axios
      .post(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getCSVTableAdminAllStaffReport`,{
        staffId: staffNameSelected.value,
      })
      .then(async (response) => {
        if (response.status === 200) {
          if(staffNameSelected.value === 'all'){
            processAllStaffCSVData(response.data.tableData)
          } else {
            const {freshCustomerData, existingCustomerData, RDCustomerData, renewalCustomerData,
              freshCustomerAmountSum, existingCustomerAmountSum, existingCustomerAmountSum1, RDCustomerAmountSum, renewalCustomerAmountSum, renewalCustomerAmountSum1 } = response.data;
            processSingleStaffCSVData(freshCustomerData, existingCustomerData, RDCustomerData, renewalCustomerData, freshCustomerAmountSum, existingCustomerAmountSum, existingCustomerAmountSum1, RDCustomerAmountSum, renewalCustomerAmountSum, renewalCustomerAmountSum1)
          }
          setLoading(false); // Stop the loader
          setDataLoaded(true); // Data is now loaded
        }
      })
      .catch((errors) => {
        console.log('err', errors);
        handleError(errors, theme)
        setLoading(false); 
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
    } else {
      toast.warn('Please select staff')
    }
  }

  const processAllStaffCSVData = (tempData) => {
    const date = new Date()
    const dateTemp = dayjs(date, { format: 'DD MM YYYY, h:mm a' })
    const formatedDate = dateTemp.format('DD MMM YYYY, h:mm a')
    const csvDataTemp = []
    csvDataTemp.push(['', 'Export Date', formatedDate, '', '', '', '', ''])
    csvDataTemp.push(['Sr.No.', 
      'NAME', 
      "MOBILE",
      "BRANCH NAME",
      "DIVISION",
      "MOBILIZATION ACHIEVED TILL MARCH",
      "FRESH DEPOSIT TARGET",
      "TOTAL FRESH AMOUNT",
      "TOTAL EXISTING AMOUNT",
      "TOTAL RENEWAL AMOUNT",
      "TOTAL RD AMOUNT",
      "TOTAL",
    ])
    for (const obj of tempData) {
      const { srno,
        name,
        mobile,
        branchName,
        division,
        lastYearTarget,
        target,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
      } = obj
      csvDataTemp.push([srno, 
        name,
        mobile,
        branchName,
        division,
        lastYearTarget,
        target,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
      ])
    }
    setCsvData(csvDataTemp)
    setIsDownloadPrepare(true)
  }
  
  const processSingleStaffCSVData = (freshCustomerData, existingCustomerData, RDCustomerData, renewalCustomerData, freshCustomerAmountSum, existingCustomerAmountSum, existingCustomerAmountSum1, RDCustomerAmountSum, renewalCustomerAmountSum, renewalCustomerAmountSum1) => {
    const date = new Date();
    const grandTotal = parseFloat(freshCustomerAmountSum) + parseFloat(existingCustomerAmountSum) + parseFloat(existingCustomerAmountSum1) + parseFloat(RDCustomerAmountSum) + parseFloat(renewalCustomerAmountSum1);
    const totalExistingAMount = parseFloat(existingCustomerAmountSum) + parseFloat(existingCustomerAmountSum1)
    const dateTemp = dayjs(date, { format: 'DD MM YYYY, h:mm a' })
    const formatedDate = dateTemp.format('DD MMM YYYY, h:mm a')
    const csvDataTemp = []
    csvDataTemp.push(['', 'Export Date', formatedDate, '', '', '', '', ''])
    csvDataTemp.push(['FRESH REPORT FROM APRIL', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push([
      // 'Sr.No.', 
      'Name of the Depositor', 
      "Deposit Name",
      "Deposit Type",
      "Days",
      "Account Number",
      "GlCode",
      "Saving Account Number",
      "Amount",
      "Date of Opening",
      "Date of Maturity", 
      "Branch Name",   
      "Customer Aadhaar",   
      "Customer Mobile",
      // 'Status', 'Created At', 'Updated At'
    ])
    for (const obj of freshCustomerData) {
      const { 
        // srno,
        customerName,
        productName,
        productType,
        days,          
        accNumber,
        glCode,
        savingAccountNumber,
        accAmount,
        openingDate,
        maturityDate,
        // branchName,
        customerAadhaar,
        customerMobile,
        // status, createdAt, updatedAt 
      } = obj
      // const formatedUpdatedAt = formatDate(updatedAt)
      // const formatedCreatedAt = formatDate(createdAt)
      // const tempStatus = status === 1 ? 'active' : 'inactive'
      const productTypeName = getProductTypeLabel(productType)
      const branchName = obj.tbl_branch[0].name || '';
      csvDataTemp.push([
        // srno, 
        customerName,
        productName,
        productTypeName,
        days,          
        accNumber,
        glCode,
        savingAccountNumber,
        accAmount,
        openingDate,
        maturityDate,
        branchName,
        customerAadhaar,
        customerMobile,
        // tempStatus, formatedCreatedAt, formatedUpdatedAt
      ])
    }
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', 'TOTAL', freshCustomerAmountSum])

    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['EXISTING REPORT TILL MARCH', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push([
      // 'Sr.No.', 
      'Name of the Depositor', 
      "Deposit Name",
      "Deposit Type",
      "Days",
      "Account Number",
      "GlCode",
      "Saving Account Number",
      "Fresh Amount",
      "Renewal Amount",
      "Date of Opening",
      "Date of Maturity", 
      "Branch Name",   
      "Customer Aadhaar",   
      "Customer Mobile",
      // 'Status', 'Created At', 'Updated At'
    ])
    for (const obj of existingCustomerData) {
      const { //srno,
        customerName,
        productName,
        productType,
        days,          
        accNumber,
        glCode,
        savingAccountNumber,
        accAmount,
        renewalAmount,
        openingDate,
        maturityDate,
        // branchName,
        customerAadhaar,
        customerMobile,
        // status, createdAt, updatedAt 
      } = obj
      // const formatedUpdatedAt = formatDate(updatedAt)
      // const formatedCreatedAt = formatDate(createdAt)
      // const tempStatus = status === 1 ? 'active' : 'inactive'
      const productTypeName = getProductTypeLabel(productType)
      const branchName = obj.tbl_branch[0].name || '';
      const renewalData = renewalAmount ? renewalAmount : 0      
      csvDataTemp.push([ //srno, 
        customerName,
        productName,
        productTypeName,
        days,          
        accNumber,        
        glCode,
        savingAccountNumber,
        accAmount,
        renewalData,
        openingDate,
        maturityDate,
        branchName,
        customerAadhaar,
        customerMobile,
        // tempStatus, formatedCreatedAt, formatedUpdatedAt
      ])
    }
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', 'TOTAL', existingCustomerAmountSum, existingCustomerAmountSum1, totalExistingAMount])

    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['Renewal Report', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push([
      // 'Sr.No.', 
      'Name of the Depositor', 
      "Deposit Name",
      "Deposit Type",
      "Days",
      "Account Number",
      "GlCode",
      "Saving Account Number",
      "Fresh Amount",
      "Renewal Amount",
      "Date of Opening",
      "Date of Maturity", 
      "Branch Name",   
      "Customer Aadhaar",   
      "Customer Mobile",
      // 'Status', 'Created At', 'Updated At'
    ])
    for (const obj of renewalCustomerData) {
      const { // srno,
        customerName,
        productName,
        productType,
        days,          
        accNumber,
        glCode,
        savingAccountNumber,
        accAmount,
        renewalAmount,
        openingDate,
        maturityDate,
        // branchName,
        customerAadhaar,
        customerMobile,
        // status, createdAt, updatedAt 
      } = obj
      // const formatedUpdatedAt = formatDate(updatedAt)
      // const formatedCreatedAt = formatDate(createdAt)
      // const tempStatus = status === 1 ? 'active' : 'inactive'
      const productTypeName = getProductTypeLabel(productType)
      const branchName = obj.tbl_branch[0].name || '';

      csvDataTemp.push([ //srno, 
        customerName,
        productName,
        productTypeName,
        days,          
        accNumber,
        glCode,
        savingAccountNumber,
        accAmount,
        renewalAmount,
        openingDate,
        maturityDate,
        branchName,
        customerAadhaar,
        customerMobile,
        // tempStatus, formatedCreatedAt, formatedUpdatedAt
      ])
    }
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', 'TOTAL', renewalCustomerAmountSum, renewalCustomerAmountSum1])

    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['RD Report', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push([
      // 'Sr.No.', 
      'Name of the Depositor', 
      "Deposit Name",
      "Deposit Type",
      "Days",
      "Account Number",
      "GlCode",
      "Saving Account Number",
      "Amount",
      "Date of Opening",
      "Date of Maturity", 
      "Branch Name",   
      "Customer Aadhaar",   
      "Customer Mobile",
      // 'Status', 'Created At', 'Updated At'
    ])
    for (const obj of RDCustomerData) {
      const { // srno,
        customerName,
        productName,
        productType,
        days,          
        accNumber,
        glCode,
        savingAccountNumber,
        accAmount,
        openingDate,
        maturityDate,
        // branchName,
        customerAadhaar,
        customerMobile,
        // status, createdAt, updatedAt 
      } = obj
      // const formatedUpdatedAt = formatDate(updatedAt)
      // const formatedCreatedAt = formatDate(createdAt)
      // const tempStatus = status === 1 ? 'active' : 'inactive'
      const productTypeName = getProductTypeLabel(productType)
      const branchName = obj.tbl_branch[0].name || '';

      csvDataTemp.push([ // srno, 
        customerName,
        productName,
        productTypeName,
        days,          
        accNumber,
        glCode,
        savingAccountNumber,
        accAmount,
        openingDate,
        maturityDate,
        branchName,
        customerAadhaar,
        customerMobile,
        // tempStatus, formatedCreatedAt, formatedUpdatedAt
      ])
    }``
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', '', RDCustomerAmountSum])
    csvDataTemp.push(['', '', '', '', '', '', ''])
    csvDataTemp.push(['', '', '', '', '', '', 'GRAND TOTAL', grandTotal])

    setCsvData(csvDataTemp)
    setIsDownloadPrepare(true)
  }

  const processAllBranchCSVData = (tempData) => {
    const date = new Date()
    const dateTemp = dayjs(date, { format: 'DD MM YYYY, h:mm a' })
    const formatedDate = dateTemp.format('DD MMM YYYY, h:mm a')
    const csvDataTemp = []
    csvDataTemp.push(['', 'Export Date', formatedDate, '', '', '', '', ''])
    csvDataTemp.push(['Sr.No.', 
      'Branch Name', 
      "Total Fresh Amount",
      "Total Existing Amount",
      "Total Renewal Amount",
      "Total RD Amount",
      "Total",
    ])
    for (const obj of tempData) {
      const { srno,
        name,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
      } = obj
      csvDataTemp.push([srno, 
        name,
        freshAmount,
        existingAmount,
        renewalAmount,
        RDAmount,
        totalAmount,
      ])
    }
    setCsvData(csvDataTemp)
    setIsDownloadPrepare(true)
  }

  return (
    <div className='mt-12 mb-8 flex flex-col gap-12 animate-fade-in transform'>
      <Card className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800'>
        <CardHeader className='mb-4 p-3' color={sidenavColor} variant='gradient'>
          <div className='flex flex-col md:flex-row justify-between'>
            <Typography color='white' variant='h6'>
              Report Master
            </Typography>
            <div className='flex flex-col md:flex-row gap-2'>
              {/* <div className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800 rounded-md border-0'>
                <Input className='border-0 focus:border-0 text-black dark:text-white' 
                  enterKeyHint='search'
                  icon={<i className='fas fa-search' />}
                  labelProps={{ style: { display: 'none' } }}
                  placeholder='Search' onKeyUp={handleSearch}
                />
              </div> */}
              {/* <div className='flex flex-row gap-2'>
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
                      {isDownloadPrepare
                        ? (
                            <div className='flex flex-row gap-2'>
                                <button className='px-2 py-1 text-white rounded shadow-blue-gray-500 justify-center'>
                                    <CSVLink data={csvData} filename={'Staff-Report-master.csv'}><i className='fas fa-download' /></CSVLink>
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
                      }
                  </>
                </>
              </div> */}
            </div>
          </div>
        </CardHeader>
        <CardBody className='px-0 pt-0 pb-2 bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800 text-blue-gray-600 dark:text-gray-200'>
          <div className='overflow-x-auto'>
            {/* <table className='w-full min-w-[640px] table-auto'>
              <thead>
                <tr>
                  <TableHeaderCell key='srno' columnName='createdAt' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Sr.No.'
                  />
                  <TableHeaderCell key='name' columnName='name' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Staff Name'
                  />
                  <TableHeaderCell key='glCode' columnName='glCode' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Mobile'
                  />
                  <TableHeaderCell key='productType' columnName='productType' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Branch Name'
                  />    
                   <TableHeaderCell key='interestRate' columnName='interestRate' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Fresh'
                  />    
                  <TableHeaderCell key='comissionAmount' columnName='comissionAmount' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Existing'
                  />
                  <TableHeaderCell key='comissionPercentage' columnName='comissionPercentage' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Renewal'
                  />            
                  <TableHeaderCell key='totalAccounts' columnName='totalAccounts' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='RD'
                  />
                  <TableHeaderCell key='totalActiveAccounts' columnName='totalActiveAccounts' handleOrderBy={handleOrderBy}
                      isOrderByAvailable={true} orderBy={tableProp.orderBy}
                      orderDirection={tableProp.orderDirection} text='Total'
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
                                    <Tooltip className='text-xs p-1' content='Staff In-Active'>
                                      <Typography
                                        as='button'
                                        className='text-base font-semibold text-blue-600'
                                        onClick={event => { event.preventDefault(); handleView(rowObj) }}
                                      >
                                        <i className="fa-solid fa-eye"></i>
                                      </Typography>
                                    </Tooltip>  
                                  </>
                                </div>
                            </td>
                          <TableCell text={rowObj.name} />
                          <TableCell text={rowObj.mobile} />                        
                          <TableCell text={rowObj.branchName} />  
                          <TableCell text={rowObj.freshAmount} />  
                          <TableCell text={rowObj.existingAmount} />  
                          <TableCell text={rowObj.renewalAmount} />
                          <TableCell text={rowObj.RDAmount} />
                          <TableCell text={rowObj.totalAmount} />
                        </tr>
                    )
                  }
                )}
              </tbody>
            </table> */}

          </div>
          {/* <TablePagination currentPage={tableProp.currentPage}
              from={tableProp.from}
              handlePageChange={handlePageChange}
              handlePerPageChange={handlePerPageChange}
              perPage={tableProp.perPage}
              to={tableProp.to}
              totalPages={tableProp.totalPages}
              totalRecords={tableProp.totalRecords}
          /> */}

        <div className="flex flex-col items-center justify-center">
          <div className="bg-white border border-blue-300 p-8 rounded shadow-lg max-w-md w-full bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800 text-blue-gray-600 dark:text-gray-200">
            <h2 className="text-2xl font-bold mb-4">Select Report Type</h2>

            {/* Radio Buttons */}
            <div className="mb-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="report"
                  value="branch"
                  checked={selectedReport === 'branch'}
                  onChange={() => { setSelectedReport('branch'); clearTableData();}}
                  className="form-radio text-blue-500 cursor-pointer"
                />
                <span className="ml-2 cursor-pointer">Branch Report</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="report"
                  value="staff"
                  checked={selectedReport === 'staff'}
                  onChange={() => { setSelectedReport('staff'); clearTableData() }}
                  className="form-radio text-blue-500 cursor-pointer"
                />
                <span className="ml-2 cursor-pointer">Staff Report</span>
              </label>
            </div>

            {/* Conditional Display */}
            <div className="mt-4 p-4 border rounded-lg">
              {selectedReport === 'branch' ? (
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
                 
                  <div className="flex items-center justify-center gap-2 my-4">
                    <Button onClick={getBranchData} disabled={loading}>
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        'Search'
                      )}
                    </Button>
                    <Button color="red" onClick={clearTableData}>
                      Clear
                    </Button>
                  </div>

                  {/* Show download button after data is loaded */}
                  {dataLoaded && (
                    <div className="flex items-center justify-center my-4">
                      <button className='px-2 py-1 text-white rounded shadow-blue-gray-500 justify-center bg-green-400'>
                        <CSVLink data={csvData} filename={`${branchNameSelected && branchNameSelected.label}-branch-Report-master.csv`}><i className='fas fa-download' /> Download Report</CSVLink>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
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
                  {/* <div className='flex items-center justify-center gap-2 my-4'>
                    <Button onClick={() => getBranchData()}>Search</Button>
                    <Button color='red' onClick={() => clearTableData()}>clear</Button>
                  </div> */}
                   <div className="flex items-center justify-center gap-2 my-4">
                    <Button onClick={getAllStaffData} disabled={loading}>
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        'Search'
                      )}
                    </Button>
                    <Button color="red" onClick={clearTableData}>
                      Clear
                    </Button>
                  </div>

                  {/* Show download button after data is loaded */}
                  {dataLoaded && (
                    <div className="flex items-center justify-center my-4">
                      <button className='px-2 py-1 text-white rounded shadow-blue-gray-500 justify-center bg-green-400'>
                        <CSVLink data={csvData} filename={`${staffNameSelected && staffNameSelected.label}-staff-Report-master.csv`}><i className='fas fa-download' /> Download Report</CSVLink>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>  
         
        </CardBody>
      </Card>
      <Suspense fallback={<div />}>
        <View isViewOpen={isViewOpen} setIsViewOpen={setIsViewOpen} selectedRecord={selectedRecord}/>
      </Suspense>
    </div>
  )
}

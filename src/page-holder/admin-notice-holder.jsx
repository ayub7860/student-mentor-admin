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
  dayjs.extend(customParseFormat)
  
  const Add = React.lazy(() => import('../page-sections/adminNotice/add'))
  const Edit = React.lazy(() => import('../page-sections/adminNotice/edit'))
  
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
  
    React.useEffect(() => {
      document.title = 'Mentor | Notice Master'
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
        .post(`${import.meta.env.VITE_API_URL}/api/adminApi/getTableNotice`, {
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
      const url = `${import.meta.env.VITE_API_URL}/api/adminApi/changeStatusNotice`
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

    return (
      <div className='mt-12 mb-8 flex flex-col gap-12 animate-fade-in transform'>
        <Card className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800'>
          <CardHeader className='mb-4 p-3' color={sidenavColor} variant='gradient'>
            <div className='flex flex-col md:flex-row justify-between'>
              <Typography color='white' variant='h6'>
                Notice Master
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
                        color='white' size='sm' variant='outlined' onClick={event => { event.preventDefault(); setIsAddOpen(true) }}
                    >
                      <i className='fas fa-plus self-center pr-1' />
                      ADD Notice
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
                    <TableHeaderCell key='title' columnName='title' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Subject'
                    />
                    <TableHeaderCell key='description' columnName='description' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Description'
                    />
                    <TableHeaderCell key='type' columnName='type' handleOrderBy={handleOrderBy}
                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                        orderDirection={tableProp.orderDirection} text='Type'
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
                                        <Tooltip className='text-xs p-1' content='edit'>
                                            <Typography
                                                as='button'
                                                className='text-base font-semibold text-blue-600'
                                                onClick={event => { event.preventDefault(); handleEdit(rowObj) }}
                                              >
                                                <i className='fas fa-pen-to-square' />
                                              </Typography>
                                          </Tooltip>
                                        <TableStatusButton changeStatus={changeStatus} rowObj={rowObj} />
                                      </>
                                  </div>
                              </td>
  
                            <TableCell text={rowObj.title} />
                            <TableCell text={rowObj.description} />                          
                            <td className='py-1 px-2 border-b border-blue-gray-50'>
                                <Chip
                                    className='py-0.5 px-2 text-[11px] font-medium'
                                    value={rowObj.type === 1 ? 'Teacher' :  rowObj.type === 2 ? 'Student' : 'All'}
                                    variant='gradient'
                                  />
                            </td> 
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
          <Add isAddOpen={isAddOpen} refreshTableData={refreshTableData} setIsAddOpen={setIsAddOpen} />
          <Edit isEditOpen={isEditOpen} refreshTableData={refreshTableData} selectedRecord={selectedRecord} setIsEditOpen={setIsEditOpen} />
        </Suspense>
      </div>
    )
  }
  
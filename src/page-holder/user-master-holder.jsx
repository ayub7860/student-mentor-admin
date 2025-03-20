import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip, Button, Input, Tooltip, Avatar
} from '@material-tailwind/react'
import React, { Suspense, useState } from 'react'
import { useMaterialTailwindController } from '@/context/index.jsx'
import axios from 'axios'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import CSVLink from 'react-csv/src/components/Link.jsx'
import { useNavigate } from 'react-router-dom'
import { handleError } from '@/hooks/errorHandling'
import { formatDate } from '@/hooks/formatDate'
import { ShowDateTime, TableHeaderCell, TableCell, TableStatusButton, TablePagination } from '@/widgets/components'
import { toast } from 'react-toastify'
dayjs.extend(customParseFormat)

const Edit = React.lazy(() => import('../page-sections/userMaster/edit'))
const View = React.lazy(() => import('../page-sections/userMaster/view'))

export function UserMasterHolder () {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { sidenavColor, theme } = controller
  const [isViewOpen, setIsViewOpen] = useState(false)
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
    document.title = 'Mentor | User Master'
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
      .post(`${import.meta.env.VITE_API_URL}/api/userApi/getTableUserMaster`, {
        currentPage,
        perPage,
        orderBy,
        orderDirection,
        searchValue
      })
      .then((response) => {
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
    const url = `${import.meta.env.VITE_API_URL}/api/userApi/changeStatusUser`
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

  const downloadDocument = (obj) => {
    setSelectedRecord(obj)
    setIsViewOpen(true)
  }

  const prepareForDownload = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/userApi/getCSVTableUser`)
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
    csvDataTemp.push(['Sr.No.', 'User Name', 'Person Name', 'Mobile', 'Email', 'Status', 'Created At', 'Updated At'])
    for (const obj of tempData) {
      const { srno, userName, personName, mobile, email, status, createdAt, updatedAt } = obj
      const formatedUpdatedAt = formatDate(updatedAt)
      const formatedCreatedAt = formatDate(createdAt)
      const tempStatus = status === 1 ? 'active' : 'inactive'
      csvDataTemp.push([srno, userName, personName, mobile, email, tempStatus, formatedCreatedAt, formatedUpdatedAt])
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
              User Master
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
                <Button
                  className='inline-flex self-center'
                  color='white' size='sm' variant='outlined' onClick={() =>
                    navigate('/admin/add-user-master')
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
                  <div className='flex flex-row gap-2'>
                    {isDownloadPrepare
                        ? (
                            <button className='px-2 py-1 text-white rounded shadow-blue-gray-500 justify-center'>
                                <CSVLink data={csvData} filename={'user-master.csv'}><i className='fas fa-download' /></CSVLink>
                              </button>
                          )
                        : (
                            <Button
                              className='inline-flex self-center'
                              color='white' size='sm' variant='outlined' onClick={event => {
                                event.preventDefault()
                                prepareForDownload()
                              }}
                            >
                              <i className='fas fa-cloud-arrow-down' />
                            </Button>
                          )}
                  </div>
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
                  <TableHeaderCell key='userName' columnName='userName' handleOrderBy={handleOrderBy}
                                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                                        orderDirection={tableProp.orderDirection} text='User_Name'
                  />
                  <TableHeaderCell key='personName' columnName='personName' handleOrderBy={handleOrderBy}
                                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                                        orderDirection={tableProp.orderDirection} text='Person_Name'
                  />                
                  <TableHeaderCell key='mobile' columnName='mobile' handleOrderBy={handleOrderBy}
                                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                                        orderDirection={tableProp.orderDirection} text='Mobile_Number'
                  />
                  <TableHeaderCell key='email' columnName='email' handleOrderBy={handleOrderBy} isOrderByAvailable={true}
                                        orderBy={tableProp.orderBy} orderDirection={tableProp.orderDirection}
                                        text='Email'
                  />
                  <TableHeaderCell key='image' columnName='image' handleOrderBy={handleOrderBy}
                                        isOrderByAvailable={true} orderBy={tableProp.orderBy}
                                        orderDirection={tableProp.orderDirection} text='Image'
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
                        <td colSpan='7'>
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
                              <td colSpan='12'>
                                    <div className='p-4 w-full text-center'>
                                      <p className='text-red-500 font-bold'>Data not found</p>
                                    </div>
                                  </td>
                            </tr>
                          )}
                      </>
                    )}
                {tableData.map(
                  (rowObj, key) => (
                    <tr key={rowObj.id}>
                        <td className='py-2 px-2 border-b border-blue-gray-50 items-center'>
                            <div className='flex flex-row gap-3'>
                                <Typography className='text-xs font-semibold text-blue-gray-600 dark:text-gray-200'>
                                    {rowObj.srno}.
                                  </Typography>
                                <>
                                    <Tooltip className='text-xs p-1' content='edit'>
                                        <Typography
                                          as='button'
                                          className='text-base font-semibold text-blue-600'
                                          onClick={() => handleEdit(rowObj)}
                                        >
                                          <i className='fas fa-pen-to-square' />
                                        </Typography>
                                      </Tooltip>
                                    <TableStatusButton changeStatus={changeStatus} rowObj={rowObj} />
                                  </>
                              </div>
                          </td>
                        <TableCell text={rowObj.userName} />
                        <TableCell text={rowObj.personName} />                      
                        <TableCell text={rowObj.mobile} />
                        <TableCell text={rowObj.email} />
                        <td className='py-1 px-2 border-b border-blue-gray-50'>
                            {rowObj.image && (
                                <Button
                                  className='p-0.5 w-7 h-7 text-blue-600'
                                  size='sm'
                                  variant='text'
                                  onClick={() => downloadDocument(rowObj)}
                                >
                                  {rowObj.image.endsWith('.pdf')
                                    ? (
                                      <div className='m-0.5'>
                                            <svg height='1.5em' viewBox='0 0 32 32' width='1.5em' xmlns='http://www.w3.org/2000/svg'><path d='m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945L24.1 2.072' fill='#909090' /><path d='M24.031 2H8.808v27.928h20.856V7.873L24.03 2' fill='#f4f4f4' /><path d='M8.655 3.5h-6.39v6.827h20.1V3.5H8.655' fill='#7a7b7c' /><path d='M22.472 10.211H2.395V3.379h20.077v6.832' fill='#dd2025' /><path d='M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2.042 2.042 0 0 0 .647-.117a1.427 1.427 0 0 0 .493-.291a1.224 1.224 0 0 0 .335-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.409-.104a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892' fill='#464648' /><path d='M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511Zm-2.357.083a7.543 7.543 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14.216 14.216 0 0 0 1.658 2.252a13.033 13.033 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.787 10.787 0 0 1-.517 2.434a4.426 4.426 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444ZM25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14.228 14.228 0 0 0-2.453.173a12.542 12.542 0 0 1-2.012-2.655a11.76 11.76 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.309 9.309 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.622 9.622 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a22.549 22.549 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035' fill='#dd2025' /><path d='M23.954 2.077V7.95h5.633l-5.633-5.873Z' fill='#909090' /><path d='M24.031 2v5.873h5.633L24.031 2Z' fill='#f4f4f4' /><path d='M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2.042 2.042 0 0 0 .647-.117a1.428 1.428 0 0 0 .493-.291a1.224 1.224 0 0 0 .332-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.411-.105a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892' fill='#fff' /></svg>
                                          </div>
                                      )
                                    : (
                                      <Avatar size='xs' src={`${import.meta.env.VITE_API_URL}/api/userApi/downloadDocument?name=${rowObj.image}`} variant='rounded' />
                                    )
                                  }
                                </Button>
                              )}
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
        <Edit isEditOpen={isEditOpen} refreshTableData={refreshTableData} selectedRecord={selectedRecord} setIsEditOpen={setIsEditOpen} />
      </Suspense>
    </div>
  )
}

export default UserMasterHolder

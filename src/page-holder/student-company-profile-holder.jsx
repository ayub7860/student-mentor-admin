import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip, Button, Input, Tooltip,
    Avatar
  } from '@material-tailwind/react'
  import React, { Suspense, useRef, useState } from 'react'
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
import { validateFormData } from '@/hooks/validation'
import { checkDocumentMimeType, checkFileSize, maxSelectFile } from '@/hooks/fileValidationUtils'
  dayjs.extend(customParseFormat)
  
  const Add = React.lazy(() => import('../page-sections/student/add'))
  const Edit = React.lazy(() => import('../page-sections/student/edit'))
  const View = React.lazy(() => import('../page-sections/image/view'))

  export default function TeacherMasterHolder () {
    const navigate = useNavigate()
      const fileInputRef1 = useRef(null)
      const fileInputRef2 = useRef(null)
    
    const [controller] = useMaterialTailwindController()
    const { sidenavColor, theme } = controller
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState({})
    const [isViewOpen, setIsViewOpen] = useState(false)
  
    const [formData, setFormData] = useState({
      companyName: "N/A",
      companyLocation: "N/A",
      studentName: "N/A",
      studentEmail: "N/A",
      mobile: "N/A",
      projectName: "N/A",
      projectDescription: "N/A",
      joiningDate: "2024-06-01",
      endDate: "2024-12-01",
      internshipLetter: null,
      projectLetter: null,
    });
    const [editMode, setEditMode] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    // Handle file uploads
    const handleFileChange = (e) => {
      const { name, files } = e.target;
      setFormData({ ...formData, [name]: files[0] });
    };

  
    React.useEffect(() => {
      document.title = 'Mentor | Company profile Master'
      getMyProfile();
    }, [])

    const getMyProfile = () => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/studentApi/getMyProfile`)
        .then((response) => {
          if (response.status === 200) {
            const { personName, mobile, email } = response.data
            const name = `${personName}`
            setFormData({ 
              companyName: response.data.companyName,
              companyLocation: response.data.companyLocation,
              studentName: response.data.name,
              studentEmail: response.data.email,
              mobile: response.data.mobile,
              projectName: response.data.projectName,
              projectDescription: response.data.projectDescription,
              joiningDate: response.data.joiningDate,
              endDate: response.data.endDate,
              internshipLetter: response.data.internshipLetter,
              projectLetter: response.data.projectLetter,
            })
          }
        })
        .catch((errors) => {
          handleError(errors, theme)
        })
    }
  
    const handleEdit = (obj) => {
      setSelectedRecord(obj)
      setIsEditOpen(true)
    }

    const removeFile = (name) => {
      setFormData({ ...formData, [name]: null });
    };

      const submitData = async () => {
        const validationRules = [
          { field: 'companyName', message: 'Please enter company name.' },
          { field: 'companyLocation', message: 'Please enter company location.' },
          { field: 'studentName', message: 'Please enter student name.' },
          { field: 'studentEmail', message: 'Please enter studnet email.' },
          { field: 'mobile', message: 'Please enter student mobile number.' },
          { field: 'projectName', message: 'Please enter project name.' },
          { field: 'projectDescription', message: 'Please enter project description.' },
          { field: 'joiningDate', message: 'Please enter internship joining date.' },
          { field: 'endDate', message: 'Please enter inyernship end date.' },
          // { field: 'internshipLetter', message: 'Please upload internship letter.' },
          // { field: 'projectLetter', message: 'Please upload project letter.' },
        ]
        const hasError = validateFormData(formData, validationRules, theme)
        if (!hasError) {
          const { companyName, companyLocation, studentName, studentEmail, mobile, projectName, projectDescription, joiningDate, endDate, internshipLetter, projectLetter } = formData
          const data = {
            companyName, companyLocation, studentName, studentEmail, mobile, projectName, projectDescription, joiningDate, endDate, internshipLetter, projectLetter
          }
          try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/studentApi/updateCompanyProfile`, data)
            const statusMessages = {
              200: 'Company Profile updated successfully !',
              201: 'Company Profile updated successfully !',
              202: 'Your request has been received and is being processed. Please wait for the results.',
              204: 'The server couldn\'t find any information to show or work with.',
              default: 'Please try reloading the page.'
            }
            const message = statusMessages[response.status] || statusMessages.default
            toast.success(message, { position: 'top-center', theme })
            setEditMode(false)
            // handleClose()
          } catch (error) {
            handleError(error, theme)
            switch (error.response.status) {
              case 401:
                window.location.replace(import.meta.env.VITE_LOGIN_URL)
                break
              case 403:
                navigate('/student/dashboard', { replace: true })
                break
              default:
            }
          }
        }
      }

      const onDocumentUpload = (event) => {
        const files = event.target.files
        if (maxSelectFile(files) && checkDocumentMimeType(files) && checkFileSize(files)) {
          if (event.target.value) {
            const data = new FormData()
            Array.from(files).forEach(file => {
              data.append('file', file)
            })
            axios
              .post(`${import.meta.env.VITE_API_URL}/api/publicApi/uploadDocuments`, data)
              .then((res) => {
                setFormData({
                  ...formData,
                  [event.target.name]: res.data.fname
                })
              })
              .catch((error) => {
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
              })
          }
        } else event.target.value = null
      }

      const removeUploadedFile1 = () => {
        setFormData({
          ...formData,
          internshipLetter: ''
        })
        if (fileInputRef1.current) fileInputRef1.current.value = null
      }
      const removeUploadedFile2 = () => {
        setFormData({
          ...formData,
          projectLetter: ''
        })
        if (fileInputRef2.current) fileInputRef2.current.value = null
      }
    
      const downloadDocument = (obj) => {
        setSelectedRecord(obj)
        setIsViewOpen(true)
      }
    
    return (
      <div className='mt-12 mb-8 flex flex-col gap-12 animate-fade-in transform'>
        <Card className='bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800'>
          <CardHeader className='mb-4 p-3' color={sidenavColor} variant='gradient'>
            <div className='flex flex-col md:flex-row justify-between'>
              <Typography color='white' variant='h6'>
              Company Information
              </Typography>
              <div className='flex flex-col md:flex-row gap-2'>
               
                <div className='flex flex-row gap-2'>
                  <>
                    {/* <Button
                        className='inline-flex self-center'
                        color='white' size='sm' variant='outlined' onClick={event => { event.preventDefault(); setIsAddOpen(true) }}
                    >
                      <i className='fas fa-edit self-center pr-1' />
                      Edit Details
                    </Button> */}
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
             
            <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Internship Details</h2>
                <div>
                  <p className='text-lg'> Teacher Status :- 
                  <span>
                    {formData.isCompanyApproved === 1 ? <span className='text-green-500'> Approved </span> : formData.isCompanyApproved === 2 ? <span className='text-red-500'> Not Approved </span> : <span className='text-yellow-500'> Pending.. </span>}
                  </span> 
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Details */}
                  <div>
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    <p className="text-gray-700">
                      <strong>Name:</strong>{" "}
                      {editMode ? (
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="border p-2 w-full" />
                      ) : (
                        formData.companyName
                      )}
                    </p>
                    <p className="text-gray-700">
                      <strong>Location:</strong>{" "}
                      {editMode ? (
                        <input type="text" name="companyLocation" value={formData.companyLocation} onChange={handleChange} className="border p-2 w-full" />
                      ) : (
                        formData.companyLocation
                      )}
                    </p>
                  </div>

                  {/* Student Details */}
                  <div>
                    <h3 className="text-lg font-semibold">Student Information</h3>
                    <p className="text-gray-700">
                      <strong>Name:</strong>{" "}
                      {formData.studentName}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      {formData.studentEmail}
                    </p>
                    <p className="text-gray-700">
                      <strong>Mobile:</strong>{" "}
                      {formData.mobile}
                    </p>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h3 className="text-lg font-semibold">Project Information</h3>
                    <p className="text-gray-700">
                      <strong>Project Name:</strong>{" "}
                      {editMode ? (
                        <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="border p-2 w-full" />
                      ) : (
                        formData.projectName
                      )}
                    </p>
                    <p className="text-gray-700">
                      <strong>Description:</strong>{" "}
                      {editMode ? (
                        <textarea name="projectDescription" value={formData.projectDescription} onChange={handleChange} className="border p-2 w-full" />
                      ) : (
                        formData.projectDescription
                      )}
                    </p>
                  </div>

                  {/* Internship Dates */}
                  <div>
                    <h3 className="text-lg font-semibold">Internship Duration</h3>
                    <p className="text-gray-700">
                      <strong>Joining Date:</strong>{" "}
                      {editMode ? (
                        <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="border p-2 w-full" />
                      ) : (
                        formData.joiningDate
                      )}
                    </p>
                    <p className="text-gray-700">
                      <strong>End Date:</strong>{" "}
                      {editMode ? (
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="border p-2 w-full" />
                      ) : (
                        formData.endDate
                      )}
                    </p>
                  </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Internship Letter Upload */}
                           
                  {editMode ? (
                    <div className=''>
                                <label className='block text-lg font-semibold text-gray-700 pl-1'>
                                Internship Letter
                                </label>
                                <div
                                  className='border-2 border-dashed border-gray-300 mb-2'
                                  onClick={() => document.getElementById('uploadDocument').click()}
                                >
                                  <div className='mx-auto mb-2 w-full cursor-pointer rounded-md text-center'>
                                    <label className='m-1 flex cursor-pointer flex-col items-center justify-center space-y-1'>
                                        <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                          <path d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' strokeLinecap='round' strokeLinejoin='round' />
                                        </svg>
                                        <span className='text-gray-900'>Choose file to upload</span>
                                      </label>
                                    <span className='hidden'>
                                        <Input
                                          ref={fileInputRef1}
                                          accept='*/*'
                                          capture='camera'
                                          id='uploadDocument'
                                          label='Image'
                                          name='internshipLetter'
                                          type='file'
                                          onChange={onDocumentUpload}
                                        />
                                      </span>
                                  </div>
                                  {formData.internshipLetter && (
                                  <div className='flex flex-wrap justify-center justify-items-center'>
                                        <div className='flex justify-between text-center bg-gray-300 p-1 sm:w-[325px] lg:w-[375px]'>
                                          {formData.internshipLetter.endsWith('.pdf')
                                            ? (
                                              <div className='flex'>
                                                    <div className='mx-2 my-auto'>
                                                      <svg height='1.5em' viewBox='0 0 32 32' width='1.5em' xmlns='http://www.w3.org/2000/svg'><path d='m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945L24.1 2.072' fill='#909090' /><path d='M24.031 2H8.808v27.928h20.856V7.873L24.03 2' fill='#f4f4f4' /><path d='M8.655 3.5h-6.39v6.827h20.1V3.5H8.655' fill='#7a7b7c' /><path d='M22.472 10.211H2.395V3.379h20.077v6.832' fill='#dd2025' /><path d='M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2.042 2.042 0 0 0 .647-.117a1.427 1.427 0 0 0 .493-.291a1.224 1.224 0 0 0 .335-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.409-.104a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892' fill='#464648' /><path d='M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511Zm-2.357.083a7.543 7.543 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14.216 14.216 0 0 0 1.658 2.252a13.033 13.033 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.787 10.787 0 0 1-.517 2.434a4.426 4.426 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444ZM25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14.228 14.228 0 0 0-2.453.173a12.542 12.542 0 0 1-2.012-2.655a11.76 11.76 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.309 9.309 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.622 9.622 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a22.549 22.549 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035' fill='#dd2025' /><path d='M23.954 2.077V7.95h5.633l-5.633-5.873Z' fill='#909090' /><path d='M24.031 2v5.873h5.633L24.031 2Z' fill='#f4f4f4' /><path d='M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2.042 2.042 0 0 0 .647-.117a1.428 1.428 0 0 0 .493-.291a1.224 1.224 0 0 0 .332-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.411-.105a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892' fill='#fff' /></svg>
                                                    </div>
                                                    <div>
                                                      {formData.internshipLetter}
                                                    </div>
                                                  </div>
                                              )
                                            : (
                                              <div className='flex'>
                                                    <Avatar size='lg' src={`${import.meta.env.VITE_API_URL}/api/publicApi/downloadDocument?name=${formData.internshipLetter}`} variant='rounded' />
                                                    <div className='pl-2'>
                                                      {formData.internshipLetter}
                                                    </div>
                                                  </div>
                                              )}
                                          <svg
                                            className='h-[24px] w-[24px] cursor-pointer'
                                            fill='none' stroke='red' strokeWidth='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' onClick={(event) => { event.stopPropagation(); removeUploadedFile1() }}
                                          >
                                            <path d='M6 18L18 6M6 6l12 12' strokeLinecap='round' strokeLinejoin='round' />
                                          </svg>
                                        </div>
                                      </div>
                                  )}
                                </div>
                  </div>
                  ):(
                    <div className='cursor-pointer text-green-500' onClick={() => downloadDocument(formData.internshipLetter)}>
                     Internship Letter :- uploaded
                    </div>
                  )}

                {editMode ? (
                  <div className=''>
                                <label className='block text-lg font-semibold text-gray-700 pl-1'>
                                Project Letter
                                </label>
                                <div
                                  className='border-2 border-dashed border-gray-300 mb-2'
                                  onClick={() => document.getElementById('uploadDocument1').click()}
                                >
                                  <div className='mx-auto mb-2 w-full cursor-pointer rounded-md text-center'>
                                    <label className='m-1 flex cursor-pointer flex-col items-center justify-center space-y-1'>
                                        <svg className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                          <path d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5' strokeLinecap='round' strokeLinejoin='round' />
                                        </svg>
                                        <span className='text-gray-900'>Choose file to upload</span>
                                      </label>
                                    <span className='hidden'>
                                        <Input
                                          ref={fileInputRef2}
                                          accept='*/*'
                                          capture='camera'
                                          id='uploadDocument1'
                                          label='Image'
                                          name='projectLetter'
                                          type='file'
                                          onChange={onDocumentUpload}
                                        />
                                      </span>
                                  </div>
                                  {formData.projectLetter && (
                                  <div className='flex flex-wrap justify-center justify-items-center'>
                                        <div className='flex justify-between text-center bg-gray-300 p-1 sm:w-[325px] lg:w-[375px]'>
                                          {formData.projectLetter.endsWith('.pdf')
                                            ? (
                                              <div className='flex'>
                                                    <div className='mx-2 my-auto'>
                                                      <svg height='1.5em' viewBox='0 0 32 32' width='1.5em' xmlns='http://www.w3.org/2000/svg'><path d='m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945L24.1 2.072' fill='#909090' /><path d='M24.031 2H8.808v27.928h20.856V7.873L24.03 2' fill='#f4f4f4' /><path d='M8.655 3.5h-6.39v6.827h20.1V3.5H8.655' fill='#7a7b7c' /><path d='M22.472 10.211H2.395V3.379h20.077v6.832' fill='#dd2025' /><path d='M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2.042 2.042 0 0 0 .647-.117a1.427 1.427 0 0 0 .493-.291a1.224 1.224 0 0 0 .335-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.409-.104a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892' fill='#464648' /><path d='M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511Zm-2.357.083a7.543 7.543 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14.216 14.216 0 0 0 1.658 2.252a13.033 13.033 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.787 10.787 0 0 1-.517 2.434a4.426 4.426 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444ZM25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14.228 14.228 0 0 0-2.453.173a12.542 12.542 0 0 1-2.012-2.655a11.76 11.76 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.309 9.309 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.622 9.622 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a22.549 22.549 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035' fill='#dd2025' /><path d='M23.954 2.077V7.95h5.633l-5.633-5.873Z' fill='#909090' /><path d='M24.031 2v5.873h5.633L24.031 2Z' fill='#f4f4f4' /><path d='M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2.042 2.042 0 0 0 .647-.117a1.428 1.428 0 0 0 .493-.291a1.224 1.224 0 0 0 .332-.454a2.13 2.13 0 0 0 .105-.908a2.237 2.237 0 0 0-.114-.644a1.173 1.173 0 0 0-.687-.65a2.149 2.149 0 0 0-.411-.105a2.232 2.232 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.942.942 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.677 2.677 0 0 0 1.028-.175a1.71 1.71 0 0 0 .68-.491a1.939 1.939 0 0 0 .373-.749a3.728 3.728 0 0 0 .114-.949a4.416 4.416 0 0 0-.087-1.127a1.777 1.777 0 0 0-.4-.733a1.63 1.63 0 0 0-.535-.4a2.413 2.413 0 0 0-.549-.178a1.282 1.282 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.062 1.062 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a2.926 2.926 0 0 1-.033.513a1.756 1.756 0 0 1-.169.5a1.13 1.13 0 0 1-.363.36a.673.673 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892' fill='#fff' /></svg>
                                                    </div>
                                                    <div>
                                                      {formData.projectLetter}
                                                    </div>
                                                  </div>
                                              )
                                            : (
                                              <div className='flex'>
                                                    <Avatar size='lg' src={`${import.meta.env.VITE_API_URL}/api/publicApi/downloadDocument?name=${formData.projectLetter}`} variant='rounded' />
                                                    <div className='pl-2'>
                                                      {formData.projectLetter}
                                                    </div>
                                                  </div>
                                              )}
                                          <svg
                                            className='h-[24px] w-[24px] cursor-pointer'
                                            fill='none' stroke='red' strokeWidth='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' onClick={(event) => { event.stopPropagation(); removeUploadedFile2() }}
                                          >
                                            <path d='M6 18L18 6M6 6l12 12' strokeLinecap='round' strokeLinejoin='round' />
                                          </svg>
                                        </div>
                                      </div>
                                  )}
                                </div>
                  </div>
                ):(                  
                  <div className='cursor-pointer text-green-500' onClick={() => downloadDocument(formData.projectLetter)}>
                   Project Letter :- uploaded
                  </div>
                )}
                </div>      
             

                {/* Buttons */}
                <div className="flex justify-end space-x-4 mt-6">
                  {editMode ? (
                    <Button
                    className='inline-flex self-center'
                    size='sm' variant='outlined' onClick={() => submitData()}
                    >
                    Save Details
                  </Button>
                  ) : (
                    <Button
                        className='inline-flex self-center'
                        size='sm' variant='outlined' onClick={() => setEditMode(true)}
                        >
                        <i className='fas fa-edit self-center pr-1' />
                        Edit Details
                      </Button>
                  )}
                </div>
              </div>

            </div>
            
          </CardBody>
        </Card>
        <Suspense fallback={<div />}>
          <View isViewOpen={isViewOpen} selectedRecord={selectedRecord} setIsViewOpen={setIsViewOpen} />

          {/* <Add isAddOpen={isAddOpen} refreshTableData={refreshTableData} setIsAddOpen={setIsAddOpen} />
          <Edit isEditOpen={isEditOpen} refreshTableData={refreshTableData} selectedRecord={selectedRecord} setIsEditOpen={setIsEditOpen} /> */}
        </Suspense>
      </div>
    )
  }
  
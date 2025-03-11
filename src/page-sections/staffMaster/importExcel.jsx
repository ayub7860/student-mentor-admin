import React, {Fragment, useRef, useState} from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    Button,
    CardBody,
    Input,
    Typography, Select, Option,
    Tooltip
} from "@material-tailwind/react";
import readXlsxFile from 'read-excel-file'
import {toast} from "react-toastify";
import AsyncSelect from "react-select/async";
import {fetchData} from '@/hooks/fetchData';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useMaterialTailwindController} from "@/context/index.jsx";
import {handleError} from "@/hooks/errorHandling.js";
import {
    checkDocumentMimeTypeAsXlsx,
    checkFileSize,
    maxSelectFile
} from "@/hooks/fileValidationUtils.js";
import {validateFormData} from "@/hooks/validation.js";

export default function ImportExcel(props) {
    const navigate = useNavigate();
    const [controller, dispatch] = useMaterialTailwindController();
    const {sidenavColor, accessCodes, isAccessCodeLoaded, theme } = controller;
    const fileInputRef = useRef(null);
    const [fileSelected, setFileSelected] = useState(null);
    const [tableData, setTableData] = useState([]);

    const onDocumentUpload = (event) => {
        setTableData([]);
        const files = event.target.files;
        if (maxSelectFile(files, theme) && checkDocumentMimeTypeAsXlsx(files, theme) && checkFileSize(files, theme)) {
            if (event.target.value) {
                Array.from(files).forEach(file => {
                    setFileSelected(file);
                    parseExcelFile(file);
                });
            }
        } else event.target.value = null;
    };

    const removeUploadedFile = () => {
        setFileSelected(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        setTableData([]);
    }

    const parseExcelFile = (file) => {
        readXlsxFile(file).then((rows) => {
            processExcelData(rows);
        });
    };

    const processExcelData = (jsonData) => {
        const data = jsonData.slice(1);
        let newJsonData = [];
        let srno = 1;

        const excelDateToJSDate = (serial) => {
            const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
            return date.toISOString().split('T')[0];
        };

        data.forEach((row) => {
            const rowData = {
                srno: srno++,
                STAFF_CODE: row[0] !== undefined ? row[0] : null,
                STAFF_NAME: row[1] !== undefined ? row[1] : null,
                MOBILE: row[2] !== undefined ? row[2] : null,
                OTHER_NUMBER: row[3] !== undefined ? row[3] : null,
                ADDRESS: row[4] !== undefined ? row[4] : null,
                CITY: row[5] !== undefined ? row[5] : null,
                // JOINING_DATE: row[6] !== undefined ? row[6] : null,
                JOINING_DATE: row[6] !== undefined ? (isNaN(row[6]) ? row[6] : excelDateToJSDate(row[6])) : null, // Convert if needed
                BRANCH_NAME: row[7] !== undefined ? row[7] : null,
                DIVISION: row[8] !== undefined ? row[8] : null,               
                status: 0,   
            };
            newJsonData.push(rowData);
        });
        setTableData(newJsonData); 
        toast.success('Data Loading...')
    }
    
    const handleDelete = (obj, key) => {
        if (obj.status === 2) {
            const newTableData = tableData.filter((data, index) => index !== key);
            setTableData(newTableData);
        } else {
            const isConfirmed = window.confirm('Are you sure you want to delete?');
            if (isConfirmed) {
                const newTableData = tableData.filter((data, index) => index !== key);
                setTableData(newTableData);
            }
        }
    };

    const validateExcel = () => {
        checkDuplicateMobileNumber()
        // const allStatusOne = tableData.every(item => item.status === 1);
        // if(allStatusOne){
        //     submitData()
        // } else {
        //     checkDuplicateMobileNumber();
        // }
    }

    const checkDuplicateMobileNumber = () =>{
        const mobileCount = {};
        tableData.forEach(student => {
          if (mobileCount[student.MOBILE]) {
            mobileCount[student.MOBILE]++;
          } else {
            mobileCount[student.MOBILE] = 1;
          }
        });
    
        const updatedStudents = tableData.map(student => {
          if (mobileCount[student.MOBILE] > 1) {          
            return { ...student, status: 2 };
          } else {
            return { ...student, status: 1 };
          }
        });    
        setTableData(updatedStudents);

        // const allStatusOne = updatedStudents.every(item => item.status === 1);
        // if(allStatusOne){
        //     submitData()
        // }        
    }

    const submitData = async () => {        
        if (tableData.length === 0) {
            toast.warn("Please import valid excel", {
                position: "top-center", theme: theme
            });
        } else {          
            const data = {
                tableData
            };
            toast.success('Please wait until page not close, data is loading...')
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/addStaffFromExcel`, data);
                const statusMessages = {
                    200: 'Staff added successfully.',
                    201: 'Staff added successfully.',
                    202: 'Your request has been received and is being processed. Please wait for the results.',
                    204: 'The server couldn\'t find any information to show or work with.',
                    default: 'Please try reloading the page.',
                };
                const message = statusMessages[response.status] || statusMessages.default;
                toast.success(message, {position: "top-center", theme: theme,});
                props.refreshTableData();
                closeDialog();
            } catch (error) {
                handleError(error, theme);
                switch (error.response.status) {
                    case 401:
                        window.location.replace(import.meta.env.VITE_LOGIN_URL);
                        break;
                    case 403:
                        navigate('/admin/dashboard', {replace: true});
                        break;
                    default:
                }
            }
        }
    }

    const closeDialog = () => {       
        setFileSelected(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        setTableData([]);      
        props.setIsImportExcelOpen(false);
    }

    return (
        <Fragment>
            <Dialog size="xxl" className="z-40" open={props.isImportExcelOpen}>
                <DialogHeader className="bg-gray-100 text-center justify-center">
                    Import Staff Excel
                    <button
                        className="absolute top-2 right-8 bg-transparent border-0 cursor-pointer"
                        onClick={closeDialog}
                        title="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </DialogHeader>
                <DialogBody divider className="bg-white">
                    <CardBody className="px-1 md:px-2 lg:px-4 pt-1 pb-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 w-full">                            
                            <div className="flex flex-col gap-3 w-full">
                                <label className="block text-sm font-semibold text-gray-700 pl-1">
                                    Attachment
                                </label>
                                <div
                                    className="border-2 border-dashed border-gray-400"
                                    onClick={() => document.getElementById("uploadDocument").click()}
                                >
                                    <div className="mx-auto mb-2 w-full cursor-pointer rounded-md text-center">
                                        <label
                                            className="m-1 flex cursor-pointer flex-col items-center justify-center space-y-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                                            </svg>
                                            <span className="text-gray-800">Choose Excel to Import</span>
                                            <span className="text-xs text-gray-700">(Max file size: 15MB)</span>
                                        </label>
                                        <span className="hidden">
                                      <Input
                                          ref={fileInputRef}
                                          label="Image"
                                          type="file"
                                          id="uploadDocument"
                                          name="image"
                                          accept="*/*"
                                          capture="camera"
                                          onChange={onDocumentUpload}
                                      />
                                    </span>
                                    </div>
                                    {fileSelected && (
                                        <div className="flex flex-wrap justify-center justify-items-center">
                                            <div
                                                className="flex justify-between  bg-gray-400 p-1 sm:w-[325px] lg:w-[375px]">
                                                <div className="flex">
                                                    <div className="mx-2 my-auto">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                                             viewBox="0 0 32 32">
                                                            <defs>
                                                                <linearGradient id="vscodeIconsFileTypeExcel0"
                                                                                x1="4.494" x2="13.832" y1="-2092.086"
                                                                                y2="-2075.914"
                                                                                gradientTransform="translate(0 2100)"
                                                                                gradientUnits="userSpaceOnUse">
                                                                    <stop offset="0" stopColor="#18884f"></stop>
                                                                    <stop offset=".5" stopColor="#117e43"></stop>
                                                                    <stop offset="1" stopColor="#0b6631"></stop>
                                                                </linearGradient>
                                                            </defs>
                                                            <path fill="#185c37"
                                                                  d="M19.581 15.35L8.512 13.4v14.409A1.192 1.192 0 0 0 9.705 29h19.1A1.192 1.192 0 0 0 30 27.809V22.5Z"></path>
                                                            <path fill="#21a366"
                                                                  d="M19.581 3H9.705a1.192 1.192 0 0 0-1.193 1.191V9.5L19.581 16l5.861 1.95L30 16V9.5Z"></path>
                                                            <path fill="#107c41" d="M8.512 9.5h11.069V16H8.512Z"></path>
                                                            <path
                                                                d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2Z"
                                                                opacity=".1"></path>
                                                            <path
                                                                d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191Z"
                                                                opacity=".2"></path>
                                                            <path
                                                                d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191Z"
                                                                opacity=".2"></path>
                                                            <path
                                                                d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191Z"
                                                                opacity=".2"></path>
                                                            <path fill="url(#vscodeIconsFileTypeExcel0)"
                                                                  d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.192 1.192 0 0 1 2 21.959V10.041A1.192 1.192 0 0 1 3.194 8.85Z"></path>
                                                            <path fill="#fff"
                                                                  d="m5.7 19.873l2.511-3.884l-2.3-3.862h1.847L9.013 14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359 3.84l2.419 3.905h-1.809l-1.45-2.711A2.355 2.355 0 0 1 9.2 16.8h-.024a1.688 1.688 0 0 1-.168.351l-1.493 2.722Z"></path>
                                                            <path fill="#33c481"
                                                                  d="M28.806 3h-9.225v6.5H30V4.191A1.192 1.192 0 0 0 28.806 3Z"></path>
                                                            <path fill="#107c41" d="M19.581 16H30v6.5H19.581Z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        {fileSelected.name}
                                                    </div>
                                                </div>
                                                <svg
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        removeUploadedFile();
                                                    }}
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth="1.5" stroke="red"
                                                    className="h-[24px] w-[24px] cursor-pointer"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-left gap-1 self-end">
                                {tableData && tableData.length > 0 &&
                                    <div className="flex flex-row gap-2">
                                        {tableData.every(item => item.status === 1) ? (
                                            <Button className="flex items-left gap-3" color="green" onClick={submitData}>
                                                Submit
                                            </Button>
                                        ): (
                                            <Button className="flex items-left gap-3" color="green" onClick={validateExcel}>
                                                Validate
                                            </Button>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                <tr>
                                    <th key={'SR.NO'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            SR.NO.
                                        </Typography>
                                    </th>
                                    <th key={'STAFF_NAME'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            STAFF_NAME
                                        </Typography>
                                    </th>
                                    <th key={'MOBILE'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            MOBILE
                                        </Typography>
                                    </th>
                                    <th key={'OTHER_NUMBER'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            OTHER_NUMBER
                                        </Typography>
                                    </th>
                                    <th key={'STAFF_CODE'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            STAFF_CODE
                                        </Typography>
                                    </th>
                                    <th key={'ADDRESS'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            ADDRESS
                                        </Typography>
                                    </th>                                   
                                    <th key={'CITY'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            CITY
                                        </Typography>
                                    </th>
                                    <th key={'JOINING_DATE'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            JOINING_DATE
                                        </Typography>
                                    </th>                                    
                                    <th key={'BRANCH_NAME'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            BRANCH_NAME
                                        </Typography>
                                    </th>
                                    <th key={'DIVISION'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            DIVISION
                                        </Typography>
                                    </th>    
                                    <th key={'REMARK'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            REMARK
                                        </Typography>
                                    </th>                               
                                </tr>
                                </thead>
                                <tbody>
                                {tableData && tableData.map(
                                    (rowObj, key) => {
                                        return (
                                        <tr key={rowObj.id} className={`text-left text-xs ${rowObj.status === 2 ? 'bg-red-100' : ''}`}>
                                            <td className='py-2 px-2 border-b border-blue-gray-50 items-center'>
                                            <div className='flex flex-row gap-3 items-center'>
                                                <Typography className='text-xs font-semibold text-blue-gray-600 dark:text-gray-200'>
                                                    {rowObj.srno}.
                                                </Typography>  
                                                <Tooltip className='text-xs p-1' content='Delete'>
                                                    <Typography
                                                        as='button'
                                                        className='text-base font-semibold text-red-600'
                                                        onClick={event => { event.preventDefault(); handleDelete(rowObj, key) }}
                                                        >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </Typography>
                                                </Tooltip>                           
                                            </div>
                                            </td>
                                            <td className='px-2 border-b'>{rowObj.STAFF_NAME}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.MOBILE}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.OTHER_NUMBER}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.STAFF_CODE}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.ADDRESS}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.CITY}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.JOINING_DATE}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.BRANCH_NAME}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.DIVISION}</td>
                                            {rowObj.status === 1 ? (
                                                <td className='px-2 text-left border-b'>OK</td>
                                            ): rowObj.status === 2 ? (
                                                <td className='px-2 text-left border-b'>Number Duplicate</td>
                                            ): rowObj.status === 2 ? (
                                                <td className='px-2 text-left border-b'>Mobile Number Not Available</td>
                                            ): (
                                                <td className='px-2 text-left border-b'>{' '}</td>
                                            )}
                                        </tr>
                                        )
                                    }
                                )}
                                </tbody>
                            </table>
                        </div>

                    </CardBody>
                </DialogBody>
            </Dialog>
        </Fragment>
    );
}
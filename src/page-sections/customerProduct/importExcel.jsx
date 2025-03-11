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
    const [validationRules, setValidationRules] = useState([
        {id: 1, value: 0, label: 'Number duplicate.'},
    ]);
    const [isValidated, setIsValidated] = useState(false);
   

    const onDocumentUpload = (event) => {
        setTableData([]);
        setValidationRules([
            {id: 1, value: 0, label: 'Number Duplicate'},
        ]);
        setIsValidated(false);
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
        setValidationRules([
            {id: 1, value: 0, label: 'Same sales order no and PO line no.'},
            {id: 2, value: 0, label: 'Item code validation.'},
            {id: 3, value: 0, label: 'Drawing rev. No validation.'},
            {id: 4, value: 0, label: 'Merge qty record in case order no and line no same'},
            {id: 5, value: 0, label: 'Bunch of material validation.'},
            {id: 6, value: 0, label: 'Sales requirement selection in case same requirements exist.'},
        ]);
        setIsValidated(false);
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
            const aadhaarValue = row[13] !== undefined && row[13] !== null ? String(row[13]).replace(/\s+/g, '') : null;
            const accountNumberValue = row[5] !== undefined && row[5] !== null ? String(row[5]).replace(/\s+/g, '') : null;

            const rowData = {
                srno: srno++,
                customerName: row[0] !== undefined ? row[0] : null,
                mobile: row[1] !== undefined ? row[1] : null,
                productType: row[2] !== undefined ? row[2] : null,
                productName: row[3] !== undefined ? row[3] : null,
                days: row[4] !== undefined ? row[4] : null,
                // accountNumber: row[5] !== undefined ? row[5] : null,
                accountNumber: accountNumberValue, // Aadhaar without spaces
                glCode: row[6] !== undefined ? row[6] : null,
                savingAccountNumber: row[7] !== undefined ? row[7] : null,
                amount: row[8] !== undefined ? row[8] : null,
                // openingDate: row[9] !== undefined ? row[9] : null,
                // maturityDate: row[10] !== undefined ? row[10] : null,
                openingDate: row[9] !== undefined ? (isNaN(row[9]) ? row[9] : excelDateToJSDate(row[9])) : null, // Convert if needed
                maturityDate: row[10] !== undefined ? (isNaN(row[10]) ? row[10] : excelDateToJSDate(row[10])) : null, // Convert if needed
                maturityAmount: row[11] !== undefined ? row[11] : null,
                branchName: row[12] !== undefined ? row[12] : null,
                // aadhaar: row[13] !== undefined ? row[13] : null,
                aadhaar: aadhaarValue, // Aadhaar without spaces
                staffName: row[14] !== undefined ? row[14] : null,    
                accountType: row[15] !== undefined ? row[15] : null,
                status: 0,   
            };
            newJsonData.push(rowData);
        });
        setTableData(newJsonData);        
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
        const allStatusOne = tableData.every(item => item.status === 1);
        if(allStatusOne){
            submitData()
        } else {
            checkDuplicateAccountNumber();
        }
    }

    // const checkDuplicateAccountNumber = () =>{
    //     const mobileCount = {};
    //     tableData.forEach(student => {
    //       if (mobileCount[student.accountNumber]) {
    //         mobileCount[student.accountNumber]++;
    //       } else {
    //         mobileCount[student.accountNumber] = 1;
    //       }
    //     });
    
    //     const updatedStudents = tableData.map(student => {
    //       if (mobileCount[student.accountNumber] > 1) {          
    //         return { ...student, status: 2 };
    //       } else {
    //         return { ...student, status: 1 };
    //       }
    //     });    
    //     setTableData(updatedStudents);

    //     const allStatusOne = updatedStudents.every(item => item.status === 1);
    //     if(allStatusOne){
    //         submitData()
    //     }        
    // }

    const checkDuplicateAccountNumber = () => {
        const entryCount = {};
      
        // Create a key using accountNumber and glCode for uniqueness
        tableData.forEach(entry => {
          const key = `${entry.accountNumber}_${entry.glCode}`;
          if (entryCount[key]) {
            entryCount[key]++;
          } else {
            entryCount[key] = 1;
          }
        });
      
        const updatedEntries = tableData.map(entry => {
          const key = `${entry.accountNumber}_${entry.glCode}`;
          if (entryCount[key] > 1) {          
            return { ...entry, status: 2 }; // Mark as duplicate
          } else {
            return { ...entry, status: 1 }; // Mark as unique
          }
        });
      
        setTableData(updatedEntries);
      
        // Check if all entries are unique
        const allStatusOne = updatedEntries.every(item => item.status === 1);
        if (allStatusOne) {
          submitData(); // Proceed if all entries are unique
        }        
      };
      

    const submitData = async () => {        
        if (tableData.length === 0) {
            toast.warn("Please import valid excel", {
                position: "top-center", theme: theme
            });
        } else {          
            const data = {
                tableData
            };
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/adminCustomerProductApi/addCustomerProductFromExcel`, data);
                const statusMessages = {
                    200: 'Customer Product added successfully.',
                    201: 'Customer Product added successfully.',
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
        setIsValidated(false);
        props.setIsImportExcelOpen(false);
    }

    return (
        <Fragment>
            <Dialog size="xxl" className="z-40" open={props.isImportExcelOpen}>
                <DialogHeader className="bg-gray-100 text-center justify-center">
                    Import Customer Product Excel
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
                                <div className="flex flex-row gap-2">
                                    <Button className="flex items-left gap-3" color="green" onClick={validateExcel}>
                                        Submit
                                    </Button>
                                </div>
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
                                    <th key={'customerName'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            CUSTOMER_NAME
                                        </Typography>
                                    </th>
                                    <th key={'mobile'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            MOBILE
                                        </Typography>
                                    </th>
                                    <th key={'productType'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            PRODUCT_TYPE
                                        </Typography>
                                    </th>    
                                    <th key={'productName'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            PRODUCT_NAME
                                        </Typography>
                                    </th>                      
                                    <th key={'accountNumber'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            ACCOUNT_NUMBER
                                        </Typography>
                                    </th>
                                    <th key={'glCode'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            GLCODE
                                        </Typography>
                                    </th>  
                                    <th key={'savingAccountNumber'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            SAVING_ACCOUNT_NUMBER
                                        </Typography>
                                    </th>
                                    <th key={'amount'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            AMOUNT
                                        </Typography>
                                    </th>
                                    <th key={'openingDate'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            OPENING_DATE
                                        </Typography>
                                    </th>    
                                    <th key={'maturityDate'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            MATURUTY_DATE
                                        </Typography>
                                    </th>                                    
                                    <th key={'maturityAmount'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            MATURITY_AMOUNT
                                        </Typography>
                                    </th>
                                    <th key={'branchName'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            BRANCH_NAME
                                        </Typography>
                                    </th>   
                                    <th key={'aadhaar'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            AADHAAR
                                        </Typography>
                                    </th>
                                    <th key={'staffName'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            STAFF_NAME
                                        </Typography>
                                    </th>
                                    <th key={'accountType'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            TYPE
                                        </Typography>
                                    </th>                                    
                                    <th key={'status'} className="border-b border-gray-700 py-2 px-2 text-left">
                                        <Typography as="text" variant="small"
                                                    className={`text-blue-gray-400 text-[11px] font-bold flex flex-row`}>
                                            STATUS
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
                                            <td className='px-2 border-b'>{rowObj.customerName}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.mobile}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.productType}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.productName}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.accountNumber}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.glCode}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.savingAccountNumber}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.amount}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.openingDate}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.maturityDate}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.maturityAmount}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.branchName}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.aadhaar}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.staffName}</td>
                                            <td className='px-2 text-left border-b'>{rowObj.accountType}</td>                              
                                            {rowObj.status === 1 ? (
                                                <td className='px-2 text-left border-b'>OK</td>
                                            ): rowObj.status === 2 ?(
                                                <td className='px-2 text-left border-b'>Account Number Duplicate</td>
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
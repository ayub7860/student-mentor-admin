import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Typography
} from '@material-tailwind/react'
import axios from 'axios'
import { validateFormData } from '@/hooks/validation.js'
import { handleError } from '@/hooks/errorHandling.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CancelButton, SubmitButton } from '@/widgets/components/index.js'
import { useMaterialTailwindController } from '@/context/index.jsx'
import { fetchData } from '@/hooks/fetchData'
import AsyncSelect from "react-select/async";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

function ShowDateTime (props) {
  const date = dayjs(props.timestamp, { format: 'DD MM YYYY' })
  const formattedDate = date.format('DD MMM YYYY')
  return <>{formattedDate}</>
}

export default function Add (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    branchName: '',
    totalCustomer: '',
    totalCustomerProduct: '',
    totalAmount: '',
    totalSavingAccount: '',
    totalCurrentAccount: '',
    totalPigmyAccount: '',
    totalFDAccount: '',
    totalLoanAccount: '',
    totalRDAccount: '',
    totalRecoveryAccount: '',
    totalRecoveryAmount: '',
    totalFreshAmount: '',
    totalExistingAmount: '',
    totalRenewalAmoount: '',
    totalRDAmount: ''
  })
  const [tableData, setTableData] = useState([]);

  React.useEffect(() => {
    document.title = 'Aditya-Anangha | Staff History'
    if (props.isViewOpen) {
      setFormData({
        ...formData,
        name: props.selectedRecord.name,
        branchName: props.selectedRecord.branchName,
        mobile: props.selectedRecord.mobile,
        totalCustomer: props.selectedRecord.totalCustomer,
        totalCustomerProduct: props.selectedRecord.totalCustomerProduct,
        totalAmount: props.selectedRecord.totalAmount,
        totalSavingAccount: props.selectedRecord.totalSavingAccount,
        totalCurrentAccount: props.selectedRecord.totalCurrentAccount,
        totalPigmyAccount: props.selectedRecord.totalPigmyAccount,
        totalFDAccount: props.selectedRecord.totalFDAccount,
        totalLoanAccount: props.selectedRecord.totalLoanAccount,
        totalRDAccount: props.selectedRecord.totalRDAccount,
        totalRecoveryAccount: props.selectedRecord.totalRecoveryAccount,
        totalRecoveryAmount: props.selectedRecord.totalRecoveryAmount,
        totalFreshAmount: props.selectedRecord.freshAmount,
        totalExistingAmount: props.selectedRecord.existingAmount,
        totalRenewalAmoount: props.selectedRecord.renewalAmount,
        totalRDAmount: props.selectedRecord.RDAmount
      })

      Promise.all([
        fetchData(`${import.meta.env.VITE_API_URL}/api/adminStaffApi/getStaffBranchTrack?id=${props.selectedRecord.id}`, theme),
      ]).then(([ data  ]) => {
        setTableData(data.tableData);
      });
    }
  }, [props.isViewOpen])

  const closeDialog = () => {
    props.setIsViewOpen(false);
    setTableData([]);
    setFormData({
      ...formData,
      name: '',
      branchName: '',
      mobile: '',
      totalCustomer: '',
      totalCustomerProduct: '',
      totalAmount: '',
      totalSavingAccount: '',
      totalCurrentAccount: '',
      totalPigmyAccount: '',
      totalFDAccount: '',
      totalLoanAccount: '',
      totalRDAccount: '',
      totalRecoveryAccount: '',
      totalRecoveryAmount: '',
      totalFreshAmount: '',
      totalExistingAmount: '',
      totalRenewalAmoount: '',
      totalRDAmount: ''
    })
  }

  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isViewOpen} size={isMobile ? 'xxl' : 'xxl'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Staff Details</DialogHeader>
        <DialogBody divider>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 w-full'>
            <Typography>Name : {formData.name}</Typography>
            <Typography>Current Branch Name : {formData.branchName}</Typography>
            <Typography>Total Fresh : {formData.totalFreshAmount}</Typography>
            <Typography>Total Existing : {formData.totalExistingAmount}</Typography>
            <Typography>Total Renewal : {formData.totalRenewalAmoount}</Typography>
            <Typography>Total RD : {formData.totalRDAmount}</Typography>
            <Typography>Total Amount : {formData.totalAmount}</Typography>
            {/* <Typography>Total Customer : {formData.totalCustomer}</Typography>
            <Typography>Total Account : {formData.totalCustomerProduct}</Typography>
            <Typography>Total Amount : {formData.totalAmount}</Typography>
            <Typography>Total Saving : {formData.totalSavingAccount}</Typography>
            <Typography>Total Current : {formData.totalCurrentAccount}</Typography>
            <Typography>Total Pigmy : {formData.totalPigmyAccount}</Typography>
            <Typography>Total FD : {formData.totalFDAccount}</Typography>
            <Typography>Total Loan : {formData.totalLoanAccount}</Typography>
            <Typography>Total Rd : {formData.totalRDAccount}</Typography>
            <Typography>Total Recovery Account : {formData.totalRecoveryAccount}</Typography>
            <Typography>Total Recovery Amount : {formData.totalRecoveryAmount}</Typography> */}
          </div>
          <div className='mt-4'>
            <Typography className='font-bold'>Branch wise details</Typography>
          </div>
          <table className='w-full min-w-[640px] table-auto mb-2'>
            <thead>                 
              <tr className='text-xs text-left border'>
                <th className='py-2 px-2'>Sr.No</th>
                <th className='py-2'>Branch Name</th>
                <th className='py-2'>From Date</th>
                <th className='py-2'>To Date</th>
                <th className='py-2 text-center'>Total Customer</th>
                <th className='py-2 text-center'>Total Account</th>
                <th className='py-2 text-center'>Total Amount</th>
                <th className='py-2 text-center'>Saving</th>
                <th className='py-2 text-center'>Current</th>
                <th className='py-2 text-center'>Pigmy</th>
                <th className='py-2 text-center'>FD</th>
                <th className='py-2 text-center'>Loan</th>
                <th className='py-2 text-center'>RD</th>
                <th className='py-2 text-center'>Total Recovery</th>
                <th className='py-2 text-center'>Recovery Amount</th>                    
              </tr>
            </thead>
              <tbody>                 
                {tableData && tableData.map(
                  (rowObj, key) => {
                    return (
                      <tr key={rowObj.id} className='text-left text-xs'>
                        <td className='py-2 px-2 border-b border-blue-gray-50 items-center'>
                          <div className='flex flex-row gap-3 items-center'>
                            <Typography className='text-xs font-semibold text-blue-gray-600 dark:text-gray-200'>
                              {rowObj.srno}.
                            </Typography>                             
                          </div>
                        </td>
                        <td className='border-b'>{rowObj.branchName}</td>
                        <td className='border-b'>{<ShowDateTime timestamp={rowObj.createdAt} />}</td>
                        <td className='border-b'>{rowObj.newBranchIdFk ? <ShowDateTime timestamp={rowObj.updatedAt} /> : '-'}</td>
                        <td className='text-center border-b'>{rowObj.totalCustomer}</td>
                        <td className='text-center border-b'>{rowObj.totalCustomerProduct}</td>
                        <td className='text-center border-b'>{rowObj.totalAmount? rowObj.totalAmount : '0'}</td>
                        <td className='text-center border-b'>{rowObj.totalSavingAccount}</td>
                        <td className='text-center border-b'>{rowObj.totalCurrentAccount}</td>
                        <td className='text-center border-b'>{rowObj.totalPigmyAccount}</td>
                        <td className='text-center border-b'>{rowObj.totalFDAccount}</td>
                        <td className='text-center border-b'>{rowObj.totalLoanAccount}</td>
                        <td className='text-center border-b'>{rowObj.totalRDAccount}</td>
                        <td className='text-center border-b'>{rowObj.totalRecoveryAccount}</td>
                        <td className='text-center border-b'>{rowObj.totalRecoveryAmount ? rowObj.totalRecoveryAmount : '0'}</td>     
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>  
          {/* </div> */}
        </DialogBody>
        <DialogFooter className='bg-gray-100'>
          <CancelButton onClick={closeDialog} />
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

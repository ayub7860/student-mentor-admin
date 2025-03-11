import React, { Fragment, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input
} from '@material-tailwind/react'
import axios from 'axios'
import { validateFormData } from '@/hooks/validation.js'
import { handleError } from '@/hooks/errorHandling.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CancelButton, ShowDateTime, SubmitButton } from '@/widgets/components/index.js'
import { useMaterialTailwindController } from '@/context/index.jsx'

export default function Add (props) {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [formData, setFormData] = useState({
    name: ''
  })
  const [ tableData, setTableData ] = useState([]);

  const closeDialog = () => {
    setTableData([]);
    props.setIsViewOpen(false);
  }

  React.useEffect(()=> {
    setTableData(props.selectedRecord.tableData)
  },[props.selectedRecord.tableData])

 
  return (
    <Fragment>
      <Dialog className='z-40' handler={closeDialog} open={props.isViewOpen} size={isMobile ? 'xxl' : 'xxl'}>
        <DialogHeader className='bg-gray-100 text-center justify-center'>Recovery Tracking </DialogHeader>
        <DialogBody divider>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className='text-left bg-gray-300'>
              <tr>
                <th className="py-2 px-2 border-b">Sr.No</th>
                <th className="py-2 px-2 border-b">User Name</th>
                {/* <th className="py-2 px-2 border-b">Branch Name</th> */}
                <th className="py-2 px-2 border-b">Remark</th>
                <th className="py-2 px-2 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {tableData && tableData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 text-left text-sm">
                  <td className="py-1 px-2 border-b">{index + 1}</td>
                  <td className="py-1 px-2 border-b">{item.staffName || item.userName}</td>
                  <td className="py-1 px-2 border-b">{item.remark}</td>
                  <td className="py-1 px-2 border-b">{<ShowDateTime timestamp={item.createdAt} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </DialogBody>
        <DialogFooter className='bg-gray-100'>
          <CancelButton onClick={closeDialog} />
          {/* <SubmitButton onClick={submitData} /> */}
        </DialogFooter>
      </Dialog>
    </Fragment>
  )
}

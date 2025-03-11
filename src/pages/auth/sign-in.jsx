import { handleError } from '@/hooks/errorHandling';
import {
  Button,
  Card,
  Checkbox,
  Input,
  Option,
  Select,
  Typography
} from '@material-tailwind/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export function SignIn () {
  const navigate = useNavigate()
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [formData,setFormData] = useState({
    mobile: '',
    otp: '',
  });
  const [role, setRole] = useState("");


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  
  const submitData = async () => {
    try {    
        if (formData.mobile && formData.otp && role) {
          axios
            .post(`${import.meta.env.VITE_API_URL}/api/publicApi/verifyPassword`,{
              mobile: formData.mobile,
              otp: formData.otp,
              role
            })
            .then((response) => {
              if (response.status === 200) {
                toast.success('Login successful.',{
                  position: "top-center"
                });
                setFormData({
                  mobile: '',
                  otp: '',
                });
                console.log('response.data.type', response.data.type);
                if(response.data.type === 'admin'){
                  // window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
                  navigate('/admin/dashboard')
                } else if(response.data.type === 'branch'){
                  window.location.replace(import.meta.env.VITE_BRANCH_URL);
                } else if(response.data.type === 'staff'){
                  window.location.replace(import.meta.env.VITE_STAFF_URL);
                }
                
              } else {
                toast.error(response.data.message,{
                  position: "top-center"
                });
              }
            })
            .catch((errors) => {
              handleError(errors);
            });
        }
        else if (!formData.mobile) {
          toast.error('Please enter username or mobile number',{
            position: "top-center"
          });
        }
        else if (!formData.otp) {
          toast.error('Please enter password',{
            position: "top-center"
          });
        }
        else if (!role) {
          toast.error('Please select role',{
            position: "top-center"
          });
        }
        else {
          toast.error('Please refresh and try again',{
            position: "top-center"
          });
        }
    }
    catch (error) {
      handleError(error);
    }
  }

  return (
    <div className='animate-fade-in transform flex flex-col items-center'>
      <img
        alt='Aditya-Anagha'
        className='w-32 h-32 object-contain'
        src="/img/logo.png"
      />
      <Typography className='loading-text-dashboard text-center' component='h1' variant='h2'>
        Welcome to the Student-Mentor Portal
      </Typography>
      {/* <p className='text-xl font-semibold pt-4 text-blue-300 text-center'>{`${currentDateTime.toLocaleDateString(undefined, { weekday: 'long' })}, ${currentDateTime.getDate()} ${currentDateTime.toLocaleString('en-US', { month: 'long' })} ${currentDateTime.getFullYear()}`}</p> */}
      <Card color="transparent" shadow={false}>
      
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-4">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Mobile Number
          </Typography>
          <Input
            type='number'
            size="lg"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="1234567890"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />         
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Password
          </Typography>
          <Input
            type="password"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            size="lg"
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          {/* <Typography variant="h6" color="blue-gray" className="-mb-3">
            Select Role
          </Typography> */}
          <div className="w-full">
            <Select
              label="Select Role"
              value={role}
              onChange={(value) => setRole(value)}
            >
              <Option value="Admin">Admin</Option>
              <Option value="Teacher">Teacher</Option>
              <Option value="Student">Student</Option>
            </Select>
            {role && <p className="mt-2 text-gray-700">Selected Role: {role}</p>}
          </div>
        </div>        
        <Button onClick={() => submitData()} className="mt-6" fullWidth>
          sign in
        </Button>
        
      </form>
    </Card>

    </div>
  )
}

export default SignIn

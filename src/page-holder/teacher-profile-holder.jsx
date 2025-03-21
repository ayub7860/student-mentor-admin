import {
  Card,
  CardBody,
  Avatar,
  Typography, Button
} from '@material-tailwind/react'
import React, { Suspense, useState } from 'react'
import axios from 'axios'
import { handleError } from '@/hooks/errorHandling.js'
import { useNavigate } from 'react-router-dom'
import { useMaterialTailwindController } from '@/context/index.jsx'

const Update = React.lazy(() => import('../page-sections/profile/teacher-update'))

export function ProfileHolder () {
  const navigate = useNavigate()
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [profileDetails, setProfileDetails] = useState({
    name: '',
    mobile: '',
    email: ''
  })
  React.useEffect(() => {
    document.title = 'Mentor | My Profile'
    getUpdatedDetails()
  }, [])

  const getUpdatedDetails = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/teacherApi/getMyProfile`)
      .then((response) => {
        if (response.status === 200) {
          const { name, mobile, email } = response.data.totalTeacher
          setProfileDetails({ name, mobile, email })
        }
      })
      .catch((errors) => {
        handleError(errors, theme)
        switch (errors.response.status) {
          case 401:
            window.location.replace(import.meta.env.VITE_LOGIN_URL)
            break
          case 403:
            navigate('/teacher/dashboard', { replace: true })
            break
          default:
        }
      })
  }

  return (
    <div className='animate-fade-in transform'>
      <div className='relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(/img/login-background.webp)] bg-cover bg-center'>
        <div className='absolute inset-0 h-full w-full bg-blue-500/50' />
        <Typography className='mb-1 p-6' color='white' variant='h5'>
          Welcome {profileDetails.name}
        </Typography>
      </div>
      <Card className='mx-3 -mt-52 mb-6 lg:mx-4'>
        <CardBody className='p-4'>
          <div className='mb-10 flex items-center justify-between gap-6'>
            <div className='flex items-center gap-6'>
              <Avatar
                  alt='img'
                  className='rounded-lg  shadow-lg shadow-blue-gray-500/40'
                  size='xxl'
                  src='/img/userIcon.jpg'
              />
              <div>
                <Typography className='mb-1' color='blue-gray' variant='h5'>
                  {profileDetails.name}
                </Typography>
                <Typography
                  className='font-normal text-blue-gray-600'
                  variant='small'
                >
                  +91 {profileDetails.mobile}
                  <br />
                  {profileDetails.email}
                </Typography>
                <Button
                    onClick={event => { event.preventDefault(); setIsUpdateOpen(true) }}
                    className="" variant="text" color="blue" size="sm">
                    UPDATE PASSWORD
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <Suspense fallback={<div />}>
        <Update isUpdateOpen={isUpdateOpen} setIsUpdateOpen={setIsUpdateOpen} />
      </Suspense>
    </div>
  )
}

export default ProfileHolder

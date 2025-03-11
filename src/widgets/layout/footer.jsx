import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-tailwind/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useMaterialTailwindController } from '@/context/index.jsx'

export function Footer ({ brandName }) {
  const [controller] = useMaterialTailwindController()
  const { theme } = controller
  const year = new Date().getFullYear()

  // useEffect(() => {
  //   validateUser()
  //   const intervalId = setInterval(() => {
  //     validateUser()
  //   }, 900000)
  //   return () => clearInterval(intervalId)
  // }, [])

  // const validateUser = () => {
  //   axios
  //     .get(`${import.meta.env.VITE_API_URL}/api/verifyAdminToken`)
  //     .then((response) => {
  //       if (response.status !== 200) {
  //         toast.error('Session expired, Please login', {
  //           position: 'top-center', theme
  //         })
  //         window.location.replace(import.meta.env.VITE_LOGIN_URL)
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error('Session expired, Please login', {
  //         position: 'top-center', theme
  //       })
  //       window.location.replace(import.meta.env.VITE_LOGIN_URL)
  //     })
  // }

  return (
    <footer className='py-2 mt-6 animate-fade-in transform'>
      <div className='flex w-full flex-wrap items-center justify-center gap-6 px-2'>
        <Typography className='font-normal text-inherit text-black font-bold' variant='small'>
          &copy; {year}, {' '}
          {brandName}
        </Typography>

      </div>
    </footer>
  )
}

Footer.defaultProps = {
  brandName: 'Student-Mentor System'
}

Footer.propTypes = {
  brandName: PropTypes.string
}

Footer.displayName = '/src/widgets/layout/footer.jsx'

export default Footer

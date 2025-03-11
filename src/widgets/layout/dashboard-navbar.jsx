import React from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs
} from '@material-tailwind/react'
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav
} from '@/context'
import axios from 'axios'
import { toast } from 'react-toastify'
axios.defaults.withCredentials = true

export function DashboardNavbar () {
    const navigate = useNavigate()
  
  const [controller, dispatch] = useMaterialTailwindController()
  const { fixedNavbar, openSidenav, theme } = controller
  const { pathname } = useLocation()
  const [layout, page] = pathname.split('/').filter((el) => el !== '')

  const logout = () => {
    if (confirm('Click OK to logout') === true) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/publicApi/logoutAdmin`)
        .then((response) => {
          toast.success('Logout successful.', {
            position: 'top-center', theme
          })
          navigate('/auth/sign-in')
          // window.location.replace(import.meta.env.VITE_LOGIN_URL)
        })
        .catch((err) => {
          navigate('/auth/sign-in')
          toast.success('Logout successful.', {
            position: 'top-center', theme
          })
          // window.location.replace(import.meta.env.VITE_LOGIN_URL)
        })
    }
  }

  return (
    <Navbar
      fullWidth
      blurred={fixedNavbar}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? 'sticky top-0 z-40 py-1 px-1 xl:px-3 shadow-md shadow-blue-gray-500/5'
          : 'sticky z-40 py-1 px-1 xl:px-3'
      }`}
      color={fixedNavbar ? (theme === 'dark' ? 'blue-gray' : 'white') : 'transparent'}
    >
      <div className='flex flex-col-reverse justify-between gap-2 xl:gap-6 md:flex-row md:items-center animate-fade-in transform'>
        <div className='capitalize flex flex-row'>
          {!openSidenav && (
            <IconButton
                className='hidden xs:hidden sm:hidden md:hidden lg:hidden xl:block 2xl:block'
                color='blue-gray'
                size='sm'
                variant='text'
                onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              {theme === 'dark'
                ? (
                  <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M3 6h10v2H3V6m0 10h10v2H3v-2m0-5h12v2H3v-2m13-4l-1.42 1.39L18.14 12l-3.56 3.61L16 17l5-5l-5-5Z' fill='#f2f2f2' /></svg>
                  )
                : (
                  <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M3 6h10v2H3V6m0 10h10v2H3v-2m0-5h12v2H3v-2m13-4l-1.42 1.39L18.14 12l-3.56 3.61L16 17l5-5l-5-5Z' fill='#888888' /></svg>
                  )}
            </IconButton>
          )}
          <Breadcrumbs
              className={`h-full bg-transparent p-0 transition-all self-center text-blue-gray-600 dark:text-gray-200 ${
                  fixedNavbar ? 'mt-0' : ''
              }`}
              color='blue-gray'
          >
            <Link to={`/${layout}/dashboard`}>
              <Typography
                className={'self-center font-normal transition-all hover:text-blue-500 hover:opacity-100 text-blue-gray-600 dark:text-gray-200 opacity-50 dark:opacity-80'}
                color='blue-gray'
                variant='small'
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              className={'font-normal text-blue-gray-600 dark:text-gray-200'}
              color='blue-gray'
              variant='small'
            >
              {page}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className='flex items-center'>
          <IconButton
              className='grid xl:hidden'
              color='blue-gray'
              size='sm'
              variant='text'
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            {openSidenav
              ? (
                <>
                  {theme === 'dark'
                    ? (
                      <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24'
                           width='1em' xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M21 15.61L19.59 17l-5.01-5l5.01-5L21 8.39L17.44 12L21 15.61M3 6h13v2H3V6m0 7v-2h10v2H3m0 5v-2h13v2H3Z'
                              fill='#f2f2f2'
                        />
                      </svg>
                      )
                    : (
                      <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24'
                           width='1em' xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M21 15.61L19.59 17l-5.01-5l5.01-5L21 8.39L17.44 12L21 15.61M3 6h13v2H3V6m0 7v-2h10v2H3m0 5v-2h13v2H3Z'
                              fill='#888888'
                        />
                      </svg>
                      )}

                </>
                )
              : (
                <>
                  {theme === 'dark'
                    ? (
                      <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24' width='1em'
                           xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M3 6h10v2H3V6m0 10h10v2H3v-2m0-5h12v2H3v-2m13-4l-1.42 1.39L18.14 12l-3.56 3.61L16 17l5-5l-5-5Z'
                              fill='#f2f2f2'
                        /></svg>
                      )
                    : (
                      <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24'
                           width='1em'
                           xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M3 6h10v2H3V6m0 10h10v2H3v-2m0-5h12v2H3v-2m13-4l-1.42 1.39L18.14 12l-3.56 3.61L16 17l5-5l-5-5Z'
                              fill='#888888'
                        />
                      </svg>
                      )}
                </>
                )}
          </IconButton>

          <div className='mr-auto md:mr-4 w-24 flex flex-row'>
            <IconButton
              className='text-blue-gray-600 dark:text-gray-200'
              color='blue-gray'
              size='sm'
              variant='text'
              onClick={() => setOpenConfigurator(dispatch, true)}
            >
              {theme === 'dark'
                ? (
                  <svg className='h-5 w-5' height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'>
                    <path clipRule='evenodd' d='M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082c.312.214.641.405.985.57c.182.088.277.228.297.35l.178 1.071a1.876 1.876 0 0 0 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349c.344-.165.673-.356.985-.57c.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567zM12 15.75a3.75 3.75 0 1 0 0-7.5a3.75 3.75 0 0 0 0 7.5'
                          fill='#f2f2f2'
                          fillRule='evenodd'
                    />
                  </svg>
                  )
                : (
                  <svg className='h-5 w-5' height='1em' viewBox='0 0 24 24' width='1em'
                       xmlns='http://www.w3.org/2000/svg'
                  >
                    <path clipRule='evenodd' d='M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082c.312.214.641.405.985.57c.182.088.277.228.297.35l.178 1.071a1.876 1.876 0 0 0 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349c.344-.165.673-.356.985-.57c.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567zM12 15.75a3.75 3.75 0 1 0 0-7.5a3.75 3.75 0 0 0 0 7.5'
                          fill='#607d8b'
                          fillRule='evenodd'
                    />
                  </svg>
                  )}
            </IconButton>
            <Link to={`/${layout}/profile`}>
              <IconButton
                className='grid'
                color='blue-gray'
                size='sm'
                variant='text'
              >
                {theme === 'dark'
                  ? (
                    <svg className='h-5 w-5' height='1em' viewBox='0 0 16 16' width='1em' xmlns='http://www.w3.org/2000/svg'>
                      <path clipRule='evenodd' d='M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-5-2a2 2 0 1 1-4 0a2 2 0 0 1 4 0M8 9a4.998 4.998 0 0 0-4.295 2.437A5.49 5.49 0 0 0 8 13.5a5.49 5.49 0 0 0 4.294-2.063A4.997 4.997 0 0 0 8 9'
                        fill='#f2f2f2'
                        fillRule='evenodd'
                      />
                    </svg>
                    )
                  : (
                    <svg className='h-5 w-5' height='1em' viewBox='0 0 16 16' width='1em'
                       xmlns='http://www.w3.org/2000/svg'
                    >
                      <path clipRule='evenodd' d='M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-5-2a2 2 0 1 1-4 0a2 2 0 0 1 4 0M8 9a4.998 4.998 0 0 0-4.295 2.437A5.49 5.49 0 0 0 8 13.5a5.49 5.49 0 0 0 4.294-2.063A4.997 4.997 0 0 0 8 9'
                          fill='#607d8b'
                          fillRule='evenodd'
                      />
                    </svg>
                    )}
              </IconButton>
            </Link>
            <IconButton
              color='blue-gray'
              size='sm'
              variant='text'
              onClick={() => logout()}
            >
              {theme === 'dark'
                ? (
                  <svg className='h-5 w-5' height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' fill='none' stroke='#f2f2f2' strokeLinecap='round' strokeLinejoin='round'
                      strokeWidth='1.5'
                    />
                  </svg>
                  )
                : (
                  <svg className='h-5 w-5' height='1em' viewBox='0 0 24 24' width='1em'
                   xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' fill='none' stroke='#607d8b' strokeLinecap='round' strokeLinejoin='round'
                      strokeWidth='1.5'
                    />
                  </svg>
                  )}
            </IconButton>
          </div>
        </div>
      </div>
    </Navbar>
  )
}

DashboardNavbar.displayName = '/src/widgets/layout/dashboard-navbar.jsx'

export default DashboardNavbar

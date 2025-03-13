import React from 'react'
import { isMobile } from 'react-device-detect'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Button,
  IconButton,
  Typography
} from '@material-tailwind/react'
import { useMaterialTailwindController, setOpenSidenav } from '@/context'

export function StudentSidenav () {
  const [controller, dispatch] = useMaterialTailwindController()
  const { sidenavColor, sidenavType, openSidenav } = controller

  React.useEffect(() => {
    if (!isMobile) setOpenSidenav(dispatch, true)
  }, [])

  const sidenavTypes = {
    dark: 'bg-gradient-to-br from-blue-gray-800 to-blue-gray-900',
    white: 'bg-white shadow-lg',
    transparent: 'bg-transparent'
  }
  const { pathname } = useLocation()
  const [layout] = pathname.split('/').filter((el) => el !== '')

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? 'translate-x-0' : '-translate-x-80'
        } fixed inset-0 z-50 my-1 ml-2 h-[calc(100vh-15px)] w-72 rounded-xl transition-transform duration-300  overflow-y-auto animate-fade-in transform`}
    >
      <div
        className={`relative border-b justify-center flex flex-row ${sidenavType === 'dark' ? 'border-white/20' : 'border-blue-gray-50'
          }`}
      >
        <Link className='flex items-center py-2 px-2 w-10/12' to={`/${layout}/dashboard`}>
          <img
            src="/img/staff.webp"
            className="h-full w-full object-cover bg-white rounded-md"
            alt="Aditya-Anangha"/>
        </Link>
        <IconButton
          className='h-full grid rounded-br-none rounded-tl-none self-center w-2/12'
          color='white'
          ripple={false}
          size='sm'
          variant='text'
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          {sidenavType === 'dark'
            ? (
              <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M21 15.61L19.59 17l-5.01-5l5.01-5L21 8.39L17.44 12L21 15.61M3 6h13v2H3V6m0 7v-2h10v2H3m0 5v-2h13v2H3Z' fill='#f2f2f2' /></svg>
              )
            : (
              <svg className='h-6 w-6 text-blue-gray-500' height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M21 15.61L19.59 17l-5.01-5l5.01-5L21 8.39L17.44 12L21 15.61M3 6h13v2H3V6m0 7v-2h10v2H3m0 5v-2h13v2H3Z' fill='#888888' /></svg>
              )}
        </IconButton>
      </div>
      <div>
        <ul key={'dashboard'} className='mb-2 mt-0.5 pl-1 flex flex-col gap-1'>

          <li key={'home'} className="text-md">
            <NavLink to={`/student/dashboard`}>
              {({isActive}) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  onClick={() => {
                    if (isMobile) setOpenSidenav(dispatch, false);
                  }}
                  color={
                    isActive
                      ? sidenavColor
                      : sidenavType === "dark"
                        ? "white"
                        : "blue-gray"
                  }
                  className="flex items-center gap-2 px-3 py-2 capitalize"
                  fullWidth
                >
                  {isActive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" width="1.4em" height="1.4em"
                         viewBox="0 0 1024 1024">
                      <path fill="#FFFFFF" fillOpacity=".15"
                            d="M512 188c-99.3 0-192.7 38.7-263 109c-70.3 70.2-109 163.6-109 263c0 105.6 44.5 205.5 122.6 276h498.8A371.12 371.12 0 0 0 884 560c0-99.3-38.7-192.7-109-263c-70.2-70.3-163.6-109-263-109m-30 44c0-4.4 3.6-8 8-8h44c4.4 0 8 3.6 8 8v80c0 4.4-3.6 8-8 8h-44c-4.4 0-8-3.6-8-8zM270 582c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8v-44c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8zm90.7-204.4l-31.1 31.1a8.03 8.03 0 0 1-11.3 0l-56.6-56.6a8.03 8.03 0 0 1 0-11.3l31.1-31.1c3.1-3.1 8.2-3.1 11.3 0l56.6 56.6c3.1 3.1 3.1 8.2 0 11.3m291.1 83.5l-84.5 84.5c5 18.7.2 39.4-14.5 54.1a55.95 55.95 0 0 1-79.2 0a55.95 55.95 0 0 1 0-79.2a55.87 55.87 0 0 1 54.1-14.5l84.5-84.5c3.1-3.1 8.2-3.1 11.3 0l28.3 28.3c3.1 3.1 3.1 8.2 0 11.3m43-52.4l-31.1-31.1a8.03 8.03 0 0 1 0-11.3l56.6-56.6c3.1-3.1 8.2-3.1 11.3 0l31.1 31.1c3.1 3.1 3.1 8.2 0 11.3l-56.6 56.6a8.03 8.03 0 0 1-11.3 0M846 538v44c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8v-44c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8"></path>
                      <path fill="#FFFFFF"
                            d="M623.5 421.5a8.03 8.03 0 0 0-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 0 0 0 79.2a55.95 55.95 0 0 0 79.2 0a55.87 55.87 0 0 0 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8"></path>
                      <path fill="#FFFFFF"
                            d="M924.8 385.6a446.7 446.7 0 0 0-96-142.4a446.7 446.7 0 0 0-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 0 0-142.4 96a446.7 446.7 0 0 0-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4M761.4 836H262.6A371.12 371.12 0 0 1 140 560c0-99.4 38.7-192.8 109-263c70.3-70.3 163.7-109 263-109c99.4 0 192.8 38.7 263 109c70.3 70.3 109 163.7 109 263c0 105.6-44.5 205.5-122.6 276"></path>
                      <path fill="#FFFFFF"
                            d="m762.7 340.8l-31.1-31.1a8.03 8.03 0 0 0-11.3 0l-56.6 56.6a8.03 8.03 0 0 0 0 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3M750 538v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8M304.1 309.7a8.03 8.03 0 0 0-11.3 0l-31.1 31.1a8.03 8.03 0 0 0 0 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" width="1.4em"
                         height="1.4em" viewBox="0 0 1024 1024">
                      <path fill="#888888" fillOpacity=".15"
                            d="M512 188c-99.3 0-192.7 38.7-263 109c-70.3 70.2-109 163.6-109 263c0 105.6 44.5 205.5 122.6 276h498.8A371.12 371.12 0 0 0 884 560c0-99.3-38.7-192.7-109-263c-70.2-70.3-163.6-109-263-109m-30 44c0-4.4 3.6-8 8-8h44c4.4 0 8 3.6 8 8v80c0 4.4-3.6 8-8 8h-44c-4.4 0-8-3.6-8-8zM270 582c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8v-44c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8zm90.7-204.4l-31.1 31.1a8.03 8.03 0 0 1-11.3 0l-56.6-56.6a8.03 8.03 0 0 1 0-11.3l31.1-31.1c3.1-3.1 8.2-3.1 11.3 0l56.6 56.6c3.1 3.1 3.1 8.2 0 11.3m291.1 83.5l-84.5 84.5c5 18.7.2 39.4-14.5 54.1a55.95 55.95 0 0 1-79.2 0a55.95 55.95 0 0 1 0-79.2a55.87 55.87 0 0 1 54.1-14.5l84.5-84.5c3.1-3.1 8.2-3.1 11.3 0l28.3 28.3c3.1 3.1 3.1 8.2 0 11.3m43-52.4l-31.1-31.1a8.03 8.03 0 0 1 0-11.3l56.6-56.6c3.1-3.1 8.2-3.1 11.3 0l31.1 31.1c3.1 3.1 3.1 8.2 0 11.3l-56.6 56.6a8.03 8.03 0 0 1-11.3 0M846 538v44c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8v-44c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8"></path>
                      <path fill="#888888"
                            d="M623.5 421.5a8.03 8.03 0 0 0-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 0 0 0 79.2a55.95 55.95 0 0 0 79.2 0a55.87 55.87 0 0 0 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8"></path>
                      <path fill="#888888"
                            d="M924.8 385.6a446.7 446.7 0 0 0-96-142.4a446.7 446.7 0 0 0-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 0 0-142.4 96a446.7 446.7 0 0 0-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4M761.4 836H262.6A371.12 371.12 0 0 1 140 560c0-99.4 38.7-192.8 109-263c70.3-70.3 163.7-109 263-109c99.4 0 192.8 38.7 263 109c70.3 70.3 109 163.7 109 263c0 105.6-44.5 205.5-122.6 276"></path>
                      <path fill="#888888"
                            d="m762.7 340.8l-31.1-31.1a8.03 8.03 0 0 0-11.3 0l-56.6 56.6a8.03 8.03 0 0 0 0 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3M750 538v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8M304.1 309.7a8.03 8.03 0 0 0-11.3 0l-31.1 31.1a8.03 8.03 0 0 0 0 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8"></path>
                    </svg>
                  )}
                  <Typography
                    color="inherit"
                    className="subpixel-antialiased font-bold text-base"
                  >
                    Dashboard
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>

          {/* <li key={'teacher master'} className="text-md">
            <NavLink to={`/teacher/teacher-master`}>
              {({isActive}) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  onClick={() => {
                    if (isMobile) setOpenSidenav(dispatch, false);
                  }}
                  color={
                    isActive
                      ? sidenavColor
                      : sidenavType === "dark"
                        ? "white"
                        : "blue-gray"
                  }
                  className="flex items-center gap-2 px-3 py-1 capitalize"
                  fullWidth
                >
                 {isActive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="h-6 w-6 text-gray-300"
                         viewBox="0 0 16 16">
                      <path fill="#FFFFFF" fillRule="evenodd"
                            d="M4.535 3A3.5 3.5 0 0 1 7.25.08v1.67a.75.75 0 1 0 1.5 0V.08A3.5 3.5 0 0 1 11.464 3h.286a.75.75 0 0 1 0 1.5h-.25a3.5 3.5 0 0 1-7 0h-.25a.75.75 0 0 1 0-1.5zM8 6.5a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2m-5.5 6c0-.204.22-.809 1.32-1.459a6 6 0 0 1 .223-.125L5.01 13.5H3.5a1 1 0 0 1-1-1m4.114 1l-1.179-3.143A9.2 9.2 0 0 1 8 10c.93 0 1.8.135 2.565.357L9.387 13.5H6.612Zm4.375 0H12.5a1 1 0 0 0 1-1c0-.204-.22-.809-1.32-1.459a6 6 0 0 0-.223-.125l-.969 2.584ZM8 8.5c-3.85 0-7 2-7 4A2.5 2.5 0 0 0 3.5 15h9a2.5 2.5 0 0 0 2.5-2.5c0-2-3.15-4-7-4"
                            clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="h-6 w-6 text-gray-300"
                         viewBox="0 0 16 16">
                      <path fill="#888888" fillRule="evenodd"
                            d="M4.535 3A3.5 3.5 0 0 1 7.25.08v1.67a.75.75 0 1 0 1.5 0V.08A3.5 3.5 0 0 1 11.464 3h.286a.75.75 0 0 1 0 1.5h-.25a3.5 3.5 0 0 1-7 0h-.25a.75.75 0 0 1 0-1.5zM8 6.5a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2m-5.5 6c0-.204.22-.809 1.32-1.459a6 6 0 0 1 .223-.125L5.01 13.5H3.5a1 1 0 0 1-1-1m4.114 1l-1.179-3.143A9.2 9.2 0 0 1 8 10c.93 0 1.8.135 2.565.357L9.387 13.5H6.612Zm4.375 0H12.5a1 1 0 0 0 1-1c0-.204-.22-.809-1.32-1.459a6 6 0 0 0-.223-.125l-.969 2.584ZM8 8.5c-3.85 0-7 2-7 4A2.5 2.5 0 0 0 3.5 15h9a2.5 2.5 0 0 0 2.5-2.5c0-2-3.15-4-7-4"
                            clipRule="evenodd"></path>
                    </svg>
                  )}
                  <Typography
                    color="inherit"
                    className="subpixel-antialiased font-bold text-base"
                  >
                   Teacher Master
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}

        </ul>
      </div>
    </aside>
  )
}

StudentSidenav.defaultProps = {}

StudentSidenav.displayName = '/src/widgets/layout/student-sidenav'

export default StudentSidenav

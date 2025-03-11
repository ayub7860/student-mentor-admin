import React from 'react'
import {
  Button,
  IconButton,
  Switch,
  Typography
} from '@material-tailwind/react'
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavColor,
  setSidenavType,
  setFixedNavbar,
  setTheme
} from '@/context'

export function Configurator () {
  const [controller, dispatch] = useMaterialTailwindController()
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar, theme } = controller

  const sidenavColors = {
    blue: 'from-blue-400 to-blue-600',
    'blue-gray': 'from-blue-gray-800 to-blue-gray-800',
    green: 'from-green-400 to-green-600',
    orange: 'from-orange-400 to-orange-600',
    red: 'from-red-400 to-red-600',
    pink: 'from-pink-400 to-pink-600'
  }

  return (
    <aside
      className={`fixed top-0 right-0 z-50 h-screen w-96 bg-white dark:bg-gradient-to-br from-blue-gray-700 to-blue-gray-800 px-2.5 shadow-lg transition-transform duration-300 ${
        openConfigurator ? 'translate-x-0' : 'translate-x-96'
      }`}
    >
      <div className='flex items-start justify-between px-6 pt-8 pb-6'>
        <div>
          <Typography className='text-gray-800 dark:text-gray-200' variant='h5'>
            Dashboard Configurator
          </Typography>
          <Typography className='font-normal text-blue-gray-600 dark:text-gray-200'>
            See our dashboard options.
          </Typography>
        </div>
        <IconButton
            className='text-blue-gray-600 dark:text-gray-200'
            variant='text'
            onClick={() => setOpenConfigurator(dispatch, false)}
        >
          {theme === 'dark'
            ? (
              <svg className='h-5 w-5' height='1em' viewBox='0 0 512 512' width='1em' xmlns='http://www.w3.org/2000/svg'>
                <path d='m325.297 256l134.148-134.148c19.136-19.136 19.136-50.161 0-69.297c-19.137-19.136-50.16-19.136-69.297 0L256 186.703L121.852 52.555c-19.136-19.136-50.161-19.136-69.297 0s-19.136 50.161 0 69.297L186.703 256L52.555 390.148c-19.136 19.136-19.136 50.161 0 69.297c9.568 9.567 22.108 14.352 34.648 14.352s25.081-4.784 34.648-14.352L256 325.297l134.148 134.148c9.568 9.567 22.108 14.352 34.648 14.352s25.08-4.784 34.648-14.352c19.136-19.136 19.136-50.161 0-69.297z'
                          fill='#f2f2f2'
                />
              </svg>
              )
            : (
              <svg className='h-5 w-5' height='1em' viewBox='0 0 512 512' width='1em'
                     xmlns='http://www.w3.org/2000/svg'
              >
                <path d='m325.297 256l134.148-134.148c19.136-19.136 19.136-50.161 0-69.297c-19.137-19.136-50.16-19.136-69.297 0L256 186.703L121.852 52.555c-19.136-19.136-50.161-19.136-69.297 0s-19.136 50.161 0 69.297L186.703 256L52.555 390.148c-19.136 19.136-19.136 50.161 0 69.297c9.568 9.567 22.108 14.352 34.648 14.352s25.081-4.784 34.648-14.352L256 325.297l134.148 134.148c9.568 9.567 22.108 14.352 34.648 14.352s25.08-4.784 34.648-14.352c19.136-19.136 19.136-50.161 0-69.297z'
                          fill='#2B3B47'
                />
              </svg>
              )}

        </IconButton>
      </div>
      <div className='py-4 px-6'>
        <div className='mb-12'>
          <Typography className='text-blue-gray-600 dark:text-gray-200' variant='h6'>
            Sidenav Colors
          </Typography>
          <div className='mt-3 flex items-center gap-2'>
            {Object.keys(sidenavColors).map((color) => (
              <span
                            key={color}
                            className={`h-6 w-6 cursor-pointer rounded-full border bg-gradient-to-br transition-transform hover:scale-105 ${
                                sidenavColors[color]
                            } ${
                                sidenavColor === color ? 'border-black' : 'border-transparent'
                }`}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </div>
        </div>
        <div className='mb-12'>
          <Typography className='text-blue-gray-600 dark:text-gray-200' variant='h6'>
            Sidenav Types
          </Typography>
          <div className='mt-3 flex items-center gap-2'>
            <Button
                size='sm'
              variant={sidenavType === 'dark' ? 'gradient' : 'outlined'}
              onClick={() => {
                setSidenavType(dispatch, 'dark')
              }}
            >
              Dark
            </Button>
            <Button
                size='sm'
              variant={sidenavType === 'white' ? 'gradient' : 'outlined'}
              onClick={() => {
                setSidenavType(dispatch, 'white')
              } }
            >
              White
            </Button>
          </div>
        </div>
        <div className='mb-12'>
          <Typography className=' flex flex-row text-blue-gray-600 dark:text-gray-200' variant='h6'>
            Theme
            <div className='text-red-500 pr-0.5'>*</div>
            <div className='text-xs'>(Beta version)</div>
          </Typography>
          <div className='mt-3 flex items-center gap-2'>
            <Button
                size='sm'
                variant={theme === 'dark' ? 'gradient' : 'outlined'}
                onClick={() => {
                  setSidenavColor(dispatch, 'blue-gray')
                  setTheme(dispatch, 'dark')
                  localStorage.theme = 'dark'
                  document.documentElement.classList.remove('light-theme')
                  document.documentElement.classList.add('dark')
                  const root = document.documentElement
                  root.style.setProperty('--scrollbar-track-color', '#37474f')
                  root.style.setProperty('--select-color', '#303e42')
                  root.style.setProperty('--select-background-color', '#100f0f')
                  root.style.setProperty('--select-border', '#29373b')
                  root.style.setProperty('--select-text-color', '#ffffff')
                }}
            >
              Dark
            </Button>
            <Button
                size='sm'
                variant={theme !== 'dark' ? 'gradient' : 'outlined'}
                onClick={() => {
                  setSidenavColor(dispatch, 'blue')
                  setTheme(dispatch, 'light')
                  localStorage.theme = 'light'
                  document.documentElement.classList.remove('dark')
                  document.documentElement.classList.add('light-theme')
                  const root = document.documentElement
                  root.style.setProperty('--scrollbar-track-color', '#f1f1f1')
                  root.style.setProperty('--select-color', '#ffffff')
                  root.style.setProperty('--select-background-color', '#dad9d9')
                  root.style.setProperty('--select-border', '#dedede')
                  root.style.setProperty('--select-text-color', '#303e42')
                } }
            >
              White
            </Button>
          </div>
        </div>
        <div className='mb-12'>
          <hr />
          <div className='flex items-center justify-between py-5'>
            <Typography className='text-blue-gray-600 dark:text-gray-200' variant='h6'>
              Navbar Fixed
            </Typography>
            <Switch
              id='navbar-fixed'
              value={fixedNavbar}
              onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
            />
          </div>
          <hr />
        </div>
      </div>
    </aside>
  )
}

Configurator.displayName = '/src/widgets/layout/configurator.jsx'

export default Configurator

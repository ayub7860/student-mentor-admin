import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-tailwind/react'
import { MaterialTailwindControllerProvider } from '@/context'
import 'react-toastify/dist/ReactToastify.css'
import '../public/css/tailwind.css'
import { ToastContainer } from 'react-toastify'
import ScrollToTop from './widgets/components/ScrollToTop'
import NetworkStatusWarning from './widgets/components/NetworkStatusWarning'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <NetworkStatusWarning />
          <ScrollToTop smooth={true} />
          <App/>
          <ToastContainer stacked={true} />
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)

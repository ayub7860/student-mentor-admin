import React from 'react'
import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react'
import PropTypes from 'prop-types'

export function TablePagination ({ currentPage, totalPages, from, to, totalRecords, handlePerPageChange, handlePageChange, perPage }) {
  return (
    <div className='flex justify-end pt-2'>
      <nav aria-label='Page navigation example'>
        <ul className='flex list-style-none'>
          <li className='page-item self-center'>
            <Menu>
              <MenuHandler>
                <Button className='flex flex-row px-1 py-1 sm:px-2 sm:py-2' size='sm'
                                        variant='outlined'
                >{perPage} rows
                  <svg height='1.3em' viewBox='0 0 24 24' width='1.3em'
                                         xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='m12 15l-5-5h10z' fill='#34a4eb' />
                  </svg>
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={(event) => { event.preventDefault(); handlePerPageChange(50) }}>50</MenuItem>
                <MenuItem onClick={(event) => { event.preventDefault(); handlePerPageChange(100) }}>100</MenuItem>
                <MenuItem onClick={(event) => { event.preventDefault(); handlePerPageChange(250) }}>250</MenuItem>
                <MenuItem onClick={(event) => { event.preventDefault(); handlePerPageChange(500) }}>500</MenuItem>
              </MenuList>
            </Menu>
          </li>
          <li className='page-item disabled self-center'><a
                        className='page-link relative block py-1.5 px-1 sm:px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-800 dark:text-gray-200 pointer-events-none text-sm sm:text-base'
                        href='#'
                                                         >{from}-{to} of {totalRecords}</a></li>
          <li className='page-item self-center'><a
                        className='page-link relative block py-1.5 px-2 sm:px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-700 dark:text-gray-200 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 focus:shadow-none'
                        href='#' onClick={event => { event.preventDefault(); handlePageChange(1) }}
                                                ><i className='fas fa-backward-step' /></a></li>
          <li className='page-item self-center'><a
                        className='page-link relative block py-1.5 px-2 sm:px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-700 dark:text-gray-200 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 focus:shadow-none'
                        href='#' onClick={event => { event.preventDefault(); handlePageChange(currentPage - 1) }}
                                                ><i className='fas fa-caret-left' /></a></li>
          <li className='page-item disabled self-center'><a
                        className='page-link relative block py-1.5 px-1 sm:px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-800 dark:text-gray-200 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 focus:shadow-none pointer-events-none text-sm sm:text-base'
                        href='#'
                                                         >{currentPage}</a></li>
          <li className='page-item self-center'><a
                        className='page-link relative block py-1.5 px-2 sm:px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-700 dark:text-gray-200 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 focus:shadow-none'
                        href='#' onClick={event => { event.preventDefault(); handlePageChange(currentPage + 1) }}
                                                ><i className='fas fa-caret-right' /></a></li>
          <li className='page-item self-center'><a
                        className='page-link relative block py-1.5 px-2 sm:px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-700 dark:text-gray-200 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 focus:shadow-none'
                        href='#' onClick={event => { event.preventDefault(); handlePageChange(totalPages) }}
                                                ><i className='fas fa-forward-step' /></a></li>
        </ul>
      </nav>
    </div>
  )
}

TablePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  handlePerPageChange: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired
}

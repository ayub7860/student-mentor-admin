import React, { memo } from 'react'
import {
  Typography
} from '@material-tailwind/react'
import PropTypes from 'prop-types'

export const TableHeaderCell = memo(({ columnName, text, orderBy, handleOrderBy, isOrderByAvailable, orderDirection }) => {
  const isSorted = orderBy === columnName
  const order = isSorted ? 'fa-sort-' + orderDirection : 'fa-sort'

  const handleClick = event => {
    event.preventDefault()
    handleOrderBy(columnName)
  }

  return (
    <th key={columnName} className='border-b border-gray-700 py-2 px-2 text-left'>
      {isOrderByAvailable
        ? (
          <Typography
                    as='button'
                    className={`text-blue-gray-${isSorted ? '700' : '400'} dark:text-gray-200 text-[11px] font-bold flex flex-row truncate`}
                    variant='small'
                    onClick={handleClick}
          >
            {text} <i className={`pl-1 fas ${order}`} />
          </Typography>
          )
        : (
          <Typography
                    as='button'
                    className={'text-blue-gray-400 dark:text-gray-200 text-[11px] font-bold flex flex-row truncate'}
                    variant='small'
          >
            {text}
          </Typography>
          )}

    </th>
  )
})

TableHeaderCell.propTypes = {
  text: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  handleOrderBy: PropTypes.func.isRequired,
  isOrderByAvailable: PropTypes.bool.isRequired
}

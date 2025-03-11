import React, { memo } from 'react'
import {
  Typography
} from '@material-tailwind/react'
import PropTypes from 'prop-types'

export const TableCell = memo(({ text }) => {
  return (
    <td className='py-1 px-2 border-b border-blue-gray-50'>
      {text && (
        <Typography className='text-xs font-semibold text-blue-gray-600 dark:text-gray-200'>
          {text}
        </Typography>
      )}

    </td>
  )
})

TableCell.propTypes = {
  text: PropTypes.node
}

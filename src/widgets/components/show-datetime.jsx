import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React from 'react'
dayjs.extend(customParseFormat)

export function ShowDateTime (props) {
  const date = dayjs(props.timestamp, { format: 'DD MM YYYY, h:mm a' })
  const formattedDate = date.format('DD MMM YYYY, h:mm a')
  return <>{formattedDate}</>
}

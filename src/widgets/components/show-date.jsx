import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React from 'react'
dayjs.extend(customParseFormat)

export function ShowDate (props) {
  if (props.timestamp) {
    const date = new Date(props.timestamp)
    const dateTemp = dayjs(date, { format: 'DD MM YYYY, h:mm a' })
    const formatedDate = dateTemp.format('DD MMM YYYY')
    return <>{formatedDate}</>
  } else {
    return <></>
  }
}

import { Button } from '@material-tailwind/react'

export function CloseButton ({ onClick }) {
  return (
    <Button className='mr-1' color='red' variant='text' onClick={onClick}>
      <span>Close</span>
    </Button>
  )
}

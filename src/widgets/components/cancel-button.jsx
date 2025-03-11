import { Button } from '@material-tailwind/react'

export function CancelButton ({ onClick }) {
  return (
    <Button className='mr-1' color='red' variant='text' onClick={onClick}>
      <span>Cancel</span>
    </Button>
  )
}

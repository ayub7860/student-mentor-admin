import { Button } from '@material-tailwind/react'

export function ClearButton ({ onClick }) {
  return (
    <Button className='mr-1' color='red' variant='text' onClick={onClick}>
      <span>Clear</span>
    </Button>
  )
}

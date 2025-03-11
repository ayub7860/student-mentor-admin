import { Button } from '@material-tailwind/react'

export function UpdateButton ({ onClick }) {
  return (
    <Button color='green' variant='gradient' onClick={onClick}>
      <span>Update</span>
    </Button>
  )
}

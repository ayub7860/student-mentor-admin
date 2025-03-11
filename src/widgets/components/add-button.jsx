import { Button } from '@material-tailwind/react'

export function AddButton ({ onClick }) {
  return (
    <Button color='green' variant='gradient' onClick={onClick}>
      <span>Add</span>
    </Button>
  )
}

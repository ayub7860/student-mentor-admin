import { Button } from '@material-tailwind/react'

export function SubmitButton ({ onClick }) {
  return (
    <Button color='green' variant='gradient' onClick={onClick}>
      <span>Submit</span>
    </Button>
  )
}

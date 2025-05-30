'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {
  FormStatus,
  useFormStatus
} from 'react-dom'
import SubmitButtonProps from '@/types/SubmitButtonProps'
const SubmitButton: FunctionComponent<SubmitButtonProps> = ({
  message,
  action
}): ReactElement => {
  const {pending}: FormStatus = useFormStatus()
  return (
    <button
      className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
      type='submit'
      disabled={pending}
    >
      {pending ? message : action}
    </button>
  )
}
export default SubmitButton
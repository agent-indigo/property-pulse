'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {useGlobalContext} from '@/components/GlobalContextProvider'
import State from '@/interfaces/State'
const UnreadMessagesCount: FunctionComponent = (): ReactElement | null => {
  const {unreadMessagesCount}: State = useGlobalContext()
  return unreadMessagesCount > 0 ? (
    <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
      {unreadMessagesCount}
    </span>
  ) : null
}
export default UnreadMessagesCount
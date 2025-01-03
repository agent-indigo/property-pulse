import Link from 'next/link'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import InfoBoxProps from '@/interfaces/InfoBoxProps'
const InfoBox: FunctionComponent<InfoBoxProps> = ({
  heading,
  bgColor = 'bg-gray-100',
  textColor = 'text-gray-800',
  buttonProps,
  children
}): ReactElement => (
  <div className={`${bgColor} p-6 rounded-lg shadow-md`}>
    <h2 className={`${textColor} text-2xl font-bold`}>
      {heading}
    </h2>
    <p className={`${textColor} mt-2 mb-4`}>
      {children}
    </p>
    <Link
      href={buttonProps.url}
      className={`inline-block ${
        buttonProps.bgColor
      } text-white rounded-lg px-4 py-2 hover:opacity-80`}
    >
      {buttonProps.text}
    </Link>
  </div>
)
export default InfoBox
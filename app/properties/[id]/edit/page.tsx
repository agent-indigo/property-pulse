import type {Metadata} from 'next'
import {ReactElement} from 'react'
import EditPropertyForm from '@/components/EditPropertyForm'
export const metadata: Metadata = {
  title: 'Edit Property'
}
const EditPropertyPage: React.FC = (): ReactElement => (
  <section className='bg-blue-50'>
    <div className='container m-auto max-w-2xl py-24'>
      <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
        <EditPropertyForm/>
      </div>
    </div>
  </section>
)
export default EditPropertyPage
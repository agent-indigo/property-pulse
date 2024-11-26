import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import Link from 'next/link'
import {FaArrowLeft} from 'react-icons/fa'
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import PropertyDetails from '@/components/PropertyDetails'
import PropertyImages from '@/components/PropertyImages'
import BookmarkButton from '@/components/BookmarkButton'
import ContactForm from '@/components/ContactForm'
import ShareButtons from '@/components/ShareButtons'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
import PlainProperty from '@/interfaces/PlainProperty'
import UrlParams from '@/interfaces/UrlParams'
export const metadata: Metadata = {
  title: 'Property Details'
}
const PropertyPage: FunctionComponent<UrlParams> = async ({
  params
}): Promise<ReactElement> => {
  await connectToMongoDB()
  const property: PlainProperty = convertToPlainDocument(await propertyModel
    .findById(params.id)
    .lean()
  )
  return (
    <>
      <PropertyHeaderImage image={property.images[0]}/>
      <section>
        <div className='container m-auto py-6 px-6'>
          <Link
            href='/properties'
            className='text-blue-500 hover:text-blue-600 flex items-center'
          >
            <FaArrowLeft className='mr-2'/>
            Back to All Properties
          </Link>
        </div>
      </section>
      <section className='bg-blue-50'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            <PropertyDetails property={property}/>
            <aside className='space-y-4'>
              <BookmarkButton property={property}/>
              <ShareButtons property={property}/>
              <ContactForm property={property}/>
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={property.images}/>
    </>
  )
}
export default PropertyPage
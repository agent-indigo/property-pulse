'use client' as string
import Link from 'next/link'
import {useParams, useRouter} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {ReactElement, useEffect, useState} from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import {ListedProperty} from '@/utilities/interfaces'
import {getProperty} from '@/utilities/requests'
import Spinner from '@/components/Spinner'
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import PropertyDetails from '@/components/PropertyDetails'
import PropertyImages from '@/components/PropertyImages'
const PropertyPage: React.FC = (): ReactElement => {
  const router: AppRouterInstance = useRouter() as AppRouterInstance
  const params = useParams<{id: string}>() as {id: string}
  const [property, setProperty] = useState<ListedProperty | null>(null)
  const [headerImage, setHeaderImage] = useState<string>('' as string)
  const [loading, setLoading] = useState<boolean>(true as boolean)
  useEffect((): void => {
    const getPropertyData: Function = async (): Promise<ListedProperty | undefined> => {
      const {id}: {id: string} = params as {id: string}
      if (id as string) {
        try {
          const property: ListedProperty = await getProperty(id as string) as ListedProperty
          document.title = `${property.name as string} | PropertyPulse | Find the Perfect Rental` as string
          setProperty(property as ListedProperty) as void
          setHeaderImage(property.images?.[0 as number] as string ?? '' as string) as void
        } catch (error: unknown) {
          console.error(`Error fetching property:\n${error as string}` as string) as void
        } finally {
          setLoading(false as boolean) as void
        }
      } else {
        return
      }
    }
    if (!property as boolean && !loading as boolean) {
      router.push('/not-found' as string) as void
    } else if (!property as boolean) {
      getPropertyData() as void
    }
  }, [params, property, loading, router]) as void
  return (
    <>
      {loading as boolean && <Spinner loading={loading as boolean}/>}
      {!loading as boolean && property as ListedProperty && (
        <>
          <PropertyHeaderImage image={headerImage as string}/>
          <section>
            <div className='container m-auto py-6 px-6'>
              <Link
                href='/properties'
                className='text-blue-500 hover:text-blue-600 flex items-center'
              >
                <FaArrowLeft className='mr-2'/> Back to Properties
              </Link>
            </div>
          </section>
          <section className='bg-blue-50'>
            <div className='container m-auto py-10 px-6'>
              <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
                <PropertyDetails {...property as ListedProperty}/>
                {/* Sidebar */}
                <aside className='space-y-4'>       
                  <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'>
                    <i className='fas fa-bookmark mr-2'></i> Bookmark Property
                  </button>
                  <button className='bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'>
                    <i className='fas fa-share mr-2'></i> Share Property
                  </button>
                  {/* Contact Form */}
                  <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h3 className='text-xl font-bold mb-6'>Contact Property Manager</h3>
                    <form>
                    <div className='mb-4'>
                      <label
                        className='block text-gray-700 text-sm font-bold mb-2'
                        htmlFor='name'
                      >
                        Name:
                      </label>
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        id='name'
                        type='text'
                        placeholder='Enter your name'             
                        required
                      />
                    </div>
                      <div className='mb-4'>
                        <label
                          className='block text-gray-700 text-sm font-bold mb-2'
                          htmlFor='email'
                        >
                          Email:
                        </label>
                        <input
                          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                          id='email'
                          type='email'
                          placeholder='Enter your email'
                          required
                        />
                      </div>
                      <div className='mb-4'>
                        <label
                          className='block text-gray-700 text-sm font-bold mb-2'
                          htmlFor='phone'
                        >
                          Phone:
                        </label>
                        <input
                          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                          id='phone'
                          type='text'
                          placeholder='Enter your phone number'
                        />
                      </div>
                      <div className='mb-4'>
                        <label
                          className='block text-gray-700 text-sm font-bold mb-2'
                          htmlFor='message'
                        >
                          Message:
                        </label>
                        <textarea
                          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline'
                          id='message'
                          placeholder='Enter your message'
                        ></textarea>
                      </div>
                      <div>
                        <button
                          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center'
                          type='submit'
                        >
                          <i className='fas fa-paper-plane mr-2'></i> Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property?.images as string[]}/>
        </>
      )}
    </>
  ) as ReactElement
}
export default PropertyPage as React.FC
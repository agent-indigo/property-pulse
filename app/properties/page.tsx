'use client'
import {FunctionComponent, ReactElement} from 'react'
import {Helmet} from 'react-helmet'
import {ReadonlyURLSearchParams, useSearchParams} from 'next/navigation'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import Properties from '@/components/Properties'
const PropertiesPage: FunctionComponent = (): ReactElement => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams()
  return (
    <>
      <Helmet>
        <title>
          Properties | PropertyPulse | Find the Perfect Rental
        </title>
      </Helmet>
      <section className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <SearchPropertiesForm/>
        </div>
      </section>
      <Properties pageNumber={Number.parseInt(searchParams.get('page') ?? '1')}/>
    </>
  )
}
export default PropertiesPage
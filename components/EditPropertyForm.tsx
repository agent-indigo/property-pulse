'use client'
import {ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {useParams, useRouter} from 'next/navigation'
import {toast} from 'react-toastify'
import {Helmet} from 'react-helmet'
import {useGetPropertyQuery, useEditPropertyMutation} from '@/slices/propertiesApiSlice'
import {FormCheck, FormInput, ListedProperty} from '@/utilities/interfaces'
import Spinner from '@/components/Spinner'
const EditPropertyForm: FunctionComponent = (): ReactElement | null => {
  const router: AppRouterInstance = useRouter()
  const params: Params = useParams()
  const id: string = params.id
  const {data: property, isLoading, isError, error} = useGetPropertyQuery(id ?? '')
  const [editProperty, {isLoading: editing, isError: editFailed, error: editingError}] = useEditPropertyMutation()
  const [mounted, setMounted] = useState<boolean>(false)
  const [fields, setFields] = useState<ListedProperty>({
    name: '',
    type: '',
    description: '',
    location: {
      street: '',
      city: '',
      state: '',
      zipcode: ''
    },
    beds: 0,
    baths: 0,
    square_feet: 0,
    amenities: [],
    rates: {},
    seller_info: {
      name: '',
      email: '',
      phone: ''
    }
  })
  const handleInput: ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement> = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const {name, value}: FormInput = event.target
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.')
      setFields((previousValues: ListedProperty): ListedProperty => ({
        ...previousValues,
        [outerKey]: {
          ...previousValues[outerKey as keyof ListedProperty] as object,
          [innerKey]: value
        }
      }))
    } else {
      setFields((previousValues: ListedProperty): ListedProperty => ({
        ...previousValues,
        [name]: value
      }))
    }
  }
  const handleCheckbox: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>): void => {
    const {value, checked}: FormCheck = event.target
    const amenities: string[] = [...fields.amenities]
    if (checked) {
      amenities.push(value)
    } else {
      const index: number = amenities.indexOf(value)
      index !== -1 && amenities.splice(index, 1)
    }
    setFields((previousValues: ListedProperty): ListedProperty => ({
      ...previousValues,
      amenities
    }))
  }
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    await editProperty({id, fields})
    if (!editing) {
      if (editFailed) {
        toast.error(`Error editing property:\n${JSON.stringify(editingError)}`)
      } else {
        toast.success('Property updated.')
        router.push(`/properties/${id}`)
      }
    }
  }
  useEffect(
    (): void => {
      if (!isLoading) {
        if (isError) {
          toast.error(`Error editing property:\n${JSON.stringify(error)}`)
          router.push('/error')
        } else {
          if (property) {
            setFields(property)
            setMounted(true)
          }
        }
      }
    },
    [isError, error, router, property, isLoading]
  )
  return isLoading || editing ? (
    <>
      <Helmet>
        <title>
          {isLoading ? 'Loading...' : 'Processing...'} | PropertyPulse | Find the Perfect Rental
        </title>
      </Helmet>
      <Spinner loading={isLoading ? isLoading : editing}/>
    </>
  ) : mounted ? (
    <form onSubmit={handleSubmit}>
      <h2 className='text-3xl text-center font-semibold mb-6'>
        Edit Property
      </h2>
      <div className='mb-4'>
        <label
          htmlFor='type'
          className='block text-gray-700 font-bold mb-2'
        >
          Property Type
        </label>
        <select
          id='type'
          name='type'
          className='border rounded w-full py-2 px-3'
          value={fields.type}
          onChange={handleInput}
          required
        >
          <option value='Apartment'>
            Apartment
          </option>
          <option value='Condo'>
            Condo
          </option>
          <option value='House'>
            House
          </option>
          <option value='Cabin Or Cottage'>
            Cabin or Cottage
          </option>
          <option value='Room'>
            Room
          </option>
          <option value='Studio'>
            Studio
          </option>
          <option value='Other'>
            Other
          </option>
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Listing Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='eg. Beautiful Apartment In Miami'
          value={fields.name}
          onChange={handleInput}
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='description'
          className='block text-gray-700 font-bold mb-2'
        >
          Description
        </label>
        <textarea
          id='description'
          name='description'
          className='border rounded w-full py-2 px-3'
          rows={4}
          placeholder='Add a description of your property'
          value={fields.description}
          onChange={handleInput}
        />
      </div>
      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Location
        </label>
        <label
          htmlFor='street'
          className='block text-gray-700 font-bold mb-2'
        >
          Street
        </label>
        <input
          type='text'
          id='street'
          name='location.street'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Street'
          value={fields.location.street}
          onChange={handleInput}
        />
        <label
          htmlFor='city'
          className='block text-gray-700 font-bold mb-2'
        >
          City
        </label>
        <input
          type='text'
          id='city'
          name='location.city'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='City'
          value={fields.location.city}
          onChange={handleInput}
          required
        />
        <label
          htmlFor='state'
          className='block text-gray-700 font-bold mb-2'
        >
          State
        </label>
        <input
          type='text'
          id='state'
          name='location.state'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='State'
          value={fields.location.state}
          onChange={handleInput}
          required
        />
        <label
          htmlFor='zipcode'
          className='block text-gray-700 font-bold mb-2'
        >
          Zip Code
        </label>
        <input
          type='text'
          id='zipcode'
          name='location.zipcode'
          className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Zipcode'
          value={fields.location.zipcode}
          onChange={handleInput}
        />
      </div>
      <div className='mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/3 pr-2'>
          <label
            htmlFor='beds'
            className='block text-gray-700 font-bold mb-2'
          >
            Beds
          </label>
          <input
            type='number'
            id='beds'
            name='beds'
            className='border rounded w-full py-2 px-3'
            value={fields.beds}
            onChange={handleInput}
            required
          />
        </div>
        <div className='w-full sm:w-1/3 px-2'>
          <label
            htmlFor='baths'
            className='block text-gray-700 font-bold mb-2'
          >
            Baths
          </label>
          <input
            type='number'
            id='baths'
            name='baths'
            className='border rounded w-full py-2 px-3'
            value={fields.baths}
            onChange={handleInput}
            required
          />
        </div>
        <div className='w-full sm:w-1/3 pl-2'>
          <label
            htmlFor='square_feet'
            className='block text-gray-700 font-bold mb-2'
          >
            Square Feet
          </label>
          <input
            type='number'
            id='square_feet'
            name='square_feet'
            className='border rounded w-full py-2 px-3'
            value={fields.square_feet}
            onChange={handleInput}
            required
          />
        </div>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Amenities
        </label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          <div>
            <input
              type='checkbox'
              id='amenity_wifi'
              name='amenities'
              value='Wifi'
              className='mr-2'
              checked={fields.amenities.includes('Wifi')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_wifi'>
              Wifi
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_kitchen'
              name='amenities'
              value='Full Kitchen'
              className='mr-2'
              checked={fields.amenities.includes('Full Kitchen')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_kitchen'>
              Full kitchen
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_washer_dryer'
              name='amenities'
              value='Washer & Dryer'
              className='mr-2'
              checked={fields.amenities.includes('Washer & Dryer')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_washer_dryer'>
              Washer & Dryer
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_free_parking'
              name='amenities'
              value='Free Parking'
              className='mr-2'
              checked={fields.amenities.includes('Free Parking')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_free_parking'>
              Free Parking
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_pool'
              name='amenities'
              value='Swimming Pool'
              className='mr-2'
              checked={fields.amenities.includes('Swimming Pool')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_pool'>
              Swimming Pool
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_hot_tub'
              name='amenities'
              value='Hot Tub'
              className='mr-2'
              checked={fields.amenities.includes('Hot Tub')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_hot_tub'>
              Hot Tub
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_24_7_security'
              name='amenities'
              value='24/7 Security'
              className='mr-2'
              checked={fields.amenities.includes('24/7 Security')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_24_7_security'>
              24/7 Security
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_wheelchair_accessible'
              name='amenities'
              value='Wheelchair Accessible'
              className='mr-2'
              checked={fields.amenities.includes('Wheelchair Accessible')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_wheelchair_accessible'>
              Wheelchair Accessible
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_elevator_access'
              name='amenities'
              value='Elevator Access'
              className='mr-2'
              checked={fields.amenities.includes('Elevator Access')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_elevator_access'>
              Elevator Access
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_dishwasher'
              name='amenities'
              value='Dishwasher'
              className='mr-2'
              checked={fields.amenities.includes('Dishwasher')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_dishwasher'>
              Dishwasher
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_gym_fitness_center'
              name='amenities'
              value='Gym/Fitness Center'
              className='mr-2'
              checked={fields.amenities.includes('Gym/Fitness Center')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_gym_fitness_center'>
              Gym/Fitness Center
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_air_conditioning'
              name='amenities'
              value='Air Conditioning'
              className='mr-2'
              checked={fields.amenities.includes('Air Conditioning')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_air_conditioning'>
              Air Conditioning
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_balcony_patio'
              name='amenities'
              value='Balcony/Patio'
              className='mr-2'
              checked={fields.amenities.includes('Balcony/Patio')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_balcony_patio'>
              Balcony/Patio
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_smart_tv'
              name='amenities'
              value='Smart TV'
              className='mr-2'
              checked={fields.amenities.includes('Smart TV')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_smart_tv'>
              Smart TV
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='amenity_coffee_maker'
              name='amenities'
              value='Coffee Maker'
              className='mr-2'
              checked={fields.amenities.includes('Coffee Maker')}
              onChange={handleCheckbox}
            />
            <label htmlFor='amenity_coffee_maker'>
              Coffee Maker
            </label>
          </div>
        </div>
      </div>
      <div className='mb-4 bg-blue-50 p-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Rates (Leave blank if not applicable)
        </label>
        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='flex items-center'>
            <label
              htmlFor='weekly_rate'
              className='mr-2'
            >
              Weekly
            </label>
            <input
              type='number'
              id='weekly_rate'
              name='rates.weekly'
              className='border rounded w-full py-2 px-3'
              value={fields.rates.weekly ?? ''}
              onChange={handleInput}
            />
          </div>
          <div className='flex items-center'>
            <label
              htmlFor='monthly_rate'
              className='mr-2'
            >
              Monthly
            </label>
            <input
              type='number'
              id='monthly_rate'
              name='rates.monthly'
              className='border rounded w-full py-2 px-3'
              value={fields.rates.monthly ?? ''}
              onChange={handleInput}
            />
          </div>
          <div className='flex items-center'>
            <label
              htmlFor='nightly_rate'
              className='mr-2'
            >
              Nightly
            </label>
            <input
              type='number'
              id='nightly_rate'
              name='rates.nightly'
              className='border rounded w-full py-2 px-3'
              value={fields.rates.nightly ?? ''}
              onChange={handleInput}
            />
          </div>
        </div>
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_name'
          className='block text-gray-700 font-bold mb-2'
        >
          Owner Name
        </label>
        <input
          type='text'
          id='seller_name'
          name='seller_info.name'
          className='border rounded w-full py-2 px-3'
          placeholder='Name'
          value={fields.seller_info.name}
          onChange={handleInput}
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_email'
          className='block text-gray-700 font-bold mb-2'
        >
          Owner Email
        </label>
        <input
          type='email'
          id='seller_email'
          name='seller_info.email'
          className='border rounded w-full py-2 px-3'
          placeholder='Email address'
          value={fields.seller_info.email}
          onChange={handleInput}
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='seller_phone'
          className='block text-gray-700 font-bold mb-2'
        >
          Owner Phone
        </label>
        <input
          type='tel'
          id='seller_phone'
          name='seller_info.phone'
          className='border rounded w-full py-2 px-3'
          placeholder='Phone'
          value={fields.seller_info.phone}
          onChange={handleInput}
        />
      </div>
      <div>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
          type='submit'
        >
          Save Changes
        </button>
      </div>
    </form>
  ) : null
}
export default EditPropertyForm
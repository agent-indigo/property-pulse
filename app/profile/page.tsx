import {
  FunctionComponent,
  ReactElement
} from 'react'
import Image from 'next/image'
import {Metadata} from 'next'
import profileDefault from '@/assets/images/profile.png'
import ProfileProperties from '@/components/ProfileProperties'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import getSessionUser from '@/serverActions/getSessionUser'
import propertyModel from '@/models/propertyModel'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainProperty from '@/interfaces/PlainProperty'
export const metadata: Metadata = {
  title: 'Profile'
}
const ProfilePage: FunctionComponent =  async (): Promise<ReactElement> => {
  const {sessionUser}: ServerActionResponse = await getSessionUser()
  await connectToMongoDB()
  const properties: PlainProperty[] = JSON.parse(JSON.stringify(await propertyModel.find({
    owner: sessionUser?._id
  }).lean()))
  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>
            Your Profile
          </h1>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-1/4 mx-20 mt-10'>
              <div className='mb-4'>
                <Image
                  className='h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0'
                  src={sessionUser?.image ?? profileDefault}
                  width={200}
                  height={200}
                  alt='User'
                />
              </div>
              <h2 className='text-2xl mb-4'>
                {sessionUser?.username}
              </h2>
              <h2 className='text-2xl mb-4'>
                {sessionUser?.email}
              </h2>
            </div>
            <div className='md:w-3/4 md:pl-4'>
              <h2 className='text-xl font-semibold mb-4'>
                Your Listings
              </h2>
              {properties.length === 0 ? (
                <p>
                  You have no listings.
                </p>
              ) : (
                <ProfileProperties properties={properties}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ProfilePage